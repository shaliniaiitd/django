AJS.test.require(["jira.webresources:dialogs"],function(){"use strict";require(["jira/dialog/error-dialog","jira/util/browser","jquery","underscore"],function(e,r,i,s){var o=function(){};s.extend(o.prototype,{isVisible:function(){return this.el().is(":visible")},message:function(){return i.trim(this.el().find(".aui-message").text())},refresh:function(){var e=this.el().find(".error-dialog-refresh");if(!e.length)throw"Could not find refresh button.";e.click()},el:function(){return i("#error-dialog")},mode:function(){var e=this.el().find(".aui-message");if(e.length){if(e.hasClass("aui-message-warning"))return"warning";if(e.hasClass("aui-message-info"))return"info";if(e.hasClass("aui-message-error"))return"error"}return null}}),module("JIRA.ErrorDialog",{setup:function(){this.driver=new o,this.sandbox=sinon.sandbox.create()},teardown:function(){this.sandbox.restore()}});var a=function(r,i){var s={message:i};r&&(s.mode=r);var o=new e(s);o.show(),equal(this.driver.message(),i,"Dialog displaying correct error message."),equal(this.driver.mode(),r||"error","Dialog displaying in correct mode."),o.hide()};test("Dialog displays correct error message when no mode passed.",function(){a.call(this,null,"Error")}),test("Dialog displays correct message in info mode",function(){a.call(this,"info","Info")}),test("Dialog displays correct message in warning mode",function(){a.call(this,"warning","Warning")}),test("Dialog displays correct message in error mode",function(){a.call(this,"warning","Error")}),test("Dialog displays correct message for bad mode",function(){var r=new e({message:"Message",mode:"badMode"});r.show(),equal(this.driver.message(),"Message","Dialog displaying correct error message."),equal(this.driver.mode(),"error","Dialog displaying in correct mode."),r.hide()}),test("Dialog hide/show.",function(){var r=new e({message:"Error"});ok(!this.driver.isVisible(),"Dialog should be hidden by default."),r.show(),ok(this.driver.isVisible(),"Dialog should now be visible."),r.hide(),ok(!this.driver.isVisible(),"Dialog should be hidden again.")}),test("openErrorDialogForXHR displays error dialog.",function(){var r=e.openErrorDialogForXHR({status:401,responseText:JSON.stringify({errorMessages:["abc"]})});r.show(),equal(this.driver.message(),"abc","Dialog displaying correct error message."),r.hide()}),test("refresh does page reload.",function(){var i=this.sandbox.stub(r,"reloadViaWindowLocation"),s=e.openErrorDialogForXHR({status:401,responseText:JSON.stringify({errorMessages:["abc"]})}).show();this.driver.refresh(),ok(i.calledOnce,"Refresh does a page pop."),s.hide()})})});