define("jira/viewissue/init-toggle-block",["jira/util/events","jira/util/events/types","jira/toggleblock/toggle-block"],function(e,t,i){"use strict";new i({blockSelector:".toggle-wrap",triggerSelector:"#issue-content .mod-header .toggle-title, #ghx-detail-contents .mod-header .toggle-title",storageCollectionName:"block-states"}),t.ISSUE_REFRESHED&&e.bind(t.ISSUE_REFRESHED,function(){t.REFRESH_TOGGLE_BLOCKS&&e.trigger(t.REFRESH_TOGGLE_BLOCKS)})});