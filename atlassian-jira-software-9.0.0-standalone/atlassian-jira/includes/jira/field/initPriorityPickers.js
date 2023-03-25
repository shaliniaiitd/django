define('jira/field/init-priority-pickers', ['jira/ajs/select/single-select', 'jira/util/events/reasons', 'jira/util/events/types', 'jira/util/events', 'jquery'], function (SingleSelect, Reasons, Types, Events, $) {
    'use strict';

    function createPriorityPicker(context) {
        context.find("select#priority").each(function (i, el) {
            var options = {
                element: el,
                revertOnInvalid: true
            };
            var ariaLabel = $.attr(el, 'aria-label');
            if (ariaLabel) {
                options.ariaLabel = ariaLabel;
            }
            new SingleSelect(options);
        });
    }

    Events.bind(Types.NEW_CONTENT_ADDED, function (e, context, reason) {
        //eslint-disable-line @atlassian/jira-event-checks/no-newcontentadded-handlers
        if (reason !== Reasons.panelRefreshed) {
            createPriorityPicker(context);
        }
    });
});