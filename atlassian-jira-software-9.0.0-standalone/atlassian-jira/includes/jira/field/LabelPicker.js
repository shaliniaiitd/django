define('jira/field/label-picker', ['jira/util/formatter', 'jira/ajs/select/multi-select', 'jira/ajs/list/group-descriptor', 'jira/ajs/list/item-descriptor', 'wrm/context-path', 'jquery'], function (formatter, MultiSelect, GroupDescriptor, ItemDescriptor, wrmContextPath, jQuery) {
    'use strict';

    var contextPath = wrmContextPath();

    /**
     * @class LabelPicker
     * @extends MultiSelect
     */
    return MultiSelect.extend({

        _getDefaultOptions: function _getDefaultOptions() {
            return jQuery.extend(true, this._super(), {
                ajaxOptions: {
                    url: contextPath + "/includes/js/ajs/layer/labeldata.js",
                    formatResponse: this._formatResponse
                },
                removeDuplicates: true,
                removeOnUnSelect: true,
                userEnteredOptionsMsg: formatter.I18n.getText("label.new")
            });
        },

        isValidItem: function isValidItem(itemValue) {
            return !/\s/.test(itemValue);
        },

        _handleServerSuggestions: function _handleServerSuggestions(data) {
            // if the suggestions brought back from the server include the original token and it doesn't match with the
            // token provided by the user disregard the suggestions
            if (data && data.token) {
                if (jQuery.trim(this.$field.val()) !== data.token) {
                    return;
                }
            }
            this._super(data);
        },

        _handleSpace: function _handleSpace() {
            if (jQuery.trim(this.$field.val()) !== "") {
                if (this.handleFreeInput()) {
                    this.hideSuggestions();
                }
            }
        },

        keys: {

            //if the user presses space, turn the text entered into labels.
            //if they pressed enter and the dropdown is *not* visible, then also turn text into labels.  Otherwise if the
            //dropdown is visibly enter should just select the item from the dropdown.
            "Spacebar": function Spacebar(event) {
                this._handleSpace();
                event.preventDefault();
            }
        },

        _formatResponse: function _formatResponse(data) {

            var optgroup = new GroupDescriptor({
                label: formatter.I18n.getText("common.words.suggestions"),
                type: "optgroup",
                styleClass: 'labels-suggested'
            });

            if (data && data.suggestions) {
                jQuery.each(data.suggestions, function () {
                    optgroup.addItem(new ItemDescriptor({
                        value: this.label,
                        label: this.label,
                        html: this.html,
                        highlighted: true
                    }));
                });
            }
            return [optgroup];
        },

        handleFreeInput: function handleFreeInput() {
            var values = jQuery.trim(this.$field.val()).match(/\S+/g);

            if (values) {
                // If there are multiple space-separated values, add them separately.
                for (var i = 0; i < values.length; i++) {
                    var value = values[i];
                    this.addItem({ value: value, label: value });
                }
                this.model.$element.trigger("change");
            }

            this.$field.val("");
        }
    });
});

/** Preserve legacy namespace
 @deprecated AJS.LabelPicker */
AJS.namespace("AJS.LabelPicker", null, require('jira/field/label-picker'));
AJS.namespace('JIRA.LabelPicker', null, require('jira/field/label-picker'));