define("jira/ajs/select/security/default-comment-security-level-control",["jira/util/formatter","jira/ajs/select/security/default-comment-security-level-model","jira/ajs/ajax/smart-ajax","jira/dialog/form-dialog","jira/lib/class","jquery","underscore","wrm/data"],function(e,t,n,i,l,a,o,s){"use strict";var r=s.claim("jira.core:default-comment-security-level-data.DefaultCommentSecurityLevelHelpLink");return l.extend({_InitialLoadDefaultLevelView:l.extend({init:function(e){this.$containerSpan=e},startLoading:function(){this.$containerSpan.html(JIRA.Templates.CommentSecurityLevel.initialLoadDefaultStart()),this.$containerSpan.find(".default-comment-level-spinner").spin({top:"0px",left:"0px"})},endLoading:function(){this.$containerSpan.find(".default-comment-level-load").addClass("hidden")}}),_SaveDefaultLevelControl:l.extend({init:function(e,t,n){this.$containerSpan=e,this.defaultLevelModel=t,this.currentSelection=n,this._putLinkToSetDefault(),this._putHelpLink()},_putLinkToSetDefault:function(){this.$containerSpan.append(JIRA.Templates.CommentSecurityLevel.linkToSetDefault()),this.$containerSpan.find(".default-comment-level-switch").bind("click",function(e){e.preventDefault(),this._onUpdateBegin(),this.defaultLevelModel.updateDefault(this.currentSelection,this._onUpdateSuccess.bind(this),this._onUpdateFail.bind(this))}.bind(this))},_putHelpLink:function(){this.$containerSpan.append(JIRA.Templates.Links.helpLink(r));var t=this.$containerSpan.find(".default-comment-level-help");t.attr("title",e.I18n.getText("security.level.default.set.current.tooltip")),t.tooltip({trigger:"hover",gravity:"nw",fade:!1})},_putStatusSpan:function(e){this.$containerSpan.html(JIRA.Templates.CommentSecurityLevel.defaultLevelStatus(e));var t=this.$containerSpan.find(".default-comment-level-status");t.attr("status",e.status),setTimeout(function(){t.addClass("fade-out")},2e3)},_onUpdateBegin:function(){this.$containerSpan.find(".default-comment-level-switch").addClass("disabled-link"),0===this.$containerSpan.find(".default-comment-level-spinner").length&&(this.$containerSpan.prepend(JIRA.Templates.CommentSecurityLevel.defaultLevelSpinner()),this.$containerSpan.find(".default-comment-level-spinner").spin())},_onUpdateSuccess:function(){this._putStatusSpan({text:e.I18n.getText("common.words.done"),status:"success",span_classes:"",icon_classes:"aui-icon aui-icon-small aui-iconfont-approve",text_classes:"default-saved-message"})},_onUpdateFail:function(e){new i({content:n.buildDialogErrorContent(e)}).show(),this.$containerSpan.find(".default-comment-level-spinner").remove(),this.$containerSpan.find(".default-comment-level-switch").removeClass("disabled-link")}}),enabled:!0,projectId:null,$rootSpan:null,$errorSpan:null,selectionSpi:null,defaultLevelModel:null,init:function(e,n,i){if(this.$rootSpan=e,this.$errorSpan=n,this.projectId=e.data("project-id"),!o.isNumber(this.projectId))return void(this.enabled=!1);this.selChanged=!1,this.selectionSpi=i,this.defaultLevelModel=new t(this.projectId)},selectionChanged:function(){this.selChanged=!0},loadAndApplyDefault:function(t){t&&this.selectionSpi.selectUnavailble(e.I18n.getText("common.words.unknown"));var l=this._createContainer(),a=new this._InitialLoadDefaultLevelView(l);a.startLoading(),this.defaultLevelModel.getDefault(function(e){t?this.selChanged||this._applyDefaultToSelection(e):this.selectionSpi.repickSelection(),a.endLoading()}.bind(this),function(e){new i({content:n.buildDialogErrorContent(e)}).show(),a.endLoading()}.bind(this))},flushViewWithNewControl:function(e){var t=this.defaultLevelModel.getCurrentDefault();if(t&&e.value()!==t.level&&"none"!==e.value()){var n=this._createContainer(),i=new this.defaultLevelModel.LvlObj(e.value(),e.label());new this._SaveDefaultLevelControl(n,this.defaultLevelModel,i)}else this.$rootSpan.empty();this.$errorSpan.empty()},_applyDefaultToSelection:function(e){if(this.selectionSpi.hasSecurityLevel(e.level)){this.selectionSpi.selectLevel(e.level);var t=this.selectionSpi.getSelectedLevelName();t!==e.levelName&&(e.levelName=t,this.defaultLevelModel.updateDefault(e,function(){},function(){}))}else this.selectionSpi.selectUnavailble(e.levelName),this.$errorSpan.html(JIRA.Templates.CommentSecurityLevel.unavailable({name:e.levelName}))},_createContainer:function(){var e=a(JIRA.Templates.CommentSecurityLevel.defaultLevelContainer());return this.$rootSpan.html(e),e}})});