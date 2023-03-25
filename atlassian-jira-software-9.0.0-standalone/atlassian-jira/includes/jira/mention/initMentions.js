require(['wrm/require'], function (wrmRequire) {
    'use strict';

    wrmRequire(['wrc!jira.webresources:mentions-feature'], function () {
        require(['jira/mention/mention-element']);
    });
});