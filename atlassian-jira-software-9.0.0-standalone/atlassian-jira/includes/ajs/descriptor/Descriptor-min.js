define("jira/ajs/descriptor",["jira/lib/class","jquery"],function(e,t){"use strict";return e.extend({init:function(e){this._validate(e)&&(this.properties=t.extend(this._getDefaultOptions(),e))},allProperties:function(){return this.properties},_validate:function(e){return this.REQUIRED_PROPERTIES&&t.each(this.REQUIRED_PROPERTIES,function(t){if(void 0===e[t])throw new Error("AJS.Descriptor: expected property ["+t+"] but was undefined")}),!0}})}),AJS.namespace("AJS.Descriptor",null,require("jira/ajs/descriptor"));