!function(){"use strict";function e(){j("label.overlabel").overlabel()}function t(){var e=j("div.results"),t=e.width();e.bind("resultsWidthChanged",function(){j(this).css("width",100/t*(t-(parseInt(j(document.documentElement).prop("scrollWidth"),10)-j(window).width()))+"%")}),j(window).resize(function(){e.trigger("resultsWidthChanged")}),e.trigger("resultsWidthChanged"),j("#issuenav").bind("contractBlock expandBlock",function(){j(".results").trigger("resultsWidthChanged")})}function i(){j(".fieldTabs li").click(function(e){e.preventDefault(),e.stopPropagation();var t=j(this);t.hasClass("active")||(j(".fieldTabs li.active").removeClass("active"),t.addClass("active"),j(".fieldTabArea.active").removeClass("active"),j("#"+t.attr("rel")).addClass("active"))})}function a(){j("form").handleAccessKeys(),Q.bind("dialogContentReady",function(){j("form",this.$content).handleAccessKeys({selective:!1})})}function n(){Q.keydown(function(e){y.current&&27===e.which&&!j(e.target).is(":input")&&y.current.hide()})}function r(){new x({blockSelector:".twixi-block",storageCollectionName:"twixi"}).addCallback("toggle",function(){E.getStalker().trigger("stalkerHeightUpdated")}).addTrigger(".action-head .action-details","click"),new x({blockSelector:"#issue-filter .toggle-wrap:not(#navigator-filter-subheading-textsearch-group)",triggerSelector:".toggle-trigger",collapsedClass:"expanded",expandedClass:"collapsed",storageCollectionName:"navSimpleSearch"}),new x({blockSelector:".twixi-block",triggerSelector:".twixi-trigger",storageCollectionName:"twixi"}),new x({blockSelector:"#issuenav",triggerSelector:"a.toggle-lhc",collapsedClass:"lhc-collapsed",storageCollectionName:"lhc-state",autoFocusTrigger:!1}),j(".error","#issue-filter").parents(".toggle-wrap").removeClass("collapsed").addClass("expanded"),j("fieldset.content-toggle input[type='radio']").live("change",function(){var e=j(this);e.closest(".content-toggle").find("input[type='radio']").each(function(){var e=j(this);j("#"+e.attr("name")+"-"+e.val()+"-content").addClass("hidden")}),j("#"+e.attr("name")+"-"+e.val()+"-content").removeClass("hidden")})}function o(){j("#log-work-adjust-estimate-new-value,#log-work-adjust-estimate-manual-value").attr("disabled","disabled"),j("#log-work-adjust-estimate-"+j("input[name=worklog_adjustEstimate]:checked,input[name=adjustEstimate]:checked").val()+"-value").removeAttr("disabled"),j("input[name=worklog_adjustEstimate],input[name=adjustEstimate]").change(function(){j("#log-work-adjust-estimate-new-value,#log-work-adjust-estimate-manual-value").attr("disabled","disabled"),j("#log-work-adjust-estimate-"+j(this).val()+"-value").removeAttr("disabled")})}function s(){var e=j("input:checked");0!==e.length&&("forgot-login-rb-forgot-password"===e.attr("id")?(j("#username,#password").addClass("hidden"),j("#password").removeClass("hidden")):"forgot-login-rb-forgot-username"===e.attr("id")&&(j("#username,#password").addClass("hidden"),j("#username").removeClass("hidden"))),j("#forgot-login-rb-forgot-password").change(function(){j("#username,#password").addClass("hidden"),j("#password").removeClass("hidden")}),j("#forgot-login-rb-forgot-username").change(function(){j("#username,#password").addClass("hidden"),j("#username").removeClass("hidden")})}function l(){j("input.upfile").each(function(){var e=j(this),t=e.closest(".field-group");e.change(function(){e.val().length>0&&t.next(".field-group").removeClass("hidden")})})}function c(){Q.on("keydown","textarea",T.submitOnCtrlEnter),j("#jqltext").keypress(T.submitOnEnter)}function d(){var e=j("#browser-warning");j(".aui-close-button",e).click(function(){e.slideUp("fast"),I.save("UNSUPPORTED_BROWSER_WARNING","handled")})}function u(){j("form").submit(function(e){var t=new j.Event("before-submit");j(this).trigger(t),t.isDefaultPrevented()&&e.preventDefault()})}function f(){var e="#comment, #environment, #description";Q.bind("tabSelect",function(t,i){i.pane.find(e).expandOnInput()}),j(e).expandOnInput(200),Q.bind("dialogContentReady",function(t,i){i.get$popupContent().bind("tabSelect",function(t,i){i.pane.find(e).expandOnInput(200)}).find(e).expandOnInput(200)}),Q.bind("showWikiInput",function(t,i){i.find(e).expandOnInput()})}function g(){var e=j("form.aui"),t=j("a.cancel",e);O.isIE()&&O.majorVersion()<12&&t.attr("accessKey")&&t.focus(function(e){e.altKey&&(j(this).mousedown(),window.location.href=t.attr("href"))})}function h(){var e=function(){j('[name="timetracking_targetsubfield"]').length&&j("#cbtimetracking").attr("checked",!!j('[name="timetracking_targetsubfield"]:checked').length)},t=function(t){j(t).closest(".availableActionRow").find("td:first :checkbox").attr("checked",!0),"timetracking_targetsubfield"===t.name&&e()};j("#availableActionsTable tr.availableActionRow").children("td:last-child").find(":input").change(function(){t(this)}),["originalestimate","remainingestimate"].forEach(function(e){var t=j("#timetracking_"+e+"_subfield");j("#timetracking_"+e).change(function(){t.attr("checked",!0)})}),j("form#bulkedit").submit(e)}function p(){var e=function(e){j(e).closest("tr").prev().find("td:first :checkbox").attr("checked",!0)};j("#availableActionsTable .availableActionRowMultiSelect").children("td:last-child").find(":input").change(function(){e(this)})}function m(){j("#availableActionsTable .availableActionMultiSelect select").change(function(){var e=j(this);e.closest("tr").next().toggleClass("hidden","removeall"===e.val())})}function v(){if(S.showmonitor){var e=j("<div class='perf-monitor'/>"),t=S["jira.request.server.time"]>2e3,i=S.jiraSQLstatements>50;t&&e.addClass("tooslow"),i&&e.addClass("toomanysql"),j("#header-top").append(e),new y(e,"perf-monitor-dialog",function(e,t,i){var a="<div>Page render time <strong>"+S["jira.request.server.time"]+" ms</strong>";S.jiraSQLstatements?(a+=" / SQL <strong>"+S.jiraSQLstatements+"@"+S.jiraSQLtime+" ms</strong></br>",a+='<a target="_blank" href='+D+"/sqldata.jsp?requestId="+S["jira.request.id"]+">More...</a>"):a+=" / No SQL statments",a+="</div>",e.empty().append(a),i()})}}function b(){j(".clickable").click(function(){window.location.href=j(this).find("a").attr("href")})}function w(e){j(".projects-list-trigger",e).each(function(){var e=j(this);e.click(!1);var t=e.attr("href");new y(this,t.substring(1),function(e,i,a){e.html(j(t).html()),a()},{onHover:!0,hideDelay:500,width:240})})}function k(){Q.on("click","[data-helplink=local]",function(e){var t=this.getAttribute("href"),i=window.open(t,"jiraLocalHelp");return i&&i.focus(),e.preventDefault(),!1})}function C(){var e=function(e){return function(t){var i=j(t);e&&!i.is(e)||(i.tooltip(),t.jiraTooltipInitialized=!0)}},t=function(e){if(e.jiraTooltipInitialized){delete e.jiraTooltipInitialized;var t=j(e);t.tooltip&&t.tooltip("destroy")}};_("help-lnk",{type:_.type.CLASSNAME,attached:e("a[title]"),detached:t}),_("grouppicker-trigger",{type:_.type.CLASSNAME,attached:e("[title]"),detached:t}),_("popup-trigger",{type:_.type.CLASSNAME,attached:e("[title]"),detached:t})}var j=require("jquery"),S=require("aui/params"),y=require("aui/inline-dialog"),A=require("aui/tabs"),x=require("jira/toggleblock/toggle-block"),q=require("jira/ajs/browser/describe-browser"),E=require("jira/issue"),N=require("jira/message"),I=require("jira/data/cookie"),T=require("jira/util/forms"),L=require("jira/util/formatter"),R=require("jira/util/data/meta"),M=require("jira/util/events"),O=require("jira/util/navigator"),_=require("jira/skate"),W=require("jira/util/strings"),P=require("wrm/context-path"),D=P(),Q=j(document);_("shared-item-trigger",{type:_.type.CLASSNAME,attached:function(e){var t=e.getAttribute("href");new y(e,t.substring(1),function(e,i,a){e.html(j(t).html()),a()},{width:240})}}),j(function(){r(),e(),t(),i(),a(),o(),s(),l(),c(),d(),u(),f(),g(),h(),p(),m(),n(),v(),b(),k(),C(),w()}),q(),function(){M.bind("dialogContentReady",function(){A.setup()})}(),_("js-filter-form-edit",{type:_.type.CLASSNAME,extends:"form",events:{submit:function(e,t){if(!t.defaultPrevented){var i=W.escapeHtml(e.elements.filterName.value);N.showMsgOnReload(L.I18n.getText("editfilter.save.success",i),{type:"SUCCESS",closeable:!0,target:"body:not(:has(#edit-entity))"})}}}}),_("js-filter-form-subscription",{type:_.type.CLASSNAME,extends:"form",events:{submit:function(e,t){if(!t.defaultPrevented){var i=e.elements.groupName.value||R.get("remote-user-fullname");N.showMsgOnReload(L.I18n.getText("subscriptions.add.success",W.escapeHtml(i)),{type:"SUCCESS",closeable:!0,target:"body:not(:has(#filter-subscription))"})}}}})}();