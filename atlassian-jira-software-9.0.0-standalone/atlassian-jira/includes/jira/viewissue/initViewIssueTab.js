define('jira/viewissue/tabs/initTab', ['wrm/context-path', 'jira/featureflags/feature-manager', 'jira/util/data/meta'], function (wrmContextPath, featureManager, meta) {
    'use strict';

    var LAZY_LOAD_ACTIVITY_TABS = featureManager.isFeatureEnabled('com.atlassian.jira.lazyload.activity.tabs');

    function hasValidFocusedItem() {
        return window.location.hash.match(/(comment|worklog)-/);
    }

    return function initTab(event, $el) {
        if ($el.attr('id') === 'activitymodule' && LAZY_LOAD_ACTIVITY_TABS && $el.find('#activity-panel-placeholder').length > 0 && !$el.data('is-ready')) {
            $el.data('is-ready', true); // imagine scenario where the AJAX call is not yet done and we receive another placeholder
            var url = wrmContextPath() + '/browse/' + meta.get('issue-key') + window.location.search;
            return fetch(url, {
                headers: {
                    'X-PJAX': 'true', // needed for the ViewIssue action to return only the activity panel
                    'X-Requested-With': 'XMLHttpRequest'
                }
            }).then(function (response) {
                return response.text();
            }).then(function (activityModuleMarkup) {
                $el.find('.mod-content').html(activityModuleMarkup);
                if (hasValidFocusedItem()) {
                    var focusedItem = document.querySelector(window.location.hash);
                    focusedItem && focusedItem.scrollIntoView();
                }
                return $el;
            });
        }

        return Promise.resolve($el);
    };
});