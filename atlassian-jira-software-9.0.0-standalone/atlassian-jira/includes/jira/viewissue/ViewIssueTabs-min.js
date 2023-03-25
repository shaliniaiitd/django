define("jira/viewissue/tabs",["wrm/require","jira/util/logger","jquery","jira/jquery/deferred","jira/util/data/meta","jira/dialog/form-dialog","jira/ajs/ajax/smart-ajax","jira/userhover/userhover","jira/viewissue/tabs/analytics"],function(t,e,a,i,n,r,s,o,u){"use strict";function c(t){t=t||document,a.each(_,function(e,a){a(t)})}function l(t){var e=a(t).find(".issuePanelWrapper"),i=T();A=i.length?i:A,k=e.length?e:k}function d(t,e){var a=new r({id:"issue-tab-error-dialog",widthClass:"small",content:s.buildDialogErrorContent(t,!1)});f(e),A.show(),a.show()}function f(t){a("#issue-tabs li").each(function(){var e=a(this),i=e.data("key"),n=e.data("label");if(i===t)e.addClass("active"),e.html(E.label({text:n}));else{e.removeClass("active");var r=e.data("id"),s=e.data("href");e.html(E.tab({id:r,href:s,linkClass:L,text:n}))}}),m(a("#issue-tabs"))}function h(t){f(t)}function v(t,e){var a=t.pageX,i=t.pageY,n=e.offset(),r=e.outerWidth(),s=e.outerHeight();return 0===a&&0===i||!(a>=n.left&&a<=n.left+r&&i>=n.top&&i<=n.top+s)}function m(e){var i=a(e).find("li.active").data("key");a(e).find(S).click(function(e){document.getElementById("activitymodule").classList.add("updating");var n=a(this),r=n.hasClass("issue-activity-sort-link"),s=a(".active-tab").data("id");r?t("wr!com.atlassian.jira.jira-frontend-plugin:entrypoint-activityTabs").then(function(){require("jira/activity-tabs/items-lazy-loader").then(function(t){t.getRegisteredTabsIds().includes(s)?document.getElementById("activitymodule").classList.remove("updating"):p(n,i,e)})}):p(n,i,e)})}function p(t,e,a){var i=v(a,t),n=t.parent().data("key"),r=a.metaKey;n?u.tabClicked(t,r,i):u.buttonClicked(t,r,i),r||(a.preventDefault(),n&&h(n),g(e,t.data("ajax")||t.attr("href")).done(function(e){document.getElementById("activitymodule").classList.remove("updating"),i&&(n?e.find("#"+t.attr("id")+" > :first-child").focus():e.find(".sortwrap  > :first-child").focus())}).done(c))}function g(t,n){var r=i();I&&I.abort();var o=s.makeRequest({jqueryAjaxFn:R?a.pjax:a.ajax,headers:{"X-PJAX":!0},container:J,url:n,timeout:null,complete:function(i,n,s){if("abort"!==n){if(I=null,!s.successful)return void((s.status<300||s.status>=400)&&d(s,t));var o=a(this.container),u=document.createElement("div");u.innerHTML=s.data;var c=document.createDocumentFragment().appendChild(u);R||b(o,c),e.trace("jira.issue.tab.loaded"),r.resolve(o)}}});return a(o).throbber({target:k}),I=o,r}function b(t,e){A=T();var i=e.querySelectorAll(".tabwrap"),n=t.find(".tabwrap"),r=a(e.querySelectorAll("#issue_actions_container")).contents(),s=A.contents();if(i.length&&n.length&&r.length&&s.length){n.replaceWith(i),A.stop(!0,!0);var o=A.height();A.append(r);var u=A.height()-o,c=o-u;c>0?(A.css("height",u+c),s.remove(),y(u,c)):A.empty().append(r),a(e.querySelectorAll("script")).each(function(){a.globalEval(this.text||this.textContent||this.innerHTML||"")})}else t.empty().append(e)}function y(t,e){var a=Math.min(e/800*1e3,1e3);setTimeout(function(){A.animate({height:t+1},a,"easeOutQuart",function(){A.css("height","auto")})},150)}function j(t){a(t).find(S).each(function(){var t=a(this);t.attr("href",t.attr("href")+"#issue-tabs")})}function w(t){!R||a.support.pjax?m(t):j(t)}function x(t){a(t).bind("moveToFinished",function(t,e){a("a.twixi:visible",e).focus()})}function q(t){t.find("time.livestamp").livestamp()}function C(t){a.inArray(t,_)<0&&_.push(t)}function T(){return a(J).find("#issue_actions_container")}var k,A,I,E=JIRA.Templates.Issue.Tabs,R=!1!==n.get("viewissue-use-history-api"),L="ajax-activity-content",J="#activitymodule div.mod-content",S="."+L,_=[];return C(l),C(w),C(x),C(o),C(q),{onTabReady:C,domReady:c}}),AJS.namespace("JIRA.ViewIssueTabs",null,require("jira/viewissue/tabs"));