AJS.test.require(["jira.webresources:jira-fields", "jira.webresources:jira-global"], function () {
    'use strict';

    var VersionPicker = require('jira/field/version-picker');

    module("JIRA.VersionPicker", {
        setup: function setup() {
            this.sandbox = sinon.sandbox.create();
        },
        teardown: function teardown() {
            this.sandbox.restore();
        }
    });

    test("Is correctly declared in AMD", function () {
        ok(VersionPicker, "Is AMDifyed");
    });
});