AJS.test.require("jira.webresources:projectpermissions",function(){"use strict";function e(e,i,t){return{displayName:e,securityType:i,values:t}}function i(e){e.prop("checked",!0),e.change()}function t(e){e.prop("checked",!1),e.change()}var s=require("jquery"),a=require("jira/util/formatter"),o=require("jira/project/permissions/deletepermissionview"),l=require("jira/project/permissions/securitytypes"),n=require("jira/project/permissions/permissionmodel"),d=e("Group",l.GROUP,[{id:1,displayValue:"Administrators"}]),r=e("Group",l.GROUP,[{id:2}]),u=e("Application Role",l.APPLICATION_ROLE,[{id:3}]);module("projectpermissions/delete-permission-view",{setup:function(){this.sandbox=sinon.sandbox.create({useFakeServer:!0}),this.$el=s("#qunit-fixture"),this.$el.html(JIRA.Templates.ProjectPermissions.deleteDialog({permissionName:"testPermissions"})),this.model=new n({}),this.view=new o({el:this.$el.find("#delete-permission-dialog"),model:this.model}),this.view.open()},teardown:function(){this.view.close(),this.sandbox.restore()}}),test("Should display correct empty value for application role with no display value",function(){this.model.set("grants",[u]),strictEqual(this.view.$el.find("label").text(),u.displayName+" - "+a.I18n.getText("admin.permission.types.application.role.any"),"Should display provided empty value for application role with no displayValue")}),test("Should display correct empty value for group with no display value",function(){this.model.set("grants",[r]),strictEqual(this.view.$el.find("label").text(),r.displayName+" - "+a.I18n.getText("admin.common.words.anyone"),"Should display provided empty value for group with no displayValue")}),test("Should render grant with provided displayValue",function(){this.model.set("grants",[d]),strictEqual(this.view.$el.find("label").text(),d.displayName+" - "+d.values[0].displayValue,"Should display provided displayValue")}),test("Should enable submit if a grant is checked",function(){this.model.set("grants",[d,u]),i(this.view.$el.find("[name=deleteGrant]")),ok(this.view.canSubmit(),"View model should mark it as being able to be submitted"),strictEqual(this.view.$el.find("#dialog-save-button").attr("aria-disabled"),"false","Should be disabled as unchecked")}),test("Should disable submit if no grant is checked",function(){this.model.set("grants",[d,u]),t(this.$el.find("[name=deleteGrant]")),ok(!this.view.canSubmit(),"View model should mark it as being able to be submitted"),strictEqual(this.view.$el.find("#dialog-save-button").attr("aria-disabled"),"true","Should be disabled as unchecked")}),test("Should disable submit originally if more than one permission to remove",function(){this.model.set("grants",[d,u]),this.view.render(),ok(!this.view.canSubmit(),"As multiple grants none should be checked and therefore the submit should be disabled")}),test("Should enable submit if one grant as it will be checked originally ",function(){this.model.set("grants",[d]),ok(this.view.canSubmit(),"As only one grant it should originally be checked and submittable")}),test("Should enable submit if multiple grants and one selected",function(){this.model.set("grants",[d,u]),ok(!this.view.canSubmit(),"As no grants are checked it should be disabled"),i(this.view.$el.find("[name=deleteGrant]").first()),ok(this.view.canSubmit(),"One grants is checked so it should be enabled")}),test("Ensure form controls are correctly enabled/disabled when form is submitted",function(){this.model.set("grants",[u]);var e=this.view.$el.find(".js-delete-grant");strictEqual(e.attr("aria-disabled"),void 0,"checkbox to select permission should not be aria-disabled"),strictEqual(e.attr("disabled"),void 0,"checkbox to select permission should not be disabled"),this.view.submit(),strictEqual(e.attr("aria-disabled"),"true","checkbox to select permission should not be aria-disabled"),strictEqual(e.attr("disabled"),"disabled","checkbox to select permission should not be disabled")})});