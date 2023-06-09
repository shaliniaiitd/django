(function (jptDialogController) {
    'use strict';

    var $ = require('jquery');
    var Loading = require('jira/loading/loading');
    var contextPath = require('wrm/context-path');

    Loading.showLoadingIndicator();
    $(function () {
        // eslint-disable-line @atlassian/onready-checks/no-jquery-onready
        AJS.bind('remove.dialog', function () {
            Loading.showLoadingIndicator();
            setTimeout(function () {
                window.location.href = contextPath() + '/secure/MyJiraHome.jspa';
            }, 0);
        });
        Loading.hideLoadingIndicator();

        var projectTypeKey = $('#projectTypeKey').data('project-type-key');
        jptDialogController.openWithFirstProjectTemplateOfTypePreSelected(projectTypeKey);
    });
})(JPT.DialogController); // eslint-disable-line no-undef