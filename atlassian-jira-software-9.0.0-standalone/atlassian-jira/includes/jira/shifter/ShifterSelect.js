/**
 * @module jira/shifter/shifter-select
 */
define('jira/shifter/shifter-select', ['jira/util/formatter', 'jira/ajs/select/queryable-dropdown-select', 'jira/ajs/list/list-with-messages', 'jira/ajs/list/message-descriptor', 'jquery', 'underscore'], function (formatter, QueryableDropdownSelect, ListWithMessages, MessageDescriptor, jQuery, _) {
    'use strict';

    /**
     * @class ShifterSelect
     * @extends QueryableDropdownSelect
     * @alias module:jira/shifter/shifter-select
     */

    return QueryableDropdownSelect.extend({
        /**
         * @param {Object} options
         * @param options.id
         * @param options.element
         * @param {ShifterGroup[]} options.groups
         * @param {Class} options.suggestionsHandler
         * @param {Function} options.onSelection - called with (group, value) when a suggestion is selected
         * @param {Number} options.maxSuggestionsPerGroup
         * @constructs
         * @override
         */
        init: function init(options) {
            _.extend(options, {
                dropdownController: {
                    setWidth: jQuery.noop,
                    setPosition: jQuery.noop,
                    onhide: jQuery.noop,
                    hide: jQuery.noop,
                    show: jQuery.noop
                }
            });

            this._super(options);

            this.$field.attr("aria-controls", this.options.element.attr("id"));
            this.$field.attr('placeholder', formatter.I18n.getText('shifter.placeholder'));
            this.$dropDownIcon.click(_.bind(this.clear, this));
            this._handleCharacterInput();
        },

        onEdit: function onEdit() {
            this.toggleClearButton();
            this._handleCharacterInput();
        },

        clear: function clear() {
            this.$field.val('').focus();
            this.onEdit();
        },

        toggleClearButton: function toggleClearButton() {
            this.$dropDownIcon.toggleClass('aui-iconfont-remove', !!this.$field.val());
        },

        showLoading: function showLoading() {
            this._super();
            this.$dropDownIcon.removeClass('aui-iconfont-remove');
        },

        hideLoading: function hideLoading() {
            this._super();
            this.toggleClearButton();
        },

        _handleCharacterInput: function _handleCharacterInput() {
            this._super(true);
            if (this.getQueryVal().length === 0) {
                this.listController.moveToFirst();
            }
        },

        _createListController: function _createListController() {
            var instance = this;
            this.listController = new ListWithMessages({
                containerSelector: this.options.element,
                groupSelector: "ul.aui-list-section",
                scrollContainer: ".aui-list-scroll",
                listItemTag: "span",
                matchingStrategy: this.options.matchingStrategy,
                maxResultsDisplayedPerGroup: this.options.maxResultsDisplayedPerGroup,
                eventTarget: this.$field,
                hasLinks: false,
                subtextPrefix: " - ",
                renderers: {
                    suggestionGroupHeading: this._renders.suggestionGroupHeading
                },
                selectionHandler: function selectionHandler(e) {
                    var targetData = jQuery(e.currentTarget).data();
                    if (targetData && targetData.descriptor instanceof MessageDescriptor) {
                        //If selected element is a message, do nothing
                        return false;
                    }
                    var selectedDescriptor = this.getFocused().data("descriptor");
                    var groupIndex = selectedDescriptor.meta().groupIndex;
                    var group = instance.options.groups[groupIndex];
                    var value = selectedDescriptor.value();
                    var label = selectedDescriptor.label();
                    instance.$dropDownIcon.removeClass('aui-iconfont-remove');
                    instance.$field.val(formatter.I18n.getText('common.concepts.loading')).prop('disabled', true);
                    instance.options.onSelection(group, value, label);
                }
            });
        },

        hideSuggestions: jQuery.noop,

        _renders: {
            suggestionGroupHeading: function suggestionGroupHeading(descriptor) {
                return jQuery(JIRA.Templates.Shifter.groupHeading({
                    groupName: descriptor.label(),
                    groupContext: descriptor.description()
                })).data('descriptor', descriptor);
            },
            dropdownAndLoadingIcon: function dropdownAndLoadingIcon() {
                return jQuery('<span class="icon noloading aui-icon aui-icon-small"><span>More</span></span>');
            }
        }

    });
});

AJS.namespace('JIRA.ShifterComponent.ShifterSelect', null, require('jira/shifter/shifter-select'));