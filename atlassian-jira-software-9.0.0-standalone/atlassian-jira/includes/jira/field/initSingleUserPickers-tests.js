AJS.test.require(['jira.webresources:user-pickers'], function () {
    'use strict';

    var $ = require('jquery');

    module('initSingleUserPickers', {
        setup: function setup() {
            this.sandbox = sinon.sandbox.create();
            this.context = AJS.test.mockableModuleContext();
            $('#qunit-fixture').html('<section id="container"></section>');
            this.$container = $('#container');

            this.SingleSelect = this.sandbox.spy();
            this.context.mock('jira/ajs/select/single-select', this.SingleSelect);

            this.userPopUp = {
                createUserPickerPopupTrigger: this.sandbox.spy()
            };
            this.context.mock('jira/field/create-user-picker-popup-trigger', this.userPopUp);

            this.initSingleUserPickers = this.context.require('jira/field/init-single-user-pickers');
        },
        teardown: function teardown() {
            this.sandbox.restore();
        }
    });

    test('Creates single user pickers', function () {
        this.$container.append('<input class="js-default-user-picker"/>');
        this.$container.append('<input class="js-default-user-picker"/>');
        this.$container.append('<input />');

        this.initSingleUserPickers();

        equal(this.SingleSelect.callCount, 2, 'Creates multiple user pickers');
    });

    test('Applies correct UI and a11y settings', function () {
        this.$container.append('<input class="js-default-user-picker"/>');
        this.$container.append('<input class="js-default-user-picker" data-show-dropdown-button="true" data-input-value="Jane Doe"/>');
        this.initSingleUserPickers();

        var firstCallParams = this.SingleSelect.getCall(0).args[0];

        equal(firstCallParams.ariaLabel, 'user.picker.select.user', 'Has aria label');
        equal(firstCallParams.errorMessage, 'user.picker.invalid.user', 'Has error message');
        equal(firstCallParams.iconType, 'rounded', 'Has rounded avatar type');
        equal(firstCallParams.showDropdownButton, false, 'Does not have dropdown button');
        equal(firstCallParams.inputText, undefined, 'Does not have input text');
        equal(firstCallParams.hasAddonIcon, false, 'Does not have addon icon');

        var secondCallParams = this.SingleSelect.getCall(1).args[0];

        equal(secondCallParams.showDropdownButton, true, 'Has dropdown button when specified');
        equal(secondCallParams.inputText, 'Jane Doe', 'Has input text when specified');
    });

    test('Attaches event to pop-up icon', function () {
        this.$container.append('<input class="js-default-user-picker" name="field" data-form-name="form" data-field-config-id="1000" data-has-popup-picker="true" data-project-ids="1,2" /><a class="popup-trigger">I am trigger</a>');
        this.$container.append('<form name="form2"><input class="js-default-user-picker" name="field" data-field-config-id="1000" data-has-popup-picker="true" data-project-ids="1," /><a class="popup-trigger">I am trigger</a></form>');
        this.initSingleUserPickers();

        this.$container.find('.popup-trigger').trigger('click');

        var firstCallParams = this.userPopUp.createUserPickerPopupTrigger.getCall(0).args[0];

        equal(firstCallParams.formName, 'form', 'Supplies correct form name');
        equal(firstCallParams.fieldConfigId, 1000, 'Supplies correct field config id');
        deepEqual(firstCallParams.projectIds, ['1', '2'], 'Supplies correct project ids');
        equal(firstCallParams.triggerEvent, 'userpicker:onPopUpSelection', 'Supplies correct event name');

        var secondCallParams = this.userPopUp.createUserPickerPopupTrigger.getCall(1).args[0];

        equal(secondCallParams.formName, 'form2', 'Supplies correct form name when inside form');
        deepEqual(secondCallParams.projectIds, ['1'], 'Supplies correct project ids for trailing comma');
    });

    test('Supports custom options for custom fields AJAX call', function () {
        this.$container.append('<input class="js-default-user-picker" name="userpicker" data-field-config-id="1000" data-project-ids="1000">');
        this.$container.append('<input class="js-default-user-picker" name="customfield_1000" data-field-config-id="1000" data-project-ids="1000,100">');
        this.initSingleUserPickers();

        var firstCallParams = this.SingleSelect.getCall(0).args[0].ajaxOptions.data;

        equal(firstCallParams.showAvatar, true, 'In non-CF case, shows avatar');
        equal(firstCallParams.fieldConfigId, undefined, 'In non-CF case, does not send field config id');
        equal(firstCallParams.fieldName, undefined, 'In non-CF case, does not send field name');
        equal(firstCallParams.projectId, undefined, 'In non-CF case, does not send project id');
        equal(firstCallParams.query, undefined, 'In non-CF case, uses debouncing; does not force server call on each keystroke');

        var secondCallParams = this.SingleSelect.getCall(1).args[0].ajaxOptions.data;

        equal(secondCallParams.showAvatar, true, 'Shows avatar');
        equal(secondCallParams.fieldConfigId, 1000, 'Send correct field config id');
        equal(secondCallParams.fieldName, 'customfield_1000', 'Send correct field name');
        equal(secondCallParams.query, undefined, 'Uses debouncing; does not force server call on each keystroke');
        deepEqual(secondCallParams.projectId, ['1000', '100'], 'Send correct project id');
    });
});