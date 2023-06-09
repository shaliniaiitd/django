AJS.test.require('jira.webresources:projectpermissions', function () {
    'use strict';

    var $ = require('jquery');
    var GrantView = require('jira/project/permissions/grantsview');
    var SecurityTypes = require('jira/project/permissions/securitytypes');

    var VALUES = [{ displayValue: 'displayValue' }];
    var VALUES_NO_DISPLAYVALUE = [{ someKey: "someKey" }];

    module('projectpermissions/grants-view');

    function createViewWithSecurityTypeAndValues(securityType, values) {
        var view = new GrantView({
            grants: [{
                securityType: securityType,
                values: values
            }],
            el: "#qunit-fixture"
        });
        return view;
    }

    test('Correct empty value shown for application role', function () {
        var view = createViewWithSecurityTypeAndValues(SecurityTypes.APPLICATION_ROLE, VALUES_NO_DISPLAYVALUE);

        var $grantHTML = $('<div>').append(view.renderGrant(view.grants[0]));

        strictEqual($grantHTML.find("dd").size(), 1, 'There should only be one element in the dd');
        strictEqual($grantHTML.find("dd").text(), 'admin.permission.types.application.role.any', 'Should display provided empty value for application role');
    });

    test('Correct empty value shown for group', function () {
        var view = createViewWithSecurityTypeAndValues(SecurityTypes.GROUP, VALUES_NO_DISPLAYVALUE);

        var $grantHTML = $('<div>').append(view.renderGrant(view.grants[0]));

        strictEqual($grantHTML.find("dd").size(), 1, 'There should only be one element in the dd');
        strictEqual($grantHTML.find("dd").text(), 'admin.common.words.anyone', 'Should display provided empty value for group');
    });

    test('Single values do not have empty values displayed', function () {
        var view = createViewWithSecurityTypeAndValues(SecurityTypes.REPORTER, VALUES_NO_DISPLAYVALUE);

        var $grantHTML = $('<div>').append(view.renderGrant(view.grants[0]));

        ok(view.isSingleValueGrant(view.grants[0]), 'A non-group, non-applicationrole security type with no values passed in is a single value grant');
        strictEqual($grantHTML.find("dd").size(), 0, 'There should be no elements in the dd');
    });

    test('isSingleValueGrant is false for groups', function () {
        var view = createViewWithSecurityTypeAndValues(SecurityTypes.GROUP, []);

        ok(!view.isSingleValueGrant(view.grants[0]), 'A group security type is not a single value grant');
    });

    test('isSingleValueGrant is false for applicationRole', function () {
        var view = createViewWithSecurityTypeAndValues(SecurityTypes.APPLICATION_ROLE, []);

        ok(!view.isSingleValueGrant(view.grants[0]), 'An applicationrole security type is not a single value grant');
    });

    test('isSingleValueGrant is false when values are passed in', function () {
        var view = createViewWithSecurityTypeAndValues(SecurityTypes.REPORTER, VALUES);

        ok(!view.isSingleValueGrant(view.grants[0]), 'When values are passed in it is not a single value grant');
    });

    test('isSingleValueGrant is true when not a group, application role, and no values passed in', function () {
        var view = createViewWithSecurityTypeAndValues(SecurityTypes.REPORTER, []);

        ok(view.isSingleValueGrant(view.grants[0]), 'A non-group, non-applicationrole security type with no values passed in is a single value grant');
    });
});