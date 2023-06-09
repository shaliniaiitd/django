AJS.test.require(["jira.webresources:jira-events", "jira.webresources:ajs-underscorejs-amd-shim", "jira.webresources:jira-admin-analytics"], function () {
    'use strict';

    var $ = require("jquery");
    var _ = require("underscore");
    var Events = require("jira/util/events");

    module("admin/analytics", {
        setup: function setup() {
            this.sendSpy = sinon.spy();
            this.context = AJS.test.mockableModuleContext();
            this.context.mock("jira/analytics", {
                send: this.sendSpy
            });
            this.context.require('jira/admin/analytics').bindEvents();
        },

        createClickAssert: function createClickAssert(html, expectedName, expectedProperties) {
            this.createAndClick(html);
            this.assertEvent(expectedName, expectedProperties);
        },

        createAndClick: function createAndClick(html, parent) {
            var element = $(html);
            parent = parent || "#qunit-fixture";
            element.appendTo(parent);
            element.click();
        },

        assertEvent: function assertEvent(expectedName, expectedProperties) {
            ok(this.sendSpy.calledOnce, "Event added only once");

            var event = this.sendSpy.args[0][0];

            equal(event.name, expectedName, "Check event name");

            if (expectedProperties) {
                _.each(expectedProperties, function (expectedValue, key) {
                    equal(event.properties[key], expectedValue, "Check property '" + key + "'");
                });
            }

            this.sendSpy.reset();
        }
    });

    test("Select workflow edit/view mode", function () {
        this.createClickAssert("<a class='workflow-view-toggle' data-mode='diagram' href='#'></a>", "administration.workflow.selectmode", { mode: "diagram", edit: false });

        this.createClickAssert("<a class='workflow-view-toggle' data-mode='text' href='#'></a>", "administration.workflow.selectmode", { mode: "text", edit: false });

        this.createClickAssert("<a class='workflow-edit-toggle' data-mode='diagram' href='#'></a>", "administration.workflow.selectmode", { mode: "diagram", edit: true });

        this.createClickAssert("<a class='workflow-edit-toggle' data-mode='text' href='#'></a>", "administration.workflow.selectmode", { mode: "text", edit: true });
    });

    test("Edit workflow in text mode", function () {
        var instance = this;
        function assertTextModeEditEvent(triggerId, action, object) {
            instance.createClickAssert("<a id='" + triggerId + "' href='#'></a>", "administration.workflow.edit", { mode: "text", action: action, object: object });
        }

        assertTextModeEditEvent("workflow-step-add-submit", "add", "step");
        assertTextModeEditEvent("workflow-step-update", "update", "step");
        assertTextModeEditEvent("workflow-step-delete", "remove", "step");
        assertTextModeEditEvent("workflow-transition-add", "add", "transition");
        assertTextModeEditEvent("workflow-transition-update", "update", "transition");
        assertTextModeEditEvent("workflow-transition-delete", "remove", "transition");
        assertTextModeEditEvent("workflow-global-transition-update", "update", "globaltransition");
    });

    test("Edit workflow in diagram mode", function () {
        var instance = this;
        function assertDiagramEditEvent(action, object) {
            Events.trigger("wfd-edit-action", { action: action, object: object });
            instance.assertEvent("administration.workflow.edit", { mode: "diagram", action: action, object: object });
        }

        assertDiagramEditEvent("add", "status");
        assertDiagramEditEvent("update", "status");
        assertDiagramEditEvent("remove", "status");
        assertDiagramEditEvent("add", "step");
        assertDiagramEditEvent("remove", "step");
        assertDiagramEditEvent("add", "transition");
        assertDiagramEditEvent("update", "transition");
        assertDiagramEditEvent("remove", "transition");
        assertDiagramEditEvent("add", "globaltransition");
        assertDiagramEditEvent("update", "globaltransition");
        assertDiagramEditEvent("remove", "globaltransition");
    });

    test("View workflow on workflow scheme edit page", function () {
        var parent = $("<div id='workflowscheme-editor'></div>");
        parent.appendTo("#qunit-fixture");

        this.createAndClick("<a class='workflow-text-view' href='#'></a>", parent);
        this.assertEvent("administration.workflowscheme.viewworkflow", { mode: "text" });

        this.createAndClick("<a class='workflow-diagram-view' href='#'></a>", parent);
        this.assertEvent("administration.workflowscheme.viewworkflow", { mode: "diagram" });
    });

    test("View workflow as text on project workflows page", function () {
        this.createClickAssert("<a class='project-config-workflow-text-link' href='#'></a>", "administration.projectconfig.workflow.viewastext");
    });
});