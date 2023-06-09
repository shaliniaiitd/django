AJS.test.require(["jira.webresources:jira-fields", "jira.webresources:user-picker-filter-configuration-resources", "jira.webresources:jira-global"], function () {
    'use strict';

    var userPickerFilterConfig = require('jira/admin/custom-fields/user-picker-filter/config');

    module("JIRA.Admin.CustomFields.UserPickerFilter.Config", {
        setup: function setup() {
            this.sandbox = sinon.sandbox.create();
        },
        teardown: function teardown() {
            this.sandbox.restore();
        }
    });

    test("Is correctly declared in AMD", function () {
        ok(userPickerFilterConfig, "Is AMDifyed");
    });
});