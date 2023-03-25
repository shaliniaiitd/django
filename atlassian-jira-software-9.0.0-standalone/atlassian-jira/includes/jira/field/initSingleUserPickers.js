define('jira/field/init-single-user-pickers', ['jquery', 'wrm/context-path', 'jira/ajs/select/single-select', 'jira/util/events/reasons', 'jira/util/events/types', 'jira/util/events', 'jira/field/user-picker-util', 'jira/util/formatter', 'jira/field/create-user-picker-popup-trigger', 'jira/ajs/list/item-descriptor'], function (jQuery, wrmContextPath, SingleSelect, Reasons, Types, Events, UserPickerUtil, formatter, userPopup, ItemDescriptor) {
    'use strict';

    var contextPath = wrmContextPath();

    function isCustomField(name) {
        return name && name.indexOf('customfield_') !== -1;
    }

    function createSingleUserPickers(ctx) {
        jQuery('.js-default-user-picker', ctx).each(function () {
            var $this = jQuery(this);
            if ($this.data('aui-ss')) {
                return;
            }
            var isCustom = isCustomField($this.attr('name'));
            var restPath = isCustom ? '/rest/api/1.0/users/picker' : '/rest/api/2/user/picker';
            var data = {
                showAvatar: true,
                fieldName: isCustom ? $this.prop('name') : undefined,
                fieldConfigId: isCustom ? $this.data('field-config-id') : undefined,
                projectId: isCustom ? $this.data('project-ids').split(',').filter(function (x) {
                    return x;
                }) : undefined
            };
            var inputText = $this.data('inputValue');

            if ($this.data('has-popup-picker')) {
                $this.next('.popup-trigger').on('click', userPopup.createUserPickerPopupTrigger({
                    urlBase: contextPath,
                    formName: $this.data('form-name') || $this.closest('form').attr('name'),
                    fieldName: $this.prop('name'),
                    fieldConfigId: $this.data('field-config-id'),
                    projectIds: $this.data('project-ids') ? $this.data('project-ids').split(',').filter(function (x) {
                        return x;
                    }) : undefined,
                    triggerEvent: 'userpicker:onPopUpSelection'
                }));
            }

            new SingleSelect({
                element: $this,
                submitInputVal: true,
                hasAddonIcon: !!$this.data('has-popup-picker'),
                showDropdownButton: !!$this.data('show-dropdown-button'),
                errorMessage: formatter.I18n.getText('user.picker.invalid.user', "'{0}'"),
                iconType: 'rounded',
                ajaxOptions: {
                    url: contextPath + restPath,
                    data: data,
                    formatResponse: UserPickerUtil.formatResponse
                },
                inputText: inputText,
                ariaLabel: formatter.I18n.getText('user.picker.select.user'),
                events: {
                    element: {
                        // eslint-disable-next-line no-unused-vars
                        'userpicker:onPopUpSelection': function userpickerOnPopUpSelection(event, $select, instance, value) {
                            jQuery.ajax({
                                url: contextPath + '/rest/api/2/user?username=' + value,
                                type: 'GET',
                                contentType: 'application/json',
                                success: function success(user) {
                                    instance.setSelection(new ItemDescriptor({
                                        value: value,
                                        label: user.displayName,
                                        icon: user.avatarUrls['24x24']
                                    }), true);
                                },
                                error: function error(err) {
                                    return console.error(err);
                                }
                            });
                        }
                    }
                }
            });
        });
    }

    Events.bind(Types.NEW_CONTENT_ADDED, function (e, context, reason) {
        //eslint-disable-line @atlassian/jira-event-checks/no-newcontentadded-handlers
        if (reason !== Reasons.panelRefreshed) {
            createSingleUserPickers(context);
        }
    });

    return createSingleUserPickers;
});