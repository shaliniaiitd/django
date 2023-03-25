define("jira/ajs/layer/inline-layer/options-descriptor",["jira/ajs/layer/layer-constants","jira/ajs/descriptor","jira/ajs/contentretriever/ajax-content-retriever","jira/ajs/contentretriever/deferred-content-retriever","jira/ajs/contentretriever/dom-content-retriever","jira/ajs/layer/inline-layer/iframe-positioning","jira/ajs/layer/inline-layer/window-positioning","jira/ajs/layer/inline-layer/standard-positioning","aui/params","jquery"],function(t,e,i,r,n,o,s,p,a,h){"use strict";return e.extend({init:function(t){if(this._super(t),!this.contentRetriever())if(this.ajaxOptions())this.contentRetriever(new i(this.ajaxOptions()));else if(h.isFunction(this.content()))this.contentRetriever(new r(this.content()));else{if(!this.content())throw new Error("InlineLayer.OptionsDescriptor: Expected either [ajaxOptions] or [contentRetriever] or [content] to be defined");this.contentRetriever(new n(this.content()))}if(!this.positioningController())if(!a.ignoreFrame&&this._inIFrame())this.positioningController(new o);else{var e=h("body"),c="hidden"===e.css("overflow")||"hidden"===e.css("overflowY");c?this.positioningController(new s):this.positioningController(new p)}!this.offsetTarget()&&this.content()instanceof h&&this.offsetTarget(this.content().prev())},_inIFrame:function(){var t=window;try{for(;t.parent.window!==t.window;)if(t=t.parent,t.AJS)return!0}catch(t){}return!1},_getDefaultOptions:function(){return{alignment:t.INTELLIGENT_GUESS,hideOnScroll:".form-body",cushion:20,width:200}},positioningController:function(t){if(!t)return this.properties.positioningController;this.properties.positioningController=t},ajaxOptions:function(t){if(!t)return this.properties.ajaxOptions;this.properties.ajaxOptions=t},content:function(t){if(t)t=h(t),t.length&&(this.properties.content=t);else if(this.properties.content&&(this.properties.content.length||h.isFunction(this.properties.content)))return this.properties.content},contentRetriever:function(t){if(!t)return this.properties.contentRetriever;this.properties.contentRetriever=t},offsetTarget:function(t){if(t)t=h(t),t.length&&(this.properties.offsetTarget=t);else if(this.properties.offsetTarget&&(this.properties.offsetTarget.length||h.isFunction(this.properties.offsetTarget)))return this.properties.offsetTarget},cushion:function(t){if(!t)return this.properties.cushion;this.properties.cushion=t},styleClass:function(t){if(!t)return this.properties.styleClass;this.properties.styleClass=t},hideOnScroll:function(t){if(!t)return this.properties.hideOnScroll;this.properties.hideOnScroll=t},alignment:function(t){if(!t)return this.properties.alignment;this.properties.alignment=t},width:function(t){if(!t)return h.isFunction(this.properties.width)?this.properties.width.call(this):this.properties.width;this.properties.width=t},allowDownsize:function(t){if(!t)return this.properties.allowDownsize;this.properties.allowDownsize=t},customEvents:function(t){if(!t)return this.properties.customEvents;this.properties.customEvents=t}})});