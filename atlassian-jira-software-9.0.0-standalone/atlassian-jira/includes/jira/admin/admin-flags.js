require(['jira/util/logger', 'wrm/data', 'jquery', 'jira/flag'], function (logger, wrmData, $, Flags) {
    "use strict";

    $(function () {
        // eslint-disable-line @atlassian/onready-checks/no-jquery-onready
        var data = wrmData.claim('jira.core:user-message-flags-data.adminLockout') || {};
        if (data.noprojects) {
            var templates = JIRA.Templates.Flags.Admin;
            var title = templates.adminIssueAccessFlagTitle({});
            var body = templates.adminIssueAccessFlagBody({
                manageAccessUrl: data.manageAccessUrl
            });
            var flag = Flags.showWarningMsg(title, body, {
                dismissalKey: data.flagId
            });

            $(flag).find("a").on("click", function () {
                flag.dismiss();
            });
        }
        logger.trace("admin.flags.done");
    });
});