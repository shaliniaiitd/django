(function () {
    'use strict';

    var Header = require('jira/common/header');
    var jQuery = require('jquery');

    // On dom ready
    jQuery(function () {
        // eslint-disable-line @atlassian/onready-checks/no-jquery-onready
        Header.initialize();
    });
})();