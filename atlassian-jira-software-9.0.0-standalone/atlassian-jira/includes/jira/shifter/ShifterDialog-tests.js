AJS.test.require(['jira.webresources:shifter'], function () {
    'use strict';

    var ShifterDialog = require('jira/shifter/shifter-dialog');
    var ShifterAnalytics = require('jira/shifter/shifter-analytics');
    var jQuery = require('jquery');
    var jQueryDeferred = require('jira/jquery/deferred');
    var assert = sinon.assert;

    var shifterDialog;

    module('ShifterDialog', {
        setup: function setup() {
            this.sandbox = sinon.sandbox.create();
            this.sandbox.useFakeTimers();

            this.sandbox.stub(ShifterAnalytics, "selection");

            shifterDialog = new ShifterDialog("shifter-dialog", [{
                id: "group-id",
                name: "name",
                weight: 1,
                getSuggestions: function getSuggestions() {
                    var d = jQueryDeferred();
                    d.resolve([{
                        label: "label",
                        value: "value"
                    }]);
                    return d.promise();
                },
                onSelection: sinon.stub()
            }], {
                maxResultsDisplayedPerGroup: 5
            });
            this.sandbox.clock.tick(1000);
        },
        teardown: function teardown() {
            shifterDialog.destroy();
            jQuery("#shifter-dialog").remove();
            this.sandbox.restore();
        }
    });

    test('should trigger analytics event on selection', function () {
        var e = jQuery.Event("keydown");
        e.which = e.keyCode = AJS.keyCode.ENTER;
        shifterDialog.$dialog.find("input").trigger(e);

        assert.calledOnce(ShifterAnalytics.selection);
        assert.calledWith(ShifterAnalytics.selection, "label", "value", "group-id");
    });
});