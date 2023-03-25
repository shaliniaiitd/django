define("jira/jquery/plugins/isdirty",["jira/util/logger","jira/util/formatter","jira/util/events","jira/util/browser","jquery"],function(e,r,n,t,i){function a(){var e=h;return h=g,"***\n\n"+e+"\n\n***"}function o(e){var r=i(e),n=i(e.form),t=e.type;if(n.hasClass(u)||r.hasClass(u))return!1;if(n.hasClass(f))return!0;if(r.is(":hidden")&&!r.hasClass(l))return!1;if(!r.parent().length)return!1;if(n.has(".error, .errMsg, .errorMessage, .errLabel, .ajaxerror").length>0||n.prev(".error").length>0||n.children(".error").length>0)return!0;if(("hidden"===t||"submit"===t||"button"===t)&&!r.hasClass(l))return!1;if("select-one"===t||"select-multiple"===t){for(var a=e.options,o=0;o<a.length;o++){var s=a[o];if(s.selected!==s.defaultSelected)return!0}return!1}return"checkbox"===t||"radio"===t?e.checked!==e.defaultChecked:e.value!==e.defaultValue}function s(){e.log("the cancel event on forms is deprecated"),i(this.form||this).closest("form").trigger("cancel")}var u="ajs-dirty-warning-exempt",l="ajs-dirty-warning-whitelist",f="ajs-dirty-warning-by-default",d="ajs-dirty-warning-subsequent-submits-allowed",c=!1,g=r.I18n.getText("common.forms.dirty.message"),h=g;i.fn.isDirty=function(){for(var e=this.find("*").andSelf().filter(":input"),r=0;r<e.length;r++)if(o(e[r]))return!0;return!1},i.fn.removeDirtyWarning=function(){return i(this.form||this).closest("form").addClass(u),this},n.bind("page-unload.location-change.from-dialog",function(){window.onbeforeunload=function(){}}),n.bind("page-unload.refresh.from-dialog",function(){h=r.I18n.getText("common.forms.dirty.message.from.dialog")});var m={getInputsToCheck:function(){return i("input[type='text'], textarea[name], ."+l)},getDirtyWarning:function(){for(var e=m.getInputsToCheck(),r=0,n=e.size();r<n;r++)if(!c&&o(e[r]))return a();c&&(c=!1)},ClassNames:{SANCTIONED:l,EXEMPT:u,BY_DEFAULT:f,SUBSEQUENT_SUBMITS_ALLOWED:d}};return t.isSelenium()||(window.onbeforeunload=m.getDirtyWarning),i(document).delegate("form","submit",function(){var e=i(this);(function(e){return e.parents(".jira-dialog.jira-dialog-open, .jira-dialog2.jira-dialog-open").length<=0})(e)&&!function(e){return e.hasClass(d)}(e)&&(c=!0)}),i(function(){i(".cancel").bind("click",s)}),i(function(){i("#cancelButton").bind("mousedown keydown click",s)}),m}),AJS.namespace("JIRA.DirtyForm",null,require("jira/jquery/plugins/isdirty"));