require(["jira/urlParamFlag","jira/util/init-on-dcl","jira/util/formatter"],function(e,t,n){"use strict";var a=e.MessageType;t(function(){new e(location.href,[{parameterName:"deletedContext",getMessage:function(e){return n.I18n.getText("admin.issuefields.config.context.deleted.flag",e,"<strong>","</strong>")}},{parameterName:"updatedContext",getMessage:function(e){return n.I18n.getText("admin.issuefields.config.context.updated.flag",e,"<strong>","</strong>")}},{parameterName:"createdContext",getMessage:function(e){return n.I18n.getText("admin.issuefields.config.context.created.flag",e,"<strong>","</strong>")},type:a.SUCCESS}]).show()})});