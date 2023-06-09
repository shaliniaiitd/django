require(['jquery', 'jira/flag'], function ($, jiraFlag) {
    "use strict";

    $(function () {
        // eslint-disable-line @atlassian/onready-checks/no-jquery-onready
        if (/invalidPermissionSchemeRequested=\d+/.test(location.search)) {
            renderInvalidSchemeIdMessage();

            // fix the URL
            if (history.replaceState) {
                history.replaceState(null, null, location.pathname);
            }
        }

        function renderInvalidSchemeIdMessage() {
            jiraFlag.showWarningMsg('', JIRA.Templates.ViewPermissionSchemes.invalidPermissionSchemeNotification(), {
                close: 'manual'
            });
        }
    });
});