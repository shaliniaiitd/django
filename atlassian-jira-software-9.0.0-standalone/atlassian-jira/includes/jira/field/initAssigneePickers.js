define('jira/field/init-assignee-pickers', ['jira/field/assignee-picker', 'jira/util/users/logged-in-user', 'jira/util/events', 'jira/util/events/types', 'jira/util/events/reasons', 'jquery', 'jira/skate'], function (AssigneePicker, LoggedInUser, Events, Types, Reasons, $, skate) {
    'use strict';

    /**
     * On IE7 it takes a href like '#assignee' and returns http:/x.x.x./x/x#assignee.  Why. why
     */

    function getHashedLinkTarget(url) {
        var hashIndex = url.indexOf('#');
        return hashIndex !== -1 ? url.substring(hashIndex) : url;
    }

    /**
    * This will add a click vent to the the assigned to me link of the assignee field so that it selects
    * the current user in the assignee select box
    *
    * @param {jQuery | HTMLElement} context - the context used for selection
    */
    function wireAssignToMeLink(context) {
        $('#assign-to-me-trigger', context).click(function (e) {
            e.preventDefault();
            var fieldId = $(this).data('field-id');
            var assigneeId = getHashedLinkTarget(fieldId);
            var username = LoggedInUser.username();

            var assigneeSelect = $(assigneeId, context);

            if ($(assigneeId + '-single-select', context).length) {
                assigneeSelect.trigger('set-selection-value', username);
            } else {
                // Set the old-school <select> option manually
                assigneeSelect.val(username).change(); // cause a change event as well as set it
            }
        });
    }

    function wireAssigneeEditGroup(context) {
        $(".assignee-edit-group", context).each(function () {
            var $this = $(this);
            var assigneeFieldId = $this.attr("rel");

            $("#assignee_userpicker_dummy_" + assigneeFieldId + "_container", context).click(function () {
                $("#assignee_radio_picker_" + assigneeFieldId, context).attr("checked", "checked");
            });

            $this.parents("form[name=jiraform]").submit(function () {
                $this.find("input[name=assignee_radio]:checked").each(function () {
                    if (this.id === "assignee_radio_picker_" + assigneeFieldId) {
                        $("#" + assigneeFieldId, context).val($("#assignee_userpicker_dummy_" + assigneeFieldId, context).val());
                    } else {
                        $("#" + assigneeFieldId, context).val($(this).val());
                    }
                });
            });
        });
    }

    skate("js-assignee-picker", {
        type: skate.type.CLASSNAME,
        created: function created(el) {
            var $el = $(el);
            var editValue = $el.data('editValue');
            var control = new AssigneePicker({
                element: $el,
                editValue: editValue
            });
            $(document).trigger('ready.single-select.assignee', control);
        }
    });

    Events.bind(Types.NEW_CONTENT_ADDED, function (e, context, reason) {
        //eslint-disable-line @atlassian/jira-event-checks/no-newcontentadded-handlers
        if (reason !== Reasons.panelRefreshed) {
            wireAssignToMeLink(context);
            wireAssigneeEditGroup(context);
        }
    });
});