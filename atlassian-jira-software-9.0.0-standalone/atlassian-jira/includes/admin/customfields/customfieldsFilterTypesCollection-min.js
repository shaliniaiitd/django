define("jira/customfields/customfieldsFilterTypesCollection",["jira/backbone-1.3.3","wrm/context-path"],function(e,t){"use strict";return e.Collection.extend({url:t()+"/rest/globalconfig/1/customfieldtypes",id:"types",name:"types",parse:function(e){var t=e.types;return(void 0===t?[]:t).map(function(e){return{id:e.key,name:e.name,description:e.description}})}})});