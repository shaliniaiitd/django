define('jira/admin/group-browser/group-label-lozenge', ['jquery', 'jira/skate'], function ($, skate) {
    'use strict';

    skate('group-label-lozenge', {
        type: skate.type.CLASSNAME,
        attached: function attached(element) {
            $(element).tooltip({ gravity: 'w', html: true });
        }
    });
});