define("jira/setup/setup-finishing-notifications-view", ["wrm/context-path", "jquery", "marionette", "underscore", 'jira/util/formatter'], function (wrmContextPath, $, Marionette, _, formatter) {

    var abortAwareErrorHandler = function abortAwareErrorHandler(callback) {
        return _.bind(function (xhr, textStatus, errorThrown) {
            if (textStatus == "abort") {
                // don't handle
                return;
            }

            if (textStatus == "error" && xhr.readyState == 0) {
                // this is how Safari shows aborted xhr: do not handle
                return;
            }

            callback.call(this, xhr, textStatus, errorThrown);
        }, this);
    };

    var jiraInternalErrorAwareHandler = function jiraInternalErrorAwareHandler(callback) {
        return _.bind(function (xhr, textStatus, errorThrown) {
            if (xhr.status >= 500) {
                this._navigateToErrorPage();
                return;
            }

            callback.call(this, xhr, textStatus, errorThrown);
        }, this);
    };

    return Marionette.ItemView.extend({
        el: ".jira-setup-finishing-notifications-view",
        template: JIRA.Templates.Setup.Finishing.notificationsView,

        ui: {
            "errorMessage": ".jira-setup-finishing-error",
            "notificationsItem": ".jira-setup-finishing-notifications-item",
            "refreshLink": ".jira-setup-finishing-refresh",
            "timeoutWarning": ".jira-setup-finishing-timeout-warning"
        },

        _allowedStatuses: ["awaiting", "pending", "success", "failure"],
        _lagTimeout: null,
        _jqXhrInFlight: null,
        // describes current level / phase of setup, which are:
        // waitingToStart, triggering, triggeringComplete, triggeringError, pullingState, finishing, finishingError, complete
        _setupLevel: "waitingToStart",

        initialize: function initialize() {
            this._showTimeoutWarning = false;

            this._errorMessage = null;
            this._steps = [{
                key: "database",
                text: this.$el.data("database-label"),
                status: "pending"
            }, {
                key: "plugins",
                text: this.$el.data("plugins-label"),
                status: "awaiting"
            }, {
                key: "environment",
                text: this.$el.data("environment-label"),
                status: "awaiting"
            }, {
                key: "finishing",
                text: this.$el.data("finishing-label"),
                status: "awaiting"
            }];

            this.bindUIElements();
        },

        serializeData: function serializeData() {
            return _.extend({}, {
                errorMessage: this._errorMessage,
                steps: this._steps,
                timeoutWarning: this._showTimeoutWarning
            });
        },

        _navigateToErrorPage: function _navigateToErrorPage() {
            window.onbeforeunload = null;
            window.location.href = wrmContextPath() + "/secure/errors.jsp";
        },

        _requestErrorHandlerWrapper: function _requestErrorHandlerWrapper(callback) {
            return abortAwareErrorHandler.call(this, jiraInternalErrorAwareHandler.call(this, callback));
        },

        triggerSetup: function triggerSetup() {
            var atlToken = $("input[name='atl_token']").val();
            var url = formatter.format(wrmContextPath() + "/secure/SetupFinishing!triggerSetup.jspa?atl_token={0}", atlToken);

            this._setupLevel = "triggering";
            this._jqXhrInFlight = $.ajax({
                timeout: 60000, // minute
                url: url,
                type: "POST",
                dataType: "json",
                success: _.bind(this._triggerSetupSuccessHandler, this),
                error: this._requestErrorHandlerWrapper(this._triggerSetupErrorHandler)
            });
        },

        _triggerSetupSuccessHandler: function _triggerSetupSuccessHandler() {
            this._setupLevel = "triggeringComplete";
            this.bootstrapStatePulling();
        },

        _triggerSetupErrorHandler: function _triggerSetupErrorHandler() {
            this._errorMessage = this._ajaxErrorLabel();
            this._setupLevel = "triggeringError";

            // set all steps as awaiting
            _.each(this._steps, function (step) {
                step.status = "awaiting";
            });

            this.render();
        },

        _dismissLagMessage: function _dismissLagMessage() {
            _.each(this._steps, function (step) {
                delete step.hasLag;
            });
        },

        _showLagMessage: function _showLagMessage() {
            var alreadySet = false;

            this._dismissLagMessage();

            _.each(this._steps, function (step) {
                if (!alreadySet && step.status === "pending") {
                    step.hasLag = true;
                    alreadySet = true;
                }
            });

            this.render();
        },

        bootstrapStatePulling: function bootstrapStatePulling() {
            // cancel lag message timeout in case it's still live
            clearTimeout(this._lagTimeout);
            this._lagTimeout = null;

            // cancel any xhr in flight
            if (this._jqXhrInFlight) {
                this._jqXhrInFlight.abort();
                this._jqXhrInFlight = null;
            }

            switch (this._setupLevel) {
                case "waitingToStart":
                    this.triggerSetup();
                    break;
                case "triggering":
                    this.triggerSetup();
                    break;
                case "triggeringComplete":
                    this._pullState();
                    break;
                case "pullingState":
                    this._pullState();
                    break;
                case "finishing":
                    this._makeRequestFinishingSetup();
                    break;
            }
        },

        _pullState: function _pullState() {
            this._lagTimeout = setTimeout(_.bind(this._showLagMessage, this), 15000);
            this._setupLevel = "pullingState";
            this._pullStateWithoutLagTimeout();
        },

        _pullStateWithoutLagTimeout: function _pullStateWithoutLagTimeout() {
            if (!this._findCurrentlyPendingStep()) {
                return;
            }

            this._jqXhrInFlight = $.ajax({
                timeout: 300000, // five minutes
                url: wrmContextPath() + "/setupprogress",
                type: "GET",
                data: {
                    "askingAboutStep": this._findCurrentlyPendingStep().key
                },
                dataType: "json",
                success: _.bind(this._pullStateSuccessHandler, this),
                error: this._requestErrorHandlerWrapper(this._pullStateErrorHandler)
            });
        },

        _pullStateSuccessHandler: function _pullStateSuccessHandler(data) {
            clearTimeout(this._lagTimeout);
            this._dismissLagMessage();
            this._showTimeoutWarning = false;

            this._updateStepsWithNewStatuses(data.steps);
            if (data.errorMessage) {
                this._errorMessage = data.errorMessage;
            } else if (!this._findCurrentlyPendingStep()) {
                //setup is done, performing final step
                this._makeRequestFinishingSetup();
            } else {
                setTimeout(_.bind(function () {
                    this._pullState();
                }, this), 0);
            }

            this.render();
        },

        _makeRequestFinishingSetup: function _makeRequestFinishingSetup() {
            this._setupLevel = "finishing";
            this._jqXhrInFlight = $.ajax({
                timeout: 60000, //minute
                url: wrmContextPath() + "/secure/SetupFinishing!setupFinished.jspa",
                type: "GET",
                dataType: "json",
                success: _.bind(this._makeRequestFinishingSetupSuccessHandler, this),
                error: this._requestErrorHandlerWrapper(this._makeRequestFinishingSetupErrorHandler)
            });
        },

        _makeRequestFinishingSetupSuccessHandler: function _makeRequestFinishingSetupSuccessHandler(data) {
            this._jqXhrInFlight = null;
            this._setupLevel = "complete";
            this.trigger("setup-complete", {
                redirectUrl: data.redirectUrl,
                SEN: data.SEN
            });
        },

        _makeRequestFinishingSetupErrorHandler: function _makeRequestFinishingSetupErrorHandler() {
            this._errorMessage = this._ajaxErrorLabel();
            this._setupLevel = "finishingError";
            this.render();
        },

        _updateStepsWithNewStatuses: function _updateStepsWithNewStatuses(stepsWithNewStatuses) {
            var allowedStatuses = this._allowedStatuses;
            _.each(this._steps, function updateStatusIfAllowed(step) {
                var newStatus = stepsWithNewStatuses[step.key];
                if (_.contains(allowedStatuses, newStatus)) {
                    step.status = newStatus;
                }
            });
        },

        _pullStateErrorHandler: function _pullStateErrorHandler(jqXHR, textStatus) {
            if (textStatus === "timeout") {
                clearTimeout(this._lagTimeout);
                this._dismissLagMessage();
                this._showTimeoutWarning = true;

                setTimeout(_.bind(function () {
                    this._pullStateWithoutLagTimeout();
                }, this), 0);
                this.render();
            } else {
                clearTimeout(this._lagTimeout);
                this._dismissLagMessage();
                this._errorMessage = this._ajaxErrorLabel();
                this._showTimeoutWarning = false;

                setTimeout(_.bind(function () {
                    this._pullStateWithoutLagTimeout();
                }, this), 10000); //ten seconds
                this.render();
            }
        },

        _findCurrentlyPendingStep: function _findCurrentlyPendingStep() {
            return _.find(this._steps, function isPending(step) {
                return step.status === "pending";
            });
        },

        _ajaxErrorLabel: function _ajaxErrorLabel() {
            return this.$el.data("error-ajax-label");
        }
    });
});