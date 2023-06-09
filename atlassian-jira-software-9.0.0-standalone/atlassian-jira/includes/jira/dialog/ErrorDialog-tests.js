AJS.test.require(["jira.webresources:dialogs"], function () {
    'use strict';

    require(['jira/dialog/error-dialog', 'jira/util/browser', 'jquery', 'underscore'], function (ErrorDialog, Browser, $, _) {
        var ErrorDialogDriver = function ErrorDialogDriver() {};

        _.extend(ErrorDialogDriver.prototype, {
            isVisible: function isVisible() {
                return this.el().is(":visible");
            },
            message: function message() {
                return $.trim(this.el().find(".aui-message").text());
            },
            refresh: function refresh() {
                var $refresh = this.el().find(".error-dialog-refresh");
                if (!$refresh.length) {
                    throw "Could not find refresh button.";
                } else {
                    $refresh.click();
                }
            },
            el: function el() {
                return $("#error-dialog");
            },
            mode: function mode() {
                var msg = this.el().find(".aui-message");
                if (msg.length) {
                    if (msg.hasClass("aui-message-warning")) {
                        return "warning";
                    } else if (msg.hasClass("aui-message-info")) {
                        return "info";
                    } else if (msg.hasClass("aui-message-error")) {
                        return "error";
                    }
                }
                return null;
            }
        });

        module("JIRA.ErrorDialog", {
            setup: function setup() {
                this.driver = new ErrorDialogDriver();
                this.sandbox = sinon.sandbox.create();
            },
            teardown: function teardown() {
                this.sandbox.restore();
            }
        });

        var testMode = function testMode(mode, message) {
            var options = {
                message: message
            };
            if (mode) {
                options.mode = mode;
            }
            var dialog = new ErrorDialog(options);

            dialog.show();
            equal(this.driver.message(), message, "Dialog displaying correct error message.");
            equal(this.driver.mode(), mode || "error", "Dialog displaying in correct mode.");
            dialog.hide();
        };

        test("Dialog displays correct error message when no mode passed.", function () {
            testMode.call(this, null, "Error");
        });

        test("Dialog displays correct message in info mode", function () {
            testMode.call(this, "info", "Info");
        });

        test("Dialog displays correct message in warning mode", function () {
            testMode.call(this, "warning", "Warning");
        });

        test("Dialog displays correct message in error mode", function () {
            testMode.call(this, "warning", "Error");
        });

        test("Dialog displays correct message for bad mode", function () {
            var message = "Message";
            var dialog = new ErrorDialog({
                message: message,
                mode: "badMode"
            });

            dialog.show();
            equal(this.driver.message(), message, "Dialog displaying correct error message.");
            equal(this.driver.mode(), "error", "Dialog displaying in correct mode.");
            dialog.hide();
        });

        test("Dialog hide/show.", function () {
            var message = "Error";
            var dialog = new ErrorDialog({
                message: message
            });

            ok(!this.driver.isVisible(), "Dialog should be hidden by default.");
            dialog.show();
            ok(this.driver.isVisible(), "Dialog should now be visible.");
            dialog.hide();
            ok(!this.driver.isVisible(), "Dialog should be hidden again.");
        });

        test("openErrorDialogForXHR displays error dialog.", function () {
            var dialog = ErrorDialog.openErrorDialogForXHR({
                status: 401,
                responseText: JSON.stringify({ errorMessages: ["abc"] })
            });

            dialog.show();
            equal(this.driver.message(), "abc", "Dialog displaying correct error message.");
            dialog.hide();
        });

        test("refresh does page reload.", function () {
            var reloader = this.sandbox.stub(Browser, "reloadViaWindowLocation");

            var dialog = ErrorDialog.openErrorDialogForXHR({
                status: 401,
                responseText: JSON.stringify({ errorMessages: ["abc"] })
            }).show();

            this.driver.refresh();
            ok(reloader.calledOnce, "Refresh does a page pop.");
            dialog.hide();
        });
    });
});