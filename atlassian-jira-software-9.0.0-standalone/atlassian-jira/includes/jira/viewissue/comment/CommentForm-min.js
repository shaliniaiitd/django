define("jira/viewissue/comment/comment-form",["jira/util/formatter","jira/util/events","jira/util/events/types","jquery"],function(t,e,i,n){"use strict";var o={setCaretAtEndOfCommentField:function(){var t,e=this.getField(),i=e[0];e.length&&(t=e.val().length,e.scrollTop(e.attr("scrollHeight")),i.setSelectionRange&&t>0&&i.setSelectionRange(t,t))},isDirty:function(){var t=this.getField();return!!t.length&&t[0].value!==t[0].defaultValue},handleBrowseAway:function(){if(o.isDirty()){var e=o.getForm();return e.length&&e.is(":visible")?t.I18n.getText("common.forms.dirty.comment"):void 0}},setSubmitState:function(){n.trim(this.getField().val()).length>0&&this.isVisibilityAvailble()?this.getForm().find("#issue-comment-add-submit").removeAttr("disabled"):this.getForm().find("#issue-comment-add-submit").attr("disabled","disabled")},getForm:function(){var t=n("form#issue-comment-add");return 1===t.length&&(this.$form=t),this.$form||n()},getField:function(){return this.getForm().find("#comment")},getSubmitButton:function(){return this.getForm().find("#issue-comment-add-submit")},show:function(){this.focus(),i.LOCK_PANEL_REFRESHING&&e.trigger(i.LOCK_PANEL_REFRESHING,["addcommentmodule"])},focus:function(){this.focusField(),this.setCaretAtEndOfCommentField()},focusField:function(){this.getField().focus().trigger("keyup"),this.getSubmitButton().scrollIntoView({marginBottom:200})}};return o}),define("jira/viewissue/comment/footer-comment",["jira/viewissue/comment/comment-form","jquery"],function(t,e){"use strict";return{getModule:function(){return e("#addcomment")},isActive:function(){return this.getModule().hasClass("active")},show:function(){this.isActive()?t.focusField():(this.getModule().addClass("active"),this.appendForm(),t.show())},appendForm:function(){this.getModule().find(".mod-content").append(t.getForm())}}});