define("jira/project/types/warning/dialog", ["require"], function (require) {
    "use strict";

    var jQuery = require("jquery");
    var wrmData = require("wrm/data");
    var inlineDialog = require("aui/inline-dialog");

    function attachDialog(dialogData, onProjectTypeChanged, $sectionElement) {
        var trigger = jQuery(".project-type-warning-icon", $sectionElement);
        inlineDialog(trigger, "uninstalled-warning-dialog", function (content, trigger, showPopup) {
            content.html(JIRA.Project.Types.Warning.dialog({
                title: dialogData.title,
                firstParagraph: dialogData.firstParagraph,
                secondParagraph: dialogData.secondParagraph,
                callToActionText: dialogData.callToActionText
            }));

            var changeProjectTypeDialog = require('jira/project/admin/change-project-type-dialog');
            changeProjectTypeDialog({
                trigger: jQuery(".warning-dialog-change-project-type"),
                projectId: dialogData.projectId,
                onProjectTypeChanged: onProjectTypeChanged
            });

            showPopup();
            return false;
        }, {
            width: 375,
            gravity: "w"
        });
    }

    var dialogData = wrmData.claim("project.type.warning.dialogs.data");

    return {
        init: function init(options) {
            options = options || {};
            options.sectionElement = options.sectionElement || jQuery("body");
            attachDialog(dialogData || options.data, options.onProjectTypeChanged, options.sectionElement);
        }
    };
});