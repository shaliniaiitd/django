define("jira/share/controllers/edit-shares-controller",["jira/share/i18n","jira/util/formatter","jira/jquery/plugins/isdirty","jira/share/controllers/edit-shares-model","jquery"],function(e,i,t,s,r){"use strict";function n(e,i,t){this.findDuplicatesInOtherModes=i,this.preventSave=t,this.view=new s(e),this.shares=[],this.mode=e,this.shareTypes={},this.singleton=!1,this.selectedShareTypeChanged=!1,this.defaultShareType=null}var a=i.I18n.getText("common.sharing.with.anyone.security.warning.title");return n.prototype={registerShareType:function(e){e&&e.type&&(this.shareTypes[String(e.type)]=e)},initialise:function(){this.view.initialise(),this.initShares(),this.view.recalculateHiddenValue(this.shares),this.defaultShareType=this.view.setupDefaultShareType();var e=this.shareTypes[this.defaultShareType];this.view.setWarning(e.getDisplayWarning(),a),this.initEvents()},initShares:function(){var e=this,i=this;for(var t in this.shareTypes)if(Object.prototype.hasOwnProperty.call(this.shareTypes,t)){var s=this.shareTypes[t];r("#share_add_"+s.type+"_"+this.mode).click(function(e){return function(t){i.addShareCallback(t,e)}}(s)),s.initialise&&s.initialise()}var n=void 0,a=this.view.getModeElementById("shares_data");try{n=JSON.parse(a.firstChild.nodeValue),n instanceof Array||(n=[])}catch(e){n=[]}n="viewers"===this.mode?n.filter(function(e){return 1===e.rights.value}):n.filter(function(e){return 3===e.rights.value}),n.forEach(function(i){if(void 0!==i.type){var t=e.shareTypes[i.type];if(t){var s=t.getDisplayFromPermission(i);s&&e.addShare(s)}}}),0===this.shares.length&&this.view.displayEmptySharesTemplate()},initEvents:function(){var e=this;this.view.getShareTypeSelector().change(function(i){e.selectShareTypeCallback(i)});var i=this.view.getModeElementById("share_type_hidden");i.defaultValue=i.value,r(i).addClass(t.ClassNames.SANCTIONED),this.view.getSubmitButton()&&(this.view.getSubmitButton().click(function(i){e.saveCallback(i)}),this.view.getForm().on("submit",function(){e.view.onFilterEdit(i)}))},addShare:function(e){if(e){var i=this.findShareIndex(e.permission);if(i>=0)return void this.animateShare(i);if(!this.findDuplicatesInOtherModes(e.permission,this.mode)){var t=this.getNewContainer(e);if(t){var s=this.view.addDisplay(e,t,this.removeCallback.bind(this));this.singleton=e.singleton,this.shares.push({id:s,permission:e.permission}),this.view.recalculateHiddenValue(this.shares)}}}},getNewContainer:function(i){if(i.singleton){if(0!==this.shares.length){var t=e.getMessage("common.sharing.remove.shares.public");"loggedin"===i&&(t=e.getMessage("common.sharing.remove.shares.authenticated"));if(!confirm(t))return}return this.getClearedContainer()}if(!this.singleton)return 0===this.shares.length?this.getClearedContainer():document.createElement("div");if(this.shares[0]&&this.shares[0].permission){var s="loggedin"===this.shares[0].permission.type?"common.sharing.remove.singleton.loggedin":"common.sharing.remove.singleton.public";return confirm(e.getMessage(s))?this.getClearedContainer():void 0}},getClearedContainer:function(){for(var e=this.clearShares()||document.createElement("div");e&&e.firstChild;)e.removeChild(e.firstChild);return e},findShareIndex:function(e){var i=this.shares.find(function(i){return e.equals(i.permission)});return i?i.id:-1},selectShareTypeCallback:function(){var e=this.view.getSelectedType(),i=this.shareTypes[e];this.view.setWarning(i.getDisplayWarning(),a),this.selectedShareTypeChanged=!0},saveCallback:function(e){if(!this.preventSave()){var i=this.getCurrentShareType();this.anyChangesExist(i)&&this.findCurrentlySelectedShare()<0&&this.confirmSave(e)}},confirmSave:function(e){confirm(this.getMessage())||e.preventDefault(),"viewers"===this.mode&&this.preventSave(!0)},anyChangesExist:function(e){return!!this.selectedShareTypeChanged||e.type===this.defaultShareType&&e.inputChangesExist()},getMessage:function(){return e.getMessage("common.sharing.dirty.warning")},addShareCallback:function(e,i){this.addShare(i.getDisplayFromUI())},removeCallback:function(e,i){this.remove(i)},remove:function(e){this.findCurrentlySelectedShare()===e&&(this.defaultShareType=this.getCurrentShareType().type,this.selectedShareTypeChanged=!1,this.getCurrentShareType().dirty=!1),this.shares=this.shares.filter(function(i){return i.id!==e}),this.view.remove(e,this.shares.length),this.view.recalculateHiddenValue(this.shares)},findCurrentlySelectedShare:function(){var e=this.getCurrentShareType().getDisplayFromUI(!0);if(e&&e.permission)return this.findShareIndex(e.permission)},clearShares:function(){return this.shares=[],this.view.clearDiv()},animateShare:function(e){this.view.animateShare(e)},getCurrentShareType:function(){var e=this.view.getSelectList();return e?this.shareTypes[e.options[e.selectedIndex].value]:null}},n});