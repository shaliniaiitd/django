define('jira/dialog/error-dialog', ['jira/util/formatter', 'jira/dialog/dialog', 'jira/ajs/ajax/ajax-util', 'jira/lib/class', 'jira/util/browser', 'jquery'], function (formatter, Dialog, AjaxUtil, Class, Browser, $) {
    'use strict';

    /**
     * Displays a dialog with an error message.
     *
     * @class ErrorDialog
     * @extends Class
     */

    var ErrorDialog = Class.extend(
    /** @lends ErrorDialog# */
    {
        /**
         * @constructs
         * @param {string} [options.message] The message to display in the dialog.
         * @param {string} [options.mode] The mode of error to display. One of "error", "warning" or "info". The default
         * @param {string} [options.heading] The heading to display in dialog
         * mode is "error".
         */
        init: function init(options) {

            var message = options.message || formatter.I18n.getText("common.forms.ajax.servererror");
            var heading = options.heading || formatter.I18n.getText("common.words.error");
            var mode;
            if (!options.mode || ["warning", "error", "info"].indexOf(options.mode) < 0) {
                mode = "error";
            } else {
                mode = options.mode;
            }

            this.dialog = new Dialog({
                id: "error-dialog",
                content: function content(ready) {
                    var $el = $(JIRA.Templates.ErrorDialog.serverErrorModalDialog({
                        message: message,
                        mode: mode
                    }));

                    $el.find(".error-dialog-refresh").click(function (e) {
                        e.preventDefault();
                        Browser.reloadViaWindowLocation();
                    });

                    ready($el);
                }
            });

            this.dialog.addHeading(heading);
            this.dialog.handleCancel = $.noop;
        },
        /**
         * Hide the dialog.
         *
         * @returns {ErrorDialog} this object for chaining.
         */
        hide: function hide() {
            this.dialog.hide();
            return this;
        },

        /**
         * Show the dialog.
         *
         * @returns {ErrorDialog} this object for chaining.
         */
        show: function show() {
            this.dialog.show();
            return this;
        }
    });

    /**
     * Displays a dialog with an error message describing the error state of the passed XHR.
     *
     * The dialog will have been displayed to the user.
     *
     * @param {XMLHttpRequest} xhr the XHR to query
     * @returns {JIRA.ErrorDialog} a visible dialog displaying the error.
     */
    ErrorDialog.openErrorDialogForXHR = function (xhr) {
        return new ErrorDialog({
            message: AjaxUtil.getErrorMessageFromXHR(xhr)
        }).show();
    };

    return ErrorDialog;
});

AJS.namespace('JIRA.ErrorDialog', null, require('jira/dialog/error-dialog'));