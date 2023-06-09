AJS.test.require('jira.webresources:projectpermissions', function () {
    'use strict';

    var $ = require('jquery');
    var formatter = require('jira/util/formatter');
    var DeletePermissionView = require('jira/project/permissions/deletepermissionview');
    var SecurityTypes = require('jira/project/permissions/securitytypes');
    var PermissionModel = require('jira/project/permissions/permissionmodel');

    var ADMIN_GROUP_GRANT = createGrant('Group', SecurityTypes.GROUP, [{
        id: 1,
        displayValue: 'Administrators'
    }]);

    var ANYONE_GRANT = createGrant('Group', SecurityTypes.GROUP, [{
        id: 2
    }]);

    var ANY_LOGGED_IN_USER_GRANT = createGrant('Application Role', SecurityTypes.APPLICATION_ROLE, [{
        id: 3
    }]);

    module('projectpermissions/delete-permission-view', {
        setup: function setup() {
            this.sandbox = sinon.sandbox.create({ useFakeServer: true });
            this.$el = $('#qunit-fixture');
            this.$el.html(JIRA.Templates.ProjectPermissions.deleteDialog({ permissionName: 'testPermissions' }));

            this.model = new PermissionModel({});
            this.view = new DeletePermissionView({
                el: this.$el.find('#delete-permission-dialog'),
                model: this.model
            });
            this.view.open();
        },

        teardown: function teardown() {
            this.view.close();
            this.sandbox.restore();
        }
    });

    function createGrant(displayName, securityType, values) {
        return {
            displayName: displayName,
            securityType: securityType,
            values: values
        };
    }

    function checkGrants(grants) {
        grants.prop('checked', true);
        grants.change();
    }

    function uncheckGrants(grants) {
        grants.prop('checked', false);
        grants.change();
    }

    test('Should display correct empty value for application role with no display value', function () {
        this.model.set('grants', [ANY_LOGGED_IN_USER_GRANT]);

        strictEqual(this.view.$el.find('label').text(), ANY_LOGGED_IN_USER_GRANT.displayName + ' - ' + formatter.I18n.getText('admin.permission.types.application.role.any'), 'Should display provided empty value for application role with no displayValue');
    });

    test('Should display correct empty value for group with no display value', function () {
        this.model.set('grants', [ANYONE_GRANT]);

        strictEqual(this.view.$el.find('label').text(), ANYONE_GRANT.displayName + ' - ' + formatter.I18n.getText('admin.common.words.anyone'), 'Should display provided empty value for group with no displayValue');
    });

    test('Should render grant with provided displayValue', function () {
        this.model.set('grants', [ADMIN_GROUP_GRANT]);

        strictEqual(this.view.$el.find('label').text(), ADMIN_GROUP_GRANT.displayName + ' - ' + ADMIN_GROUP_GRANT.values[0].displayValue, 'Should display provided displayValue');
    });

    test('Should enable submit if a grant is checked', function () {
        this.model.set('grants', [ADMIN_GROUP_GRANT, ANY_LOGGED_IN_USER_GRANT]);

        checkGrants(this.view.$el.find('[name=deleteGrant]'));

        ok(this.view.canSubmit(), 'View model should mark it as being able to be submitted');
        strictEqual(this.view.$el.find('#dialog-save-button').attr('aria-disabled'), 'false', 'Should be disabled as unchecked');
    });

    test('Should disable submit if no grant is checked', function () {
        this.model.set('grants', [ADMIN_GROUP_GRANT, ANY_LOGGED_IN_USER_GRANT]);

        uncheckGrants(this.$el.find('[name=deleteGrant]'));

        ok(!this.view.canSubmit(), 'View model should mark it as being able to be submitted');
        strictEqual(this.view.$el.find('#dialog-save-button').attr('aria-disabled'), 'true', 'Should be disabled as unchecked');
    });

    test('Should disable submit originally if more than one permission to remove', function () {
        this.model.set('grants', [ADMIN_GROUP_GRANT, ANY_LOGGED_IN_USER_GRANT]);

        this.view.render();

        ok(!this.view.canSubmit(), 'As multiple grants none should be checked and therefore the submit should be disabled');
    });

    test('Should enable submit if one grant as it will be checked originally ', function () {
        this.model.set('grants', [ADMIN_GROUP_GRANT]);

        ok(this.view.canSubmit(), 'As only one grant it should originally be checked and submittable');
    });

    test('Should enable submit if multiple grants and one selected', function () {
        this.model.set('grants', [ADMIN_GROUP_GRANT, ANY_LOGGED_IN_USER_GRANT]);

        ok(!this.view.canSubmit(), 'As no grants are checked it should be disabled');

        checkGrants(this.view.$el.find('[name=deleteGrant]').first());

        ok(this.view.canSubmit(), 'One grants is checked so it should be enabled');
    });

    test('Ensure form controls are correctly enabled/disabled when form is submitted', function () {
        this.model.set('grants', [ANY_LOGGED_IN_USER_GRANT]);

        var $deleteCheckbox = this.view.$el.find('.js-delete-grant');
        strictEqual($deleteCheckbox.attr('aria-disabled'), undefined, 'checkbox to select permission should not be aria-disabled');
        strictEqual($deleteCheckbox.attr('disabled'), undefined, 'checkbox to select permission should not be disabled');

        this.view.submit();
        strictEqual($deleteCheckbox.attr('aria-disabled'), 'true', 'checkbox to select permission should not be aria-disabled');
        strictEqual($deleteCheckbox.attr('disabled'), 'disabled', 'checkbox to select permission should not be disabled');
    });
});