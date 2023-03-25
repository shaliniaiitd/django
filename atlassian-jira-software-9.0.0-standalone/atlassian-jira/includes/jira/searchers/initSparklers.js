define('jira/searchers/element/sparkler', ['jira/ajs/select/checkbox-multi-select', 'jira/skate', 'jquery'], function (CheckboxMultiSelect, skate, $) {
    'use strict';

    return skate("js-default-checkboxmultiselect", {
        type: skate.type.CLASSNAME,
        created: function checkboxMultiSelectCreated(element) {
            var options = { element: element };
            var ariaLabel = $.attr(element, 'aria-label');
            if (ariaLabel) {
                options.ariaLabel = ariaLabel;
            }
            new CheckboxMultiSelect(options);
        }
    });
});

define('jira/searchers/element/status-lozenge-sparkler', ['jira/ajs/select/checkbox-multi-select-status-lozenge', 'jira/skate'], function (CheckboxMultiSelectStatusLozenge, skate) {
    'use strict';

    return skate("js-default-checkboxmultiselectstatuslozenge", {
        type: skate.type.CLASSNAME,
        created: function checkboxMultiSelectCreated(element) {
            new CheckboxMultiSelectStatusLozenge({
                element: element
            });
        }
    });
});

define("jira/searchers/element/label-sparkler", ['jira/ajs/select/checkbox-multi-select', 'jira/ajs/list/group-descriptor', 'jira/ajs/list/item-descriptor', 'jira/skate', 'underscore', 'wrm/context-path'], function (CheckboxMultiSelect, GroupDescriptor, ItemDescriptor, skate, _, contextPath) {
    'use strict';

    return skate("js-label-checkboxmultiselect", {
        type: skate.type.CLASSNAME,
        created: function checkboxMultiSeletCreated(element) {
            var cms = new CheckboxMultiSelect({
                element: element,
                ajaxOptions: {
                    url: contextPath() + "/rest/api/1.0/labels/suggest",
                    minQueryLength: 0,
                    formatResponse: function formatResponse(response) {
                        var selectedValues = cms.model.getSelectedValues();
                        return [new GroupDescriptor({
                            items: _.map(_.sortBy(_.reject(response.suggestions, function (suggestion) {
                                return _.contains(selectedValues, suggestion.label);
                            }), "label"), function (suggestion) {
                                return new ItemDescriptor({
                                    highlighted: true,
                                    html: suggestion.html,
                                    label: suggestion.label,
                                    value: suggestion.label,
                                    title: suggestion.label
                                });
                            })
                        })];
                    }
                }
            });
        }
    });
});

define('jira/searchers/element/project-sparkler', ['jira/ajs/select/checkbox-multi-select', 'jira/skate', 'jquery', 'jira/searchers/element/project-picker-options'], function (CheckboxMultiSelect, skate, $, projectPickerOptions) {
    'use strict';

    return skate("js-project-checkboxmultiselect", {
        type: skate.type.CLASSNAME,
        created: function created(element) {
            var options = { element: element };
            var ariaLabel = $.attr(element, 'aria-label');
            if (ariaLabel) {
                options.ariaLabel = ariaLabel;
            }
            options.maxResultsDisplayedPerGroup = 100;
            new CheckboxMultiSelect(projectPickerOptions(options));
        }
    });
});

define('jira/searchers/element/project-picker-options', ['wrm/context-path', 'jira/util/formatter', 'jira/ajs/list/item-descriptor', 'jira/ajs/list/group-descriptor'], function (contextPath, formatter, ItemDescriptor, GroupDescriptor) {
    'use strict';

    var maxResults = 100;
    var domParser = new DOMParser();
    var ajaxOptions = {
        url: contextPath() + '/rest/api/latest/projects/picker',
        data: {
            maxResults: maxResults
        },
        /**
         * @param {{header:string, total:number, projects:{html:string,id:string,key:string,name:string,avatar:string}[]}} data
         * @returns {GroupDescriptor[]}
         */
        formatResponse: function formatResponse(data) {
            var items = data.projects.map(function (project) {
                return new ItemDescriptor({
                    value: project.id,
                    label: domParser.parseFromString(project.html, "text/html").body.innerText || project.name,
                    icon: project.avatar,
                    html: project.html,
                    allowDuplicate: false,
                    highlighted: true
                });
            });

            var notShownItemsNumber = data.total - items.length;
            var footerText = notShownItemsNumber > 0 ? formatter.I18n.getText("common.concepts.too.many.matches", notShownItemsNumber) : undefined;
            return [new GroupDescriptor({ items: items, footerText: footerText, fetchedThroughAjaxCall: true })];
        }
    };

    return function (options) {
        return Object.assign({}, options, {
            content: "mixed",
            maxInlineResultsDisplayed: maxResults,
            ajaxOptions: ajaxOptions
        });
    };
});

// Invoke immediately
require(["jira/searchers/element/sparkler", "jira/searchers/element/status-lozenge-sparkler", "jira/searchers/element/label-sparkler", "jira/searchers/element/project-picker-options", "jira/searchers/element/project-sparkler"]);