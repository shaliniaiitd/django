/**
 * An enum specifying the different AUI message types and their renderers. @see messages.soy
 */
define('jira/message/templates', ['underscore'], function (_) {
    'use strict';

    var tpl = JIRA.Templates.Messages;

    // we leave the "WARNING", "ERROR, "SUCCESS", "INFO" IDs for backwards compatibility only.
    return _.extend({
        WARNING: tpl.warningMsg,
        ERROR: tpl.errorMsg,
        SUCCESS: tpl.successMsg,
        INFO: tpl.infoMsg
    }, tpl);
});

define('jira/message', ['jira/flag', 'jquery', 'jira/message/templates', 'jira/data/local-storage'], function (flag, jQuery, Templates, store) {
    'use strict';

    // Default number of seconds before a message is automatically dismissed.

    var DefaultTimeout = 10;

    /**
     * Builds an AUI message of specified type
     *
     * @param {string} msg - HTML of message
     * @param {Object} [options={}] - config
     * @param {function} options.type - Soy template for the message type. Typically one defined on "jira/message/templates".
     * @param {Boolean} options.closeable - Whether the message is dismissable by a close button
     * @param {Number} options.timeout - Number of seconds before the message automatically fades out. To
     * have no timeout, use -1.
     *
     * @return jQuery
     */
    function buildMsg(msg, options) {

        options = options || {};

        // type is a soy template
        var html = options.type({
            msg: msg,
            closeable: options.closeable
        });

        var $container = jQuery('<div>').html(html);
        var timeout = options.timeout != null ? options.timeout : DefaultTimeout;
        var timer;

        if (options.closeable) {
            $container.find(".aui-close-button").click(function (e) {
                e.preventDefault();
                if (timer != null) {
                    window.clearTimeout(timer);
                }
                $container.remove();
            });
        }

        if (timeout > 0) {
            timer = window.setTimeout(function () {
                $container.fadeOut(function () {
                    $container.remove();
                });
            }, timeout * 1000);
        }

        return $container;
    }

    /**
     * Shows a message at specified target
     *
     * @param {string} msg - HTML of message
     * @param {Object} [options={}] - config
     * @param {function} options.type - Soy template for the message type. Typically one defined on "jira/message/templates".
     * @param {Boolean} options.closeable - Whether the message is dismissable by a close button
     * @param {Number} options.timeout - Number of seconds before the message automatically fades out. To
     * have no timeout, use -1.
     *
     * @return jQuery
     */
    function showMessageAtTarget(msg, options) {
        options = options || {};
        var $msg = buildMsg(msg, options);
        return $msg.prependTo(options.target);
    }

    /**
     * Shows a message after the page has been reloaded or redirected
     *
     * @param {string} msg - HTML of message
     * @param {Object} [options={}] - config
     * @param {string} options.type - AUI message type ("WARNING", "ERROR, "SUCCESS", "INFO")
     * @param {Boolean} options.closeable - Whether the message is dismissable by a close button
     * @param {Number} options.timeout - Number of seconds before the message automatically fades out. To
     * have no timeout, use -1.
     *
     * If not target specified will be a global message.
     */
    var showMsgOnReload = function () {

        // Keys we use to store in HTML5 Session Storage
        var SESSION_MSG_KEY = "jira.messages.reloadMessageMsg";
        var SESSION_MSG_TYPE_KEY = "jira.messages.reloadMessageType";
        var SESSION_MSG_CLOSEABLE_KEY = "jira.messages.reloadMessageCloseable";
        var SESSION_MSG_TARGET_KEY = "jira.messages.reloadMessageTarget";

        // Show message if there is any on reload
        jQuery(function () {
            // eslint-disable-line @atlassian/onready-checks/no-jquery-onready
            var msg = store.getItem(SESSION_MSG_KEY);
            var type;
            var closeable;
            var target;

            // if we have a message stored in session storage
            if (msg) {

                // Get all the other message attributes out
                type = store.getItem(SESSION_MSG_TYPE_KEY);

                closeable = store.getItem(SESSION_MSG_CLOSEABLE_KEY) === "true" || store.getItem(SESSION_MSG_CLOSEABLE_KEY) === true;

                target = store.getItem(SESSION_MSG_TARGET_KEY);

                // And delete every thing from session storage so we don't keep showing the message for every page pop
                store.removeItem(SESSION_MSG_KEY);
                store.removeItem(SESSION_MSG_TYPE_KEY);
                store.removeItem(SESSION_MSG_CLOSEABLE_KEY);
                store.removeItem(SESSION_MSG_TARGET_KEY);

                var messageTypes = {
                    WARNING: { soyTemplate: Templates.warningMsg, auiType: 'warning' },
                    ERROR: { soyTemplate: Templates.errorMsg, auiType: 'error' },
                    SUCCESS: { soyTemplate: Templates.successMsg, auiType: 'success' },
                    INFO: { soyTemplate: Templates.infoMsg, auiType: 'info' }
                };

                if (!target || jQuery(target).is(document.body)) {
                    // Show a global message.
                    showMsg(msg, {
                        type: messageTypes[type].auiType,
                        closeable: closeable
                    });
                } else {
                    showMessageAtTarget(msg, {
                        type: messageTypes[type].soyTemplate,
                        closeable: closeable,
                        target: jQuery(target)
                    });
                }
            }
        });

        return function (msg, options) {

            // Store message data so we can access it on reload
            try {
                store.setItem(SESSION_MSG_KEY, msg);
                store.setItem(SESSION_MSG_TYPE_KEY, options.type);
            } catch (e) {}
            if (options.closeable) {
                try {
                    store.setItem(SESSION_MSG_CLOSEABLE_KEY, options.closeable);
                } catch (e) {}
            }
            if (options.target) {
                try {
                    store.setItem(SESSION_MSG_TARGET_KEY, options.target);
                } catch (e) {}
            }
        };
    }();

    /**
     * Shows a global warning message after the page has been reloaded or redirected
     *
     * @param {string} msg - HTML of message
     * @param {Object} [options={}] - config
     * @param {Boolean} options.closeable - Whether the message is dismissable by a close button
     * @param {Number} options.timeout - Number of seconds before the message automatically fades out. To
     * have no timeout, use -1.
     *
     * @return jQuery
     */
    function showReloadWarningMsg(msg, options) {
        options = options || {};
        options.type = "WARNING";
        return showMsgOnReload(msg, options);
    }

    /**
     * Shows a global success message after the page has been reloaded or redirected
     *
     * @param {string} msg - HTML of message
     * @param {Object} [options={}] - config
     * @param {Boolean} options.closeable - Whether the message is dismissable by a close button
     * @param {Number} options.timeout - Number of seconds before the message automatically fades out. To
     * have no timeout, use -1.
     *
     * @return jQuery
     */
    function showReloadSuccessMsg(msg, options) {
        options = options || {};
        options.type = "SUCCESS";
        return showMsgOnReload(msg, options);
    }

    /**
     * Shows a global error message after the page has been reloaded or redirected
     *
     * @param {string} msg - HTML of message
     * @param {Object} [options={}] - config
     * @param {Boolean} options.closeable - Whether the message is dismissable by a close button
     * @param {Number} options.timeout - Number of seconds before the message automatically fades out. To
     * have no timeout, use -1.
     *
     * @return jQuery
     */
    function showReloadErrorMsg(msg, options) {
        options = options || {};
        options.type = "ERROR";
        return showMsgOnReload(msg, options);
    }

    /**
     * Shows a global INFO message after the page has been reloaded or redirected
     *
     * @param {string} msg - HTML of message
     * @param {Object} [options={}] - config
     * @param {Boolean} options.closeable - Whether the message is dismissable by a close button
     * @param {Number} options.timeout - Number of seconds before the message automatically fades out. To
     * have no timeout, use -1.
     *
     * @return jQuery
     */
    function showReloadInfoMsg(msg, options) {
        options = options || {};
        options.type = "INFO";
        return showMsgOnReload(msg, options);
    }

    /**
     * Shows a global message (as an AUI flag)
     *
     * @param {string} msg HTML of message
     * @param {Object} [options={}] config
     * @param {string} options.type AUI message type ('error', 'warning', 'success')
     * @param {Boolean} options.closeable Whether the message is dismissable by a close button
     * @param {Number} options.timeout ShowMsg now delegates to AUI flags, which
     * does not allow for a specific timeout duration. A value of <tt>options.timeout</tt> > 0 will result in a timeout
     * dictated by AUI (5 seconds at the time of writing). A value <= 0 will result in a closeable flag with no timeout.
     *
     * @return jQuery
     */
    function showMsg(msg, options) {
        var settings = {};
        options = options || {};
        settings.type = options.type;

        if (typeof options.timeout === 'undefined') {
            if (options.closeable === false) {
                settings.close = 'auto';
            }
        } else if (options.timeout > 0) {
            settings.close = 'auto';
        } else {
            if (options.closeable === false) {
                settings.close = 'never';
            } else {
                settings.close = 'manual';
            }
        }

        var createdFlag = jQuery(flag.showMsg('', msg, settings));

        if (options.id) {
            createdFlag.attr('id', options.id);
        }

        return createdFlag;
    }

    /**
     * Shows a global error message (as an AUI flag)
     *
     * @param {string} msg - HTML of message
     * @param {Object} [options={}] - config
     * @param {Boolean} options.closeable - Whether the message is dismissable by a close button
     * @param {Number} options.timeout ShowMsg now delegates to AUI flags, which
     * does not allow for a specific timeout duration. A value of <tt>options.timeout</tt> > 0 will result in a timeout
     * dictated by AUI (5 seconds at the time of writing). A value <= 0 will result in a closeable flag with no timeout.
     *
     * @return jQuery
     */
    function showErrorMsg(msg, options) {
        return showMsg(msg, jQuery.extend({}, options, { type: 'error' }));
    }

    /**
     * Shows a global warning message (as an AUI flag)
     *
     * @param {string} msg - HTML of message
     * @param {Object} [options={}] - config
     * @param {Boolean} options.closeable - Whether the message is dismissable by a close button
     * @param {Number} options.timeout ShowMsg now delegates to AUI flags, which
     * does not allow for a specific timeout duration. A value of <tt>options.timeout</tt> > 0 will result in a timeout
     * dictated by AUI (5 seconds at the time of writing). A value <= 0 will result in a closeable flag with no timeout.
     *
     * @return jQuery
     */
    function showWarningMsg(msg, options) {
        return showMsg(msg, jQuery.extend({}, options, { type: 'warning' }));
    }

    /**
     * Shows a global success message (as an AUI flag)
     *
     * @param {string} msg - HTML of message
     * @param {Object} [options={}] - config
     * @param {Boolean} options.closeable - Whether the message is dismissable by a close button
     * @param {Number} options.timeout ShowMsg now delegates to AUI flags, which
     * does not allow for a specific timeout duration. A value of <tt>options.timeout</tt> > 0 will result in a timeout
     * dictated by AUI (5 seconds at the time of writing). A value <= 0 will result in a closeable flag with no timeout.
     *
     * @return jQuery
     */
    function showSuccessMsg(msg, options) {
        return showMsg(msg, jQuery.extend({}, options, { type: 'success' }));
    }

    /**
     * Shows a global info message (as an AUI flag)
     *
     * @param {string} msg - HTML of message
     * @param {Object} [options={}] - config
     * @param {Boolean} options.closeable - Whether the message is dismissable by a close button
     * @param {Number} options.timeout ShowMsg now delegates to AUI flags, which
     * does not allow for a specific timeout duration. A value of <tt>options.timeout</tt> > 0 will result in a timeout
     * dictated by AUI (5 seconds at the time of writing). A value <= 0 will result in a closeable flag with no timeout.
     *
     * @return jQuery
     */
    function showInfoMsg(msg, options) {
        return showMsg(msg, jQuery.extend({}, options, { type: 'info' }));
    }

    /**
     * Fades background color in on target element
     *
     * @param target
     * @param {Object} [options={}] - config
     * @param {Boolean} options.closeable - Whether the message is dismissable by a close button
     * @param {Number} options.timeout ShowMsg now delegates to AUI flags, which
     * does not allow for a specific timeout duration. A value of <tt>options.timeout</tt> > 0 will result in a timeout
     * dictated by AUI (5 seconds at the time of writing). A value <= 0 will result in a closeable flag with no timeout.
     */
    function fadeInBackground(target, options) {

        var $target = jQuery(target);

        options = options || {};

        $target.css("backgroundColor", "#fff").animate({
            backgroundColor: options.backgroundColor || "#ffd"
        });

        window.setTimeout(function () {
            $target.animate({
                backgroundColor: "#fff"
            }, "slow", function () {
                $target.css("backgroundColor", "");
            });
        }, 3000);
    }

    /**
     * Fades background color in on target element when page reloads
     */
    var fadeInBackgroundOnReload = function () {
        var BACKGROUND_COLOR_KEY = "jira.messages.fadeInBackground.color";
        var TARGET_KEY = "jira.messages.fadeInBackground.target";

        jQuery(function () {
            // eslint-disable-line @atlassian/onready-checks/no-jquery-onready
            var backgroundColor = store.getItem(BACKGROUND_COLOR_KEY);
            var target = store.getItem(TARGET_KEY);

            store.removeItem(BACKGROUND_COLOR_KEY);
            store.removeItem(TARGET_KEY);

            fadeInBackground(target, {
                backgroundColor: backgroundColor
            });
        });

        return function (target, options) {

            options = options || {};

            var targets = store.getItem(TARGET_KEY);

            if (targets) {
                targets = targets.split(",");
                targets.push(target);
                targets = targets.join(",");
            } else {
                targets = target;
            }
            try {
                store.setItem(TARGET_KEY, targets);
                store.setItem(BACKGROUND_COLOR_KEY, options.backgroundColor || "#ffd");
            } catch (e) {}
        };
    }();

    var exports = {
        Types: Templates,
        DefaultTimeout: 10,
        buildMsg: buildMsg,
        showMsg: showMsg,
        showMessageAtTarget: showMessageAtTarget,
        showMsgOnReload: showMsgOnReload,

        fadeInBackground: fadeInBackground,
        fadeInBackgroundOnReload: fadeInBackgroundOnReload,

        showErrorMsg: showErrorMsg,
        showWarningMsg: showWarningMsg,
        showSuccessMsg: showSuccessMsg,
        showInfoMsg: showInfoMsg,

        showReloadErrorMsg: showReloadErrorMsg,
        showReloadWarningMsg: showReloadWarningMsg,
        showReloadSuccessMsg: showReloadSuccessMsg,
        showReloadInfoMsg: showReloadInfoMsg
    };

    var deprecationOptions = {
        removeInVersion: '8.0',
        alternativeName: 'jira/flag',
        sinceVersion: '6.4'
    };

    AJS.deprecate.prop(exports, 'showMsg', deprecationOptions);
    AJS.deprecate.prop(exports, 'showErrorMsg', deprecationOptions);
    AJS.deprecate.prop(exports, 'showWarningMsg', deprecationOptions);
    AJS.deprecate.prop(exports, 'showSuccessMsg', deprecationOptions);

    return exports;
});

AJS.namespace('JIRA.Messages', null, require('jira/message'));

/**
 * jQuery conveniences for using JIRA messages.
 */
(function () {
    'use strict';

    var Templates = require('jira/message/templates');
    var messages = require('jira/message');
    var jQuery = require('jquery');

    jQuery.fn.fadeInBackground = function (options) {
        messages.fadeInBackground(this, options);
        return this;
    };

    /**
     * Prepends an error message to element
     *
     * jQuery("#mytarget").showErrorMsg("Error <strong>message</strong>", {closeable: true});
     *
     * @param {string} msg - HTML of message
     * @param {Object} [options={}] - config
     * @param {Boolean} options.closeable - Whether the message is dismissable by a close button
     * @param {Number} options.timeout - Number of seconds before the message automatically fades out. To
     * have no timeout, use -1.
     *
     * @return jQuery
     */
    jQuery.fn.showErrorMsg = function (msg, options) {
        options = options || {};
        options.target = this;
        options.type = Templates.errorMsg;
        return messages.showMessageAtTarget(msg, options);
    };

    /**
     * Prepends an warning message to element
     *
     * jQuery("#mytarget").showWarningMsg("Warning <strong>message</strong>");
     *
     * @param {string} msg - HTML of message
     * @param {Object} [options={}] - config
     * @param {Boolean} options.closeable - Whether the message is dismissable by a close button
     * @param {Number} options.timeout - Number of seconds before the message automatically fades out. To
     * have no timeout, use -1.
     *
     * @return jQuery
     */
    jQuery.fn.showWarningMsg = function (msg, options) {
        options = options || {};
        options.target = this;
        options.type = Templates.warningMsg;
        return messages.showMessageAtTarget(msg, options);
    };

    /**
     * Prepends an success message to element
     *
     * jQuery("#mytarget").showSuccessMsg("Success <strong>message</strong>", {closeable: true});
     *
     * @param {string} msg - HTML of message
     * @param {Object} [options={}] - config
     * @param {Boolean} options.closeable - Whether the message is dismissable by a close button
     * @param {Number} options.timeout - Number of seconds before the message automatically fades out. To
     * have no timeout, use -1.
     *
     * @return jQuery
     */
    jQuery.fn.showSuccessMsg = function (msg, options) {
        options = options || {};
        options.target = this;
        options.type = Templates.successMsg;
        return messages.showMessageAtTarget(msg, options);
    };

    /**
     * Prepends an success message to element
     *
     * jQuery("#mytarget").showSuccessMsg("Success <strong>message</strong>", {closeable: true});
     *
     * @param {string} msg - HTML of message
     * @param {Object} [options={}] - config
     * @param {Boolean} options.closeable - Whether the message is dismissable by a close button
     * @param {Number} options.timeout - Number of seconds before the message automatically fades out. To
     * have no timeout, use -1.
     *
     * @return jQuery
     */
    jQuery.fn.showInfoMsg = function (msg, options) {
        options = options || {};
        options.target = this;
        options.type = Templates.infoMsg;
        return messages.showMessageAtTarget(msg, options);
    };
})();