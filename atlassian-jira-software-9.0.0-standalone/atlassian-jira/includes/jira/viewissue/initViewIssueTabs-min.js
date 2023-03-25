define("jira/viewissue/init-view-issue-tabs",["jquery","wrm/require","jira/util/events","jira/util/events/types","jira/viewissue/tabs","jira/viewissue/tabs/initTab","jira/featureflags/feature-manager"],function(e,i,a,r,t,s,n){"use strict";function o(){performance.mark("activityTabFullyLoaded")}function u(e,a){a.data("is-ready")&&!c&&0===a.find("#activity-panel-placeholder").length||s(e,a).then(function(e){a.is("#activitymodule")&&(o("activityTabFullyLoaded"),t.domReady(e))}).catch(function(){i(["wr!jira.webresources:jira-formatter","wr!jira.webresources:messages","wr!jira.webresources:jira-analytics-amd","wr!jira.webresources:jira-issuenavigator"],function(){var e=require("jira/util/formatter"),i=require("jira/flag"),a=require("jira/analytics"),r=require("jira/issue");a.send({name:"jira.viewissue.tab.error",properties:{entityId:r.getIssueId()}});var t=document.createElement("a");t.setAttribute("href",window.location.href),t.textContent=e.I18n.getText("viewissue.tabs.loading.error.refresh"),i.showWarningMsg("",e.I18n.getText("viewissue.tabs.loading.error",t.outerHTML)+"<br />"+e.I18n.getText("viewissue.tabs.loading.error.contact"))}).catch(function(){console.error("Failed to display tab error message due to error when loading WRM dependencies.")})})}var c=n.isFeatureEnabled("com.atlassian.jira.lazyload.activity.tabs");e(function(){var i=e("#activitymodule");1===i.length&&u(null,i),r.PANEL_REFRESHED&&a.bind(r.PANEL_REFRESHED,function(e,i,a,r){if("activitymodule"===i){var t=r.find("#issue_actions_container > .issue-data-block.focused");1===t.length&&a.find("#"+t.attr("id")).addClass("focused")}})}),a.bind(r.NEW_CONTENT_ADDED,function(e,i){u(e,i)})});