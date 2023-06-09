AJS.test.require(["jira.webresources:jira-fields", "jira.webresources:jira-global"], function () {
    'use strict';

    var MultiUserListPickerItem = require('jira/field/multi-user-list-picker/item');

    module("JIRA.MultiUserListPicker.Item", {
        setup: function setup() {
            this.sandbox = sinon.sandbox.create();
        },
        teardown: function teardown() {
            this.sandbox.restore();
        }
    });

    test("Is correctly declared in AMD", function () {
        ok(MultiUserListPickerItem, "Is AMDifyed");
    });
});