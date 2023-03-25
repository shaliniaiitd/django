var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

AJS.test.require('jira.webresources:jira-global', function () {
    'use strict';

    var jQuery = require('jquery');
    var AssigneePicker = require('jira/field/assignee-picker');
    var _ = require('underscore');

    module("JIRA.AssigneePicker", {
        setup: function setup() {
            var fixture = jQuery("#qunit-fixture");

            this.pickerSelect = jQuery('<select id="assignee" name="assignee" class="single-user-picker js-assignee-picker aui-ss-select" data-show-dropdown-button="true" data-user-type="assignee" data-container-class="long-field" multiple="multiple" style="display: none;">' + '<optgroup id="assignee-group-suggested" label="Suggestions" data-weight="0">' + '  <option value="admin" data-field-text="admin" data-field-label="admin - admin@localhost (admin)" data-icon="/jira/secure/useravatar?size=xsmall&amp;avatarId=10122">admin</option>' + '  <option value="" data-field-text="Unassigned" data-field-label="Unassigned" data-icon="/jira/secure/useravatar?size=xsmall&amp;avatarId=10123">Unassigned</option>' + '  <option value="-1" data-field-text="Automatic" data-field-label="Automatic" data-icon="/jira/secure/useravatar?size=xsmall&amp;avatarId=10123">Automatic</option>' + '</optgroup>' + '</select>').appendTo(fixture);

            this.xhr = sinon.useFakeXMLHttpRequest();
            var requests = this.requests = [];
            this.xhr.onCreate = function (req) {
                requests.push(req);
            };

            var userCounter = 0;
            this.testHelper = {
                responseBuilder: function responseBuilder(numberOfItems) {
                    var output = [];
                    for (var i = 0; i < numberOfItems; i++) {
                        output.push({
                            name: "user" + userCounter,
                            displayName: "User " + userCounter,
                            emailAddress: "user" + userCounter + "@local",
                            avatarUrls: {
                                '16x16': ''
                            }
                        });
                        userCounter++;
                    }

                    return JSON.stringify(output);
                },
                scroll: function scroll($element, scrollPercent) {
                    $element[0].scrollTop = scrollPercent * $element[0].scrollHeight / 100;
                    $element.trigger('scroll');
                },
                respondWith: function respondWith(numberOfItems) {
                    _.last(requests).respond(200, { "Content-Type": "application/json" }, this.responseBuilder(numberOfItems));
                },
                urlFromLastRequest: function urlFromLastRequest() {
                    var request = _.last(requests);
                    return (typeof request === 'undefined' ? 'undefined' : _typeof(request)) === 'object' ? request.url : '';
                },
                parseQueryString: function parseQueryString(queryString) {
                    return _.object(queryString.split('&').map(function (s) {
                        return s.split('=');
                    }));
                },
                paramsFromLastRequest: function paramsFromLastRequest() {
                    return this.parseQueryString(this.urlFromLastRequest().split('?')[1]);
                }
            };
        },

        tearDown: function tearDown() {
            this.xhr.restore();
            this.requests = [];
        }

    });

    test("Selecting invalid Automatic assignee", function () {
        var assigneePicker = new AssigneePicker({
            element: this.pickerSelect,
            editValue: "-1"
        });

        ok(!assigneePicker.$container.hasClass("aui-ss-editing"), 'input should not be in edit mode');
        equal(assigneePicker.$field.val(), "Automatic", '"Automatic" assignee should be displayed as string label');
    });

    test("It should fetch the assignee list when the picker is opened", function () {
        var MAX_RESULTS = 100; // since UCACHE-183 we simplify assignable search
        var assigneePicker = new AssigneePicker({
            element: this.pickerSelect
        });

        sinon.spy(assigneePicker.suggestionsHandler.descriptorFetcher, 'execute');

        assigneePicker._handleCharacterInput.call(assigneePicker, true); // force to show dropdown list
        ok(assigneePicker.suggestionsHandler.descriptorFetcher.execute.calledOnce, 'AJAX called when the picker is opened');
        equal(this.testHelper.paramsFromLastRequest().maxResults, MAX_RESULTS, 'Fetches first items');
        this.testHelper.respondWith(50);

        equal(assigneePicker.listController.getAllItems().length, 53, "Display 53  (3 suggestions + 50 new items)");
    });

    test("It should debounce calls to the server", function () {
        var assigneePicker = new AssigneePicker({
            element: this.pickerSelect
        });

        var clock = sinon.useFakeTimers();

        assigneePicker.$field.val("a");
        assigneePicker._handleCharacterInput();
        assigneePicker.$field.val("ab");
        assigneePicker._handleCharacterInput();
        assigneePicker.$field.val("abc");
        assigneePicker._handleCharacterInput();
        equal(this.requests.length, 0, "Requests are not made immediately");
        clock.tick(300);
        this.testHelper.respondWith(50);
        equal(this.requests.length, 1, "Server is called once");

        clock.restore();
    });

    test("It should NOT send request to server when user keeps clicking on the field", function () {
        var assigneePicker = new AssigneePicker({
            element: this.pickerSelect
        });

        var $assigneeField = assigneePicker.$container.find("#assignee-field");

        sinon.spy(assigneePicker.suggestionsHandler.descriptorFetcher, 'execute');
        stop();
        _.delay(function () {
            // delay is necessary here because the field events is bind in setTimeout
            $assigneeField.click();
            this.testHelper.respondWith(50);
            ok(assigneePicker.suggestionsHandler.descriptorFetcher.execute.calledOnce, 'Click on assignee field for the 1st time, request was sent to retrieve data');

            $assigneeField.click();
            ok(assigneePicker.suggestionsHandler.descriptorFetcher.execute.calledOnce, 'Click on assignee field for the 2nd time, NO request was sent');

            $assigneeField.click();
            ok(assigneePicker.suggestionsHandler.descriptorFetcher.execute.calledOnce, 'Click on assignee field for the 3rd time, NO request was sent');

            start();
        }.bind(this), 100);
    });

    // UCACHE-178
    test("It should NOT deduplicate results", function () {
        var assigneePicker = new AssigneePicker({
            element: this.pickerSelect
        });

        notOk(assigneePicker.options.removeDuplicates, "Assignee picker does not deduplicate the results");
        ok(assigneePicker.options.disableRemoveSelected, "Assignee picker does not remove selected options from results");
    });
});