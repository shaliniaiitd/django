AJS.test.require(["jira.webresources:jira-global", "jira.webresources:dialogs", "com.atlassian.auiplugin:dialog2"], function () {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var JiraDialog = require('jira/dialog/dialog');
    var AjsDialog = AJS.Dialog;
    var ajsDialog2 = AJS.dialog2;
    var ajsDim = AJS.dim;

    var availableDialogs = [];
    var originalDocumentTitle;
    var modelessDialog;

    var show = function show() {
        for (var i = 0; i < arguments.length; i++) {
            arguments[i].show();
        }
    };

    var hide = function hide() {
        for (var i = 0; i < arguments.length; i++) {
            arguments[i].hide();
        }
    };

    var getDialogTitle = function getDialogTitle(dialog) {
        return dialog.options && dialog.options.windowTitle || dialog.get && dialog.get('header') && dialog.get('header')[0].text() || dialog.$el && dialog.$el.find('header').text() || "n/a";
    };

    var assertDialogMode = function assertDialogMode(dialog, expectation) {
        expectation = "modal" === expectation ? false : true;
        strictEqual(dialog.isModeless(), !!expectation, getDialogTitle(dialog) + " should " + (expectation ? "" : "not ") + "be modeless");
    };

    var assertModelessDialog = function assertModelessDialog(dialog) {
        assertDialogMode(dialog, "modeless");
    };
    var assertModalDialog = function assertModalDialog(dialog) {
        assertDialogMode(dialog, "modal");
    };

    var assertDialogVisibility = function assertDialogVisibility(dialog, expectation) {
        var isVisible;
        if (typeof dialog.isVisible === "function") {
            isVisible = dialog.isVisible();
        } else if (dialog instanceof AjsDialog) {
            isVisible = !!AJS.popup.current && AJS.popup.current.element === dialog.popup.element;
        }

        strictEqual(isVisible, !!expectation, getDialogTitle(dialog) + " should " + (expectation ? "" : "not ") + "be visible");
    };

    var assertDialogHidden = function assertDialogHidden(dialog) {
        assertDialogVisibility(dialog, false);
    };

    var assertDialogsHidden = function assertDialogsHidden(dialogsHidden) {
        dialogsHidden.forEach(function (dialog) {
            assertDialogHidden(dialog);
        });
    };

    var assertDialogVisible = function assertDialogVisible(dialog) {
        assertDialogVisibility(dialog, true);
    };

    var assertBlanketVisible = function assertBlanketVisible(expectation) {
        var isBlanketVisible = ajsDim && ajsDim.$dim && !ajsDim.$dim.attr('hidden');
        strictEqual(!!isBlanketVisible, !!expectation, "blanket should " + (expectation ? "" : "not ") + "be visible");
    };

    var assertDocumentTitle = function assertDocumentTitle(expectation) {
        strictEqual(document.title, expectation, "window title should be equal " + expectation);
    };

    var assertDialogShownWithBlanketVisibility = function assertDialogShownWithBlanketVisibility(shownDialog, hiddenDialogs, isBlanketShown) {
        if (hiddenDialogs === undefined) {
            hiddenDialogs = _.difference(availableDialogs, shownDialog);
        }
        assertDialogVisible(shownDialog);
        assertDialogsHidden(hiddenDialogs);
        if ("boolean" === isBlanketShown) {
            assertBlanketVisible(isBlanketShown);
        }
    };

    var assertDialogShownWithBlanket = function assertDialogShownWithBlanket(shownDialog, hiddenDialogs) {
        assertDialogShownWithBlanketVisibility(shownDialog, hiddenDialogs, true);
    };
    var assertDialogShownWithoutBlanket = function assertDialogShownWithoutBlanket(shownDialog, hiddenDialogs) {
        assertDialogShownWithBlanketVisibility(shownDialog, hiddenDialogs, false);
    };
    var assertDialogShown = function assertDialogShown(shownDialog, hiddenDialogs) {
        assertDialogShownWithBlanketVisibility(shownDialog, hiddenDialogs, undefined);
    };

    var removeDialogs = function removeDialogs() {
        availableDialogs.reverse().forEach(function (dialog) {
            dialog.hide();
        });
        availableDialogs = [];
        $("." + JiraDialog.ClassNames.DIALOG).remove();
        $(".aui-dialog2").remove();
        $(".aui-dialog").remove();
    };

    var createStackedDialog = function createStackedDialog(title, options) {
        var $content = $("<div>").css({ height: '200px' }).append($("<h2>").text(title));

        var defaultOptions = {
            content: function content(callback) {
                return callback($content);
            },
            stacked: true,
            height: '200px',
            windowTitle: title
        };

        var dialog = new JiraDialog($.extend(defaultOptions, options));
        dialog.isVisible = function () {
            return $content.is(":visible") && "hidden" !== $content.css("visibility");
        };
        dialog.isModeless = function () {
            return this.get$popup().hasClass(JiraDialog.ClassNames.MODELESS_DIALOG);
        };
        availableDialogs.push(dialog);
        return dialog;
    };

    var createStackedAuiDialog = function createStackedAuiDialog(title, id) {
        var options = {
            width: 800,
            height: 500,
            id: "dialog-name" + id,
            closeOnOutsideClick: true,
            stacked: true
        };

        var dialog = new AjsDialog(options);
        dialog.addHeader(title ? title : "some header");
        availableDialogs.push(dialog);
        return dialog;
    };

    var createStackedAuiDialog2 = function createStackedAuiDialog2(title, id) {
        var options = {
            width: 800,
            height: 500,
            id: "dialog2-name" + id,
            closeOnOutsideClick: true
        };

        var dialogTpl = '<section role="dialog" id="' + options.id + '" class="aui-layer aui-dialog2 aui-dialog2-medium" hidden> \
            <!-- Dialog header --> \
            <header class="aui-dialog2-header">' + title + '</header> \
            <p>Hello World</p> \
        </section>';

        $(document.body).append(dialogTpl);

        var dialog = ajsDialog2("#" + options.id);
        availableDialogs.push(dialog);
        return dialog;
    };

    var parametrizedTest = function parametrizedTest(name, behaviour, testParameters) {
        testParameters.forEach(function (testParameter) {
            test(AJS.format.apply(this, [name].concat(testParameter.context)), function () {
                behaviour.apply(this, testParameter.parameters);
            });
        });
    };

    module("Modeless Dialog Tests", {
        setup: function setup() {
            originalDocumentTitle = document.title;
            modelessDialog = createStackedDialog("modeless dialog", {
                modeless: true
            });
        },
        teardown: function teardown() {
            document.title = originalDocumentTitle;
            removeDialogs();
        }
    });

    test("Should show", function () {
        modelessDialog.show();
        assertDialogVisible(modelessDialog);
        assertModelessDialog(modelessDialog);
        assertDocumentTitle(getDialogTitle(modelessDialog));
    });

    test("Should hide", function () {
        modelessDialog.show();
        modelessDialog.hide();
        assertDialogHidden(modelessDialog);
        assertDocumentTitle(originalDocumentTitle);
    });

    test("Should not change window title when windowTitle is \"false\"", function () {
        var modelessDialogWithoutTitle = createStackedDialog("modeless dialog", {
            modeless: true,
            windowTitle: false
        });
        modelessDialogWithoutTitle.show();
        assertDocumentTitle(originalDocumentTitle);
    });

    test("JIRA Dialog should be modal by default", function () {
        // given
        var modalDialog = createStackedDialog("jira dialog");
        // when
        modalDialog.show();
        // then
        assertModalDialog(modalDialog);
    });

    test("JIRA Dialog should be modal when specified \"modeless: false\"", function () {
        // given
        var modalDialog = createStackedDialog("jira dialog", {
            modeless: false
        });
        // when
        modalDialog.show();
        // then
        assertModalDialog(modalDialog);
    });

    (function shouldCommunicateWithAnotherDialog() {
        var testParameters = [{
            parameters: [function () {
                return createStackedDialog("jira stacked dialog");
            }], context: ["jira dialog"]
        }, {
            parameters: [function () {
                return createStackedAuiDialog("aui stacked dialog", 1);
            }], context: ["aui dialog"]
        }, {
            parameters: [function () {
                return createStackedAuiDialog2("aui stacked dialog2", 1);
            }], context: ["aui dialog2"]
        }];

        parametrizedTest("Should hide when stacked \"{0}\" is shown", function (dialogBuilder) {
            // given
            var anotherDialog = dialogBuilder();
            show(modelessDialog);
            // when
            show(anotherDialog);
            // then
            assertDialogShownWithBlanket(anotherDialog);
        }, testParameters);

        parametrizedTest("Should show when stacked \"{0}\" is hidden", function (dialogBuilder) {
            // given
            var anotherDialog = dialogBuilder();
            show(modelessDialog, anotherDialog);
            // when
            hide(anotherDialog);
            // then
            assertDialogShownWithoutBlanket(modelessDialog);
        }, testParameters);
    })();

    (function shouldCommunicateWithMultipleJIRADialogs() {
        var testParameters = [{
            parameters: [function () {
                return createStackedDialog("jira stacked dialog 1");
            }, function () {
                return createStackedDialog("jira stacked dialog 2");
            }],
            context: ["jira dialog", "jira dialog"]
        }];

        var buildDialogs = function buildDialogs(bottomDialogBuilder, topDialogBuilder) {
            return {
                bottom: bottomDialogBuilder(),
                top: topDialogBuilder()
            };
        };

        parametrizedTest("Should stay hidden when stacked \"{0}\" is shown on top of stacked \"{1}\"", function (bottomDialogBuilder, topDialogBuilder) {
            // given
            var otherDialogs = buildDialogs(bottomDialogBuilder, topDialogBuilder);
            show(modelessDialog, otherDialogs.bottom);
            // when
            show(otherDialogs.top);
            // then
            assertDialogShownWithBlanket(otherDialogs.top);
        }, testParameters);

        parametrizedTest("Should stay hidden when top stacked \"{1}\" is hidden on top of stacked \"{0}\"", function (bottomDialogBuilder, topDialogBuilder) {
            // given
            var otherDialogs = buildDialogs(bottomDialogBuilder, topDialogBuilder);
            show(modelessDialog, otherDialogs.bottom, otherDialogs.top);
            // when
            hide(otherDialogs.top);
            // then
            assertDialogShownWithBlanket(otherDialogs.bottom);
        }, testParameters);

        parametrizedTest("Should show when the bottom stacked \"{0}\" get hidden together with the top stacked \"{1}\"", function (bottomDialogBuilder, topDialogBuilder) {
            // given
            var otherDialogs = buildDialogs(bottomDialogBuilder, topDialogBuilder);
            show(modelessDialog, otherDialogs.bottom, otherDialogs.top);
            hide(otherDialogs.top);
            // when
            hide(otherDialogs.bottom);
            // then
            assertDialogShownWithoutBlanket(modelessDialog);
        }, testParameters);
    })();

    (function shouldCommunicateWithMultipleAUIDialogs() {
        var testParameters = [
        // regarding ["aui dialog", "aui dialog"] case: two stacked aui dialogs are not supported by AUI
        {
            parameters: [function () {
                return createStackedAuiDialog2("aui stacked dialog2 1", 1);
            }, function () {
                return createStackedAuiDialog2("aui stacked dialog2 2", 2);
            }],
            context: ["aui dialog2", "aui dialog2"]
        }, {
            parameters: [function () {
                return createStackedAuiDialog("aui stacked dialog 1", 1);
            }, function () {
                return createStackedAuiDialog2("aui stacked dialog2 2", 2);
            }],
            context: ["aui dialog", "aui dialog2"]
        }, {
            parameters: [function () {
                return createStackedAuiDialog2("aui stacked dialog2 1", 1);
            }, function () {
                return createStackedAuiDialog("aui stacked dialog 2", 2);
            }],
            context: ["aui dialog2", "aui dialog"]
        }];

        var buildDialogs = function buildDialogs(bottomDialogBuilder, topDialogBuilder) {
            return {
                bottom: bottomDialogBuilder(),
                top: topDialogBuilder()
            };
        };

        parametrizedTest("Should stay hidden when stacked \"{0}\" is shown on top of stacked \"{1}\"", function (bottomDialogBuilder, topDialogBuilder) {
            // given
            var otherDialogs = buildDialogs(bottomDialogBuilder, topDialogBuilder);
            show(modelessDialog, otherDialogs.bottom);
            // when
            show(otherDialogs.top);
            // then
            assertDialogShownWithBlanket(otherDialogs.top, [modelessDialog]);
        }, testParameters);

        parametrizedTest("Should stay hidden when top stacked \"{1}\" is hidden on top of stacked \"{0}\"", function (bottomDialogBuilder, topDialogBuilder) {
            // given
            var otherDialogs = buildDialogs(bottomDialogBuilder, topDialogBuilder);
            show(modelessDialog, otherDialogs.bottom, otherDialogs.top);
            // when
            hide(otherDialogs.top);
            // then
            assertDialogShown(otherDialogs.bottom);
        }, testParameters);

        parametrizedTest("Should show when the bottom stacked \"{0}\" get hidden together with the top stacked \"{1}\"", function (bottomDialogBuilder, topDialogBuilder) {
            // given
            var otherDialogs = buildDialogs(bottomDialogBuilder, topDialogBuilder);
            show(modelessDialog, otherDialogs.bottom, otherDialogs.top);
            hide(otherDialogs.top);
            // when
            hide(otherDialogs.bottom);
            // then
            assertDialogShownWithoutBlanket(modelessDialog);
        }, testParameters);
    })();
    /* END OF TESTS */
});