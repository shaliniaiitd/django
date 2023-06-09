/**
 * Makes a heuristic decision on the best form to select on the page for field focus.  We know that certain forms are NEVER
 * to gain focus such as quick search and the timing info.
 */
(function (jQuery, setFocus) {
    'use strict';

    jQuery(function () {
        // eslint-disable-line @atlassian/onready-checks/no-jquery-onready
        setFocus.triggerFocus();
    });
})(require('jquery'), require('jira/focus/set-focus'));