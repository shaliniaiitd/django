define('jira/dialog/dialog-util', ['jira/dialog/dialog-register', 'jira/jquery/deferred', 'jira/issuenavigator/issue-navigator', 'jquery'], function (Dialogs, jQueryDeferred, IssueNavigator, jQuery) {
    'use strict';

    /** @exports jira/dialog/dialog-util */

    var DialogUtil = {};

    DialogUtil.getDefaultAjaxOptions = function () {

        // JDEV-27341 - Not-so-elegant hack: If someone else is overriding this function in the old global namespace, use that.
        if (JIRA && typeof Dialogs.getDefaultAjaxOptions === "function") {
            if (DialogUtil.getDefaultAjaxOptions !== Dialogs.getDefaultAjaxOptions) {
                return Dialogs.getDefaultAjaxOptions.apply(this, arguments);
            }
        }
        // end not-so-elegant hack

        var $focusRow = IssueNavigator.get$focusedRow();
        var linkIssueURI = this.options.url || this.getRequestUrlFromTrigger();

        if (/id=\{0\}/.test(linkIssueURI)) {
            if (!$focusRow.length) {
                return false;
            } else {
                linkIssueURI = linkIssueURI.replace(/(id=\{0\})/, "id=" + $focusRow.attr("rel"));
            }
        }

        if (IssueNavigator.isNavigator()) {
            var result = /[?&]id=([0-9]+)/.exec(linkIssueURI);
            this.issueId = result && result.length === 2 ? result[1] : null;
            if (this.issueId !== $focusRow.attr("rel")) {
                //if the issue id doesn't match the focused row's issue id then reassign focus and get the
                //issuekey from the newly focused row! This can happen when clicking the pencil for the
                //labels picker.
                IssueNavigator.Shortcuts.focusRow(this.issueId);
                $focusRow = IssueNavigator.get$focusedRow();
            }
            this.issueKey = IssueNavigator.getSelectedIssueKey();
        }

        return {
            url: linkIssueURI
            /**
             * TODO JDEV-27341
             * These data values should always be sent when Dialogs do AJAX; they should be non-configurable.
             * But we can't remove them from here just yet, since things other than Dialog controls can use this function.
             * For example, the LinkIssueDialog manually fetches its own content and as such depends on these values being set here :(
             */
            , data: { decorator: "dialog", inline: "true" }
        };
    };

    /**
     * Used to defer the showing of issue dialogs until all promises are resolved. We use this in kickass to:
     * - Ensure the dialog we are opening is related to the correct issue. If we are j/k ing quickly and open a dialog, we want it to be about the issue we are loading.
     * - Ensuring the dialog we are opening has the correct data. If we are inline editing the summary then open the edit dialog, we want to be sure that the summary has been
     * updated on the server first, otherwise we will be showing stale data in the edit dialog.
     * @type Object
     * @property {Function} add
     * @property {Function} execute
     */
    DialogUtil.BeforeShowIssueDialogHandler = function () {
        var deferreds = [];
        return {
            add: function add(deferred) {
                deferreds.push(deferred);
                return this;
            },
            execute: function execute() {
                var invokedDeferreds = [];
                if (deferreds.length === 0) {
                    return jQueryDeferred().resolve();
                } else {
                    jQuery.each(deferreds, function (idx, deferred) {
                        invokedDeferreds.push(deferred());
                    });
                    return jQuery.when.apply(jQuery, invokedDeferreds);
                }
            }
        };
    }();

    /**
     * Stores the current issue id into session storage if the dialogs submits successfully
     */
    DialogUtil.storeCurrentIssueIdOnSucessfulSubmit = function () {
        if (IssueNavigator.isNavigator()) {
            IssueNavigator.setIssueUpdatedMsg({
                issueMsg: this.options.issueMsg,
                issueId: this.issueId,
                issueKey: this.issueKey
            });
        }
    };

    return DialogUtil;
});

(function (utils) {
    'use strict';

    /**
     * @deprecated JIRA.Dialogs is confusing and overloaded. Use the AMD modules instead.
     */

    AJS.namespace('JIRA.Dialogs', null, require('jira/dialog/dialog-register'));
    AJS.namespace('JIRA.Dialogs.getDefaultAjaxOptions', null, utils.getDefaultAjaxOptions);
    AJS.namespace('JIRA.Dialogs.BeforeShowIssueDialogHandler', null, utils.BeforeShowIssueDialogHandler);
    AJS.namespace('JIRA.Dialogs.storeCurrentIssueIdOnSucessfulSubmit', null, utils.storeCurrentIssueIdOnSucessfulSubmit);
})(require('jira/dialog/dialog-util'));