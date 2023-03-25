define("jira/customfields/customfieldsSelectLastValueUpdateCollection",["jira/backbone-1.3.3","jira/moment","jira/util/formatter"],function(e,a,t){"use strict";return e.Collection.extend({name:"lastValueUpdate",id:"lastValueUpdate",initialize:function(){this.add([{name:t.I18n.getText("admin.issuefields.last.value.update.options.all")},{name:t.I18n.getText("admin.issuefields.last.value.update.options.never"),value:-1},{name:t.I18n.getText("admin.issuefields.last.value.update.options.6months"),value:a().subtract(6,"months").endOf("day").valueOf()},{name:t.I18n.getText("admin.issuefields.last.value.update.options.1year"),value:a().subtract(1,"year").endOf("day").valueOf()},{name:t.I18n.getText("admin.issuefields.last.value.update.options.2years"),value:a().subtract(2,"years").endOf("day").valueOf()},{name:"calendar-input",label:t.I18n.getText("admin.issuefields.last.value.update.options.custom"),type:"CALENDAR",value:null}])}})});