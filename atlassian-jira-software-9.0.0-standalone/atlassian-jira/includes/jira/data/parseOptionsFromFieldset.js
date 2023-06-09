define('jira/data/parse-options-from-fieldset', ['jquery'], function (jQuery) {
    'use strict';

    function parseOptionsFromFieldset($fieldset) {
        var parsedValues = parseFieldset($fieldset, $fieldset);
        $fieldset.remove();
        return parsedValues;
    }

    function parseFieldset($fieldset, $parentFieldset) {
        var ret = {};
        $fieldset.children().each(function () {
            var itemValue;
            var $item = jQuery(this);
            if ($item.is("input[type=hidden]")) {
                itemValue = parseValue($item);
                if (ret.hasOwnProperty(itemValue.id)) {
                    if (jQuery.isArray(ret[itemValue.id])) {
                        ret[itemValue.id].push(itemValue.value);
                    } else {
                        ret[itemValue.id] = [ret[itemValue.id], itemValue.value];
                    }
                } else {
                    ret[itemValue.id] = itemValue.value;
                }
            } else if ($item.is("fieldset")) {
                ret[$item.attr("title") || $item.attr("id")] = parseFieldset($item, $parentFieldset);
            } else {
                $item.insertBefore($parentFieldset);
            }
        });
        return ret;
    }

    function parseValue($item) {
        var itemValue = {};
        var value = $item.val();
        itemValue.id = $item.attr("title") || $item.attr("id");
        itemValue.value = value.match(/^(tru|fals)e$/i) ? value.toLowerCase() === "true" : value;
        return itemValue;
    }

    return parseOptionsFromFieldset;
});

AJS.namespace('JIRA.parseOptionsFromFieldset', null, require('jira/data/parse-options-from-fieldset'));