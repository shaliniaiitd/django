define("jira/mention/mention",["jira/util/key-code","jira/ajs/control","jira/dialog/dialog-stack","jira/mention/mention-user","jira/mention/mention-group","jira/mention/mention-matcher","jira/mention/scroll-pusher","jira/mention/contextual-mention-analytics-event","jira/mention/uncomplicated-inline-layer","jira/ajs/layer/inline-layer/standard-positioning","jira/ajs/dropdown/dropdown-list-item","jira/util/events","aui/progressive-data-set","jquery","underscore","wrm/context-path","jira/util/logger"],function(e,t,n,r,i,s,a,o,u,l,c,h,d,m,f,g,p){"use strict";function v(e,t){var n,r="";return e&&(n=e instanceof m?e.get(0):e,r=n.querySelector("a").getAttribute(t)),r}function y(e){return v(e,"rel")}function C(){return x}function _(e,t){var n=S(e.get("highestIssueInvolvementRank"),t.get("highestIssueInvolvementRank"),function(e,t){return e-t});return 0===n&&0===(n=S(e.get("latestCommentCreationTime"),t.get("latestCommentCreationTime"),function(e,t){return t-e}))&&(n=e.get("displayName").localeCompare(t.get("displayName"))),n}function S(e,t,n){return void 0!==e?void 0!==t?n(e,t):-1:void 0!==t?1:0}function w(e){return!!e}function E(e){var t={model:r,comparator:_};return w(e)?(t.queryEndpoint=g()+"/rest/internal/2/user/mention/search",t.queryParamKey="query"):(t.queryEndpoint=g()+"/rest/api/2/user/viewissue/search",t.queryParamKey="username"),t}var x=!1,I={};return t.extend({CLASS_SIGNATURE:"AJS_MENTION",lastInvalidUsername:"",lastRequestMatch:!0,lastValidUsername:"",init:function(e){var t=E(e);this.listController=new i,this.isRolesEnabled=w(e),this.dataSource=new d([],f.extend({queryData:this._getQueryParams.bind(this),matcher:function(){return!1}},t)),this.dataSource.shouldGetMoreResults=function(){return!0},this.fetchUserNames=f.debounce(this.dataSource.query,175),this.dataSource.bind("respond",function(e){var t=this,n=e.query;if(n&&C()){var r=this.dataSource.findQueryCache(n)||[],i=r.slice(0,5).filter(function(e){return e}).map(function(e){return t.dataSource.findWhere({name:e})});i.length?(this.lastInvalidUsername="",this.lastValidUsername=n,this.lastRequestMatch=!0):((!this.lastInvalidUsername||n.length<=this.lastInvalidUsername.length)&&(this.lastInvalidUsername=n),this.lastRequestMatch=!1);var s=this.generateSuggestions(i,n);this.updateSuggestions(s),p.trace("mention.suggestions.updated")}}.bind(this)),this.dataSource.bind("activity",function(e){e.activity?this.layerController._showLoading():this.layerController._hideLoading()}.bind(this))},updateSuggestions:function(e){this.layerController&&(this.layerController.content(e),this.layerController.show(),this.layerController.refreshContent())},_getQueryParams:function(){return this.restParams},_setQueryParams:function(){var e={issueKey:this.$textarea.attr("data-issuekey"),projectKey:this.$textarea.attr("data-projectkey"),maxResults:5};n.current&&"create-issue-dialog"===n.current.options.id&&delete e.issueKey,this.restParams=e},_composeCustomEventForFollowScroll:function(e){e=e||{};var t=this.$textarea.attr("follow-scroll");return t&&t.length&&(e[t]={scroll:function(){this.setPosition()}}),e},_getOffsetTarget:function(){return this.textarea()},textarea:function(e){var t=this;if(!e)return this.$textarea;if(this.$textarea=m(e),m("#mentionDropDown").remove(),this.$textarea.attr("push-scroll"))var r=new l,i=a(this.$textarea,10);this.layerController=new u({offsetTarget:this._getOffsetTarget(),allowDownsize:!0,positioningController:r,customEvents:this._composeCustomEventForFollowScroll(),width:function(){return t.$textarea.width()}}),this.layerController.bind("showLayer",function(){t.listController.trigger("focus"),t._assignEvents("win",window)}).bind("hideLayer",function(){t.listController.trigger("blur"),t._unassignEvents("win",window),i&&i.reset()}).bind("contentChanged",function(){if(t.layerController.$content){var e,n=t.listController.index,r=t.listController.highlighted||t.listController.items[n],i=r?y(r.$element):"";t.listController.removeAllItems(),t.layerController.$content.off("click.jiraMentions"),t.layerController.$content.on("click.jiraMentions","li",function(e){var n=e.currentTarget;t._acceptSuggestion(n),e.preventDefault()}),t.layerController.$content.find("li").each(function(){var n=this,r=y(n),s=new c({element:n,autoScroll:!0});r===i&&(e=s),t.listController.addItem(s)}),t.listController.prepareForInput(),e?e.trigger("focus"):t.listController.shiftFocus(0)}}).bind("setLayerPosition",function(e,t,r){if(n.current&&n.current.$form){var s=n.current.$popup.find(".buttons-container:visible");s.length&&t.top>s.offset().top&&(t.top=s.offset().top)}t.left<0&&(t.left=0),t.left+r.layer().width()>m(window).width()&&(t.left=Math.max(m(window).width()-r.layer().width(),0)),i&&i.push(t.top+r.layer().outerHeight(!0))}),this.layerController.layer().attr("id","mentionDropDown"),this._assignEvents("inlineLayer",t.layerController.layer()),this._assignEvents("textarea",t.$textarea),this._setQueryParams(),this._seedData().then(function(e){var n=[];n.push.apply(n,e),t.dataSource.add(n)})},generateSuggestions:function(e,t,n){var r=function(e){var r={text:e};if(!n&&e&&e.length){var i=this._indexOfFirstMatch(e.toLowerCase(),t.toLowerCase());if(-1!==i){var s=i+t.length;r={prefix:e.substring(0,i),match:e.substring(i,s),suffix:e.substring(s)}}}return r}.bind(this),i=f.map(e,function(e){var t=e.toJSON();return t.username=t.name,t.displayName=r(t.displayName),t.name=r(t.name),t.iconType="rounded",t.issueRoles=f.map(t.roles,function(e){return r(e.label)}),t});return m(JIRA.Templates.mentionsSuggestions({suggestions:i,query:t,activity:this.dataSource.activeQueryCount>0,isRolesEnabled:this.isRolesEnabled}))},_indexOfFirstMatch:function(e,t){for(var n,r=/ |@|\.|-|"|,|'|\(/,i=0;-1!==n;){if(0===e.indexOf(t))return i;if(-1===(n=e.search(r)))return-1;i=i+n+1,e=e.substring(n+1)}},_seedData:function(){var e,t=this._getQueryParams().issueKey;return t?(I[t]||(I[t]=m.ajax({method:"GET",url:g()+"/rest/internal/2/user/mention/search",data:this._getQueryParams(),dataType:"json",contentType:"application/json; charset=UTF-8"})),e=I[t].promise()):e=(new m.Deferred).reject(),e},_acceptSuggestion:function(e){this._hide(),o.fireUserMayAcceptSuggestionByUsingContextualMentionEvent(this._getCurrentUserName()),this._replaceCurrentUserName(y(e),v(e,"data-displayname")),this.listController.removeAllItems(),x=!1},_replaceCurrentUserName:function(e){var t=this._rawInputValue(),n=this._getCaretPosition(),r=t.substr(0,n),i=s.getLastWordBoundaryIndex(r,!0),a=t.substr(0,i+1).replace(/\r\n/g,"\n"),o="[~"+e+"]",u=t.substr(n);this._rawInputValue([a,o,u].join("")),this._setCursorPosition(a.length+o.length)},_setCursorPosition:function(e){var t=this.$textarea.get(0);if(t.setSelectionRange)t.focus(),t.setSelectionRange(e,e);else if(t.createTextRange){var n=t.createTextRange();n.collapse(!0),n.moveEnd("character",e),n.moveStart("character",e),n.select()}},_getCaretPosition:function(){var e,t,n,r,i=this.$textarea.get(0),s=this._rawInputValue();return"number"==typeof i.selectionStart?i.selectionStart:document.selection&&i.createTextRange?(e=document.selection.createRange(),e?(r=i.createTextRange(),r.moveToBookmark(e.getBookmark()),r.compareEndPoints("StartToEnd",i.createTextRange())>=0?s.length:(n=s.replace(/\r\n/g,"\n"),t=r.moveStart("character",-s.length),n.slice(0,-t).split("\n").length-1-t)):s.length):0},_rawInputValue:function(){var e=this.$textarea.get(0);return"string"==typeof arguments[0]&&(e.value=arguments[0]),e.value},_getCurrentUserName:function(){return this.currentUserName},_hide:function(){this.layerController.hide()},_show:function(){this.layerController.show()},_keyUp:function(){var e=this._getCaretPosition(),t=this._getUserNameFromInput(e),n=m.trim(t||"");if(this._isNewRequestRequired(n))this.fetchUserNames(n),x=!0;else if(this._showHintSuggestions(t)){var r=this.dataSource.first(5),i=this.generateSuggestions(r,n,!0);this.updateSuggestions(i),x=!0}else this._keepSuggestWindowOpen(n)||(this._hide(),x=!1);this.lastQuery=n,delete this.willCheck},_showHintSuggestions:function(e){return"string"==typeof e&&0===e.length},_keepSuggestWindowOpen:function(e){return!!e&&(!!this.layerController.isVisible()&&(this.dataSource.activeQueryCount||this.lastRequestMatch))},_isNewRequestRequired:function(e){if(!e)return!1;if((e=m.trim(e))===this.lastQuery)return!1;if(this.lastInvalidUsername){if(0===e.indexOf(this.lastInvalidUsername)&&this.lastInvalidUsername.length<e.length)return!1}else if(!this.lastRequestMatch&&e===this.lastValidUsername)return!0;return!0},_getUserNameFromInput:function(e){return"number"!=typeof e&&(e=this._getCaretPosition()),this.currentUserName=s.getUserNameFromCurrentWord(this._rawInputValue(),e),this.currentUserName},_events:{win:{resize:function(){this.layerController.setWidth(this.$textarea.width())}},textarea:{keydown:function(t){t.keyCode===e.ESCAPE?this.layerController.isVisible()&&(n.current&&h.one("Dialog.beforeHide",function(e){e.preventDefault()}),this.$textarea.one("keyup",function(t){t.keyCode===e.ESCAPE&&(t.stopPropagation(),h.trigger("Mention.afterHide"))})):this.willCheck||(this.willCheck=f.defer(f.bind(this._keyUp,this)),f.defer(f.bind(function(){var e=this._getUserNameFromInput(this._getCaretPosition());o.fireContextualMentionIsBeingLookedUpAnalyticsEvent(e,t.keyCode,t.ctrlKey,t.metaKey)},this)))},focus:function(){this._keyUp()},mouseup:function(){this._keyUp()},blur:function(){this.listController.removeAllItems(),this.lastQuery=this.lastValidUsername=this.lastInvalidUsername=""}},inlineLayer:{mousedown:function(e){e.preventDefault()}}}})}),define("jira/mention/mention-user",["backbone","underscore"],function(e,t){"use strict";return e.Model.extend({idAttribute:"name",initialize:function(){this.on("change:issueInvolvements",function(e,n){var r=t.union(e.previous("issueInvolvements"),n);e.attributes.issueInvolvements=t.uniq(r,!1,function(e){return e.id})})},parse:function(e){return e.issueInvolvements||(e.issueInvolvements=[]),e},toJSON:function(){var e=t.clone(this.attributes);return e.roles=e.issueInvolvements,delete e.issueInvolvements,e}})}),define("jira/mention/mention-matcher",["jquery"],function(e){"use strict";return{AT_USERNAME_START_REGEX:/^@(.*)/i,AT_USERNAME_REGEX:/[^\[]@(.*)/i,WIKI_MARKUP_REGEX:/\[[~@]+([^~@]*)/i,ACCEPTED_USER_REGEX:/\[~[^~\]]*\]/i,WORD_LIMIT:3,getUserNameFromCurrentWord:function(t,n){var r,i=t.substr(0,n),s=this.getLastWordBoundaryIndex(i,!1),a=i.charAt(s-1),o=null;if(!a||!/\w/i.test(a)){if(r=this._removeAcceptedUsernames(i.substr(s)),/[\r\n]/.test(r))return null;e.each([this.AT_USERNAME_START_REGEX,this.AT_USERNAME_REGEX,this.WIKI_MARKUP_REGEX],function(e,t){var n=t.exec(r);if(n)return o=n[1],!1})}return null!=o&&this.lengthWithinLimit(o,this.WORD_LIMIT)?o:null},lengthWithinLimit:function(t,n){return e.trim(t).split(/\s+/).length<=~~n},getLastWordBoundaryIndex:function(e,t){var n=e.lastIndexOf("@"),r=e.lastIndexOf("[~");return t&&(n-=1,r-=1),n>r?n:r},_removeAcceptedUsernames:function(e){var t=this.ACCEPTED_USER_REGEX.exec(e);return t?e.split(t)[1]:e}}}),define("jira/mention/scroll-pusher",["jquery"],function(e){"use strict";return function(t,n){function r(e,t){void 0===t&&(t=n);var r=a.offset().top+a.outerHeight(),i=e-r;i+t>0&&(s||(s=a.height()),a.height(a.height()+i+t))}function i(){s&&a.height(s)}n=n||0;var s,a=e(t.attr("push-scroll"));return{push:r,reset:i}}}),define("jira/mention/contextual-mention-analytics-event",["jira/util/key-code","jira/analytics","underscore"],function(e,t,n){"use strict";var r=function(t){return t===e.BACKSPACE},i=function(e,t,n){return e==="A".charCodeAt()&&(t||n)||t||n},s=/^(assi(gnee?)|repo(rter?))$/,a=n.debounce(function(e,n,a,o){var u=r(n)||i(n,a,o),l=s.test(e);!1===u&&l&&t.send({name:"issue.comment.contextualMention.lookup"})},500);return{fireAcceptedContextualMentionAnalyticsEvent:function(){t.send({name:"issue.comment.contextualMention.accepted"})},fireContextualMentionIsBeingLookedUpAnalyticsEvent:function(e,t,n,r){a(e,t,n,r)},fireUserMayAcceptSuggestionByUsingContextualMentionEvent:function(e){n.any(["assignee","reporter"],function(n){if(0===n.indexOf(e)&&n!==e)return t.send({name:"issue.comment.contextualMention.mayAccepted"}),!0})}}}),AJS.namespace("JIRA.MentionUserModel",null,require("jira/mention/mention-user")),AJS.namespace("JIRA.Mention",null,require("jira/mention/mention")),AJS.namespace("JIRA.Mention.Matcher",null,require("jira/mention/mention-matcher")),AJS.namespace("JIRA.Mention.ScrollPusher",null,require("jira/mention/scroll-pusher")),AJS.namespace("JIRA.Mention.ContextualMentionAnalyticsEvent",null,require("jira/mention/contextual-mention-analytics-event"));