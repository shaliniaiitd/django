AJS.test.require('jira.webresources:projectpermissions', function () {
    'use strict';

    var $ = require('jquery');
    var _ = require('underscore');
    var PermissionSchemeModel = require('jira/project/permissions/permissionschememodel');
    var AddPermissionModel = require('jira/project/permissions/addpermissionmodel');
    var PermissionCollection = require('jira/project/permissions/permissioncollection');
    var SecurityTypes = require('jira/project/permissions/securitytypes');

    var AddPermissionView = require('jira/project/permissions/addpermissionview');
    var view;

    /**
     * Creates a complete set of models and collections to render this view. As this view groups all other views to render
     * the final dialog, it requires a slightly complex combination of models.
     *
     * @returns {{schemeModel: {PermissionSchemeModel}, addModel: {AddPermissionModel}}}
     */
    function createFunctionalState(server) {
        var schemeModel = new PermissionSchemeModel({ id: 12345 });
        schemeModel.set('permissions', new PermissionCollection([{
            permissionKey: 'random-permission-key',
            permissionName: 'Random Permission Name'
        }, {
            permissionKey: 'another-permission-key',
            permissionName: 'Another Permission Name'
        }, {
            permissionKey: 'BROWSE_PROJECTS',
            permissionName: 'Browse Projects'
        }]));

        var addModel = new AddPermissionModel({
            permissionSchemeId: schemeModel.get('id'),
            permissionKey: 'random-permission-key' // this needs to match one of the item in the SchemeModel above
        });
        addModel.fetch();

        server.requests[0].respond(200, {
            'Content-Type': 'application/json'
        }, JSON.stringify({
            // based on com.atlassian.jira.permission.management.SecurityTypeValuesServiceImpl.PRIMARY_SECURITY_TYPES
            primarySecurityType: [{
                displayName: 'Project Role Permission',
                securityType: SecurityTypes.PROJECT_ROLE,
                values: [{
                    displayValue: 'Option A',
                    value: '77777'
                }, {
                    displayValue: 'Option B',
                    value: '88888'
                }]
            }, {
                displayName: 'Application Role Permission',
                securityType: SecurityTypes.APPLICATION_ROLE,
                values: [{
                    displayValue: 'Option C',
                    value: '44444'
                }, {
                    displayValue: 'Option D',
                    value: '55555'
                }]
            }, {
                displayName: 'Group',
                securityType: SecurityTypes.GROUP,
                values: []
            }],
            secondarySecurityType: [{
                displayName: 'Reporter',
                securityType: SecurityTypes.REPORTER,
                values: []
            }]
        }));

        return {
            schemeModel: schemeModel,
            addModel: addModel
        };
    }

    module('Dialog rendering', {
        setup: function setup() {
            this.sandbox = sinon.sandbox.create({ useFakeServer: true });
            $('#qunit-fixture').html(JIRA.Templates.AddProjectPermission.renderPopupContent());

            var baseModels = createFunctionalState(this.sandbox.server);
            view = new AddPermissionView({
                el: '#grant-project-permission-popup',
                schemeModel: baseModels.schemeModel,
                model: baseModels.addModel
            });

            view.open();
        },
        teardown: function teardown() {
            view.close();
            this.sandbox.restore();
        },
        selectPermission: function selectPermission(permissionKeys) {
            var select2 = $('#permission-target-select');
            select2.val(permissionKeys);
            select2.trigger('change');
        },
        selectSecurityType: function selectSecurityType(securityType) {
            view.$el.find('#' + securityType + '-security-type').attr('checked', true).click();
        },
        assertSecurityWarningIsVisible: function assertSecurityWarningIsVisible() {
            ok(view.$el.find('#grant-permission-dialog-security-warning').is(':visible'), 'a security warning should be visible');
        },
        assertSecurityWarningIsHidden: function assertSecurityWarningIsHidden() {
            ok(view.$el.find('#grant-permission-dialog-security-warning').is(':hidden'), 'a security warning should be hidden');
        }
    });

    test('Ensure elements are rendered as expected', function () {
        strictEqual(view.$el.find('#permission-target-select').size(), 1, 'element to select the permission should be present');

        strictEqual(view.$el.find('.security-type-list-content > .radio').not('.secondary').size(), 3, 'there should be three grant types marked as primary');
        strictEqual(view.$el.find('.security-type-list-content > .radio.secondary').size(), 1, 'there should be a single grant type marked as secondary');
        strictEqual(view.$el.find('#security-type-list-more-opts-btn').is(':visible'), true, 'show more button should be visible');

        strictEqual(view.$el.find('#grant-permission-dialog-grant-button[aria-disabled=true]').size(), 1, 'submit button should be disabled');
        this.assertSecurityWarningIsHidden();
    });

    test('Ensure only the chosen model is pre-selected when the dialog is open', function () {
        strictEqual(_.first(view.$el.find('#permission-target-select').val()), view.model.get('permissionKey'), 'only the selected permission key should return from the grant combo');
    });

    test('Ensure form controls are correctly enabled/disabled when submit is clicked', function () {
        var $permissionType = view.$el.find('.security-type-list-content > .radio:first > input');
        $permissionType.attr('checked', true).click();

        var $submitButton = view.$el.find('#grant-permission-dialog-grant-button');
        strictEqual($submitButton.attr('aria-disabled'), 'false', 'submit button should be enabled');
        strictEqual($permissionType.attr('aria-disabled'), undefined, 'radio to select permission type should not be aria-disabled');
        strictEqual($permissionType.attr('disabled'), undefined, 'radio to select permission type should not be disabled');
        $submitButton.click();

        strictEqual(this.sandbox.server.requests.length, 2, 'a request for granting permission should have been fired');
        // fields should be disabled when the form is submitted
        strictEqual($permissionType.attr('aria-disabled'), 'true', 'radio to select permission type should be aria-disabled');
        strictEqual($permissionType.attr('disabled'), 'disabled', 'radio to select permission type should be disabled');
    });

    test('Ensure data is sent in the right format when form is submitted', function () {
        var $permissionType = view.$el.find('.security-type-list-content > .radio:first > input');
        $permissionType.attr('checked', true).click();

        view.$el.find('#grant-permission-dialog-grant-button').click();

        strictEqual(this.sandbox.server.requests.length, 2, 'a single request should have been fired');

        // verify the submitted data
        var submittedData = JSON.parse(this.sandbox.server.requests[1].requestBody);
        deepEqual(submittedData.permissionKeys, [view.model.get('permissionKey')], 'permissionKeys should be an array of a single element with the chosen permission');
        strictEqual(submittedData.grants[0].securityType, SecurityTypes.PROJECT_ROLE, 'a grant to add project role should have been submitted');
        strictEqual(submittedData.grants[0].value, '77777', 'first option was selected and submitted');
    });

    test('Ensure a security warning is displayed when risky config is selected', function () {
        this.selectPermission(['another-permission-key', 'BROWSE_PROJECTS']);

        this.selectSecurityType(SecurityTypes.PROJECT_ROLE);
        this.assertSecurityWarningIsHidden();

        this.selectSecurityType(SecurityTypes.GROUP);
        this.assertSecurityWarningIsVisible();

        this.selectSecurityType(SecurityTypes.APPLICATION_ROLE);
        this.assertSecurityWarningIsHidden();

        this.selectSecurityType(SecurityTypes.REPORTER);
        this.assertSecurityWarningIsHidden();

        this.selectSecurityType(SecurityTypes.GROUP);
        this.assertSecurityWarningIsVisible();
    });

    test('Ensure a security warning gets hidden when all permissions are deselected', function () {
        this.selectPermission(['another-permission-key', 'BROWSE_PROJECTS']);

        this.selectSecurityType(SecurityTypes.GROUP);
        this.assertSecurityWarningIsVisible();

        this.selectPermission([]);
        this.assertSecurityWarningIsHidden();
    });
});