define("jira/ajs/dropdown/dropdown-factory",["jira/ajs/dropdown/dropdown","jira/util/objects","jquery"],function(e,t,r){"use strict";function n(n){var o=[];if(n.content&&!n.trigger)n.content=r(n.content),r.each(n.content,function(){var c=t.copyObject(n);c.content=r(this),o.push(new e(c))});else if(!n.content&&n.trigger)n.trigger=r(n.trigger),r.each(n.trigger,function(){var c=t.copyObject(n);c.trigger=r(this),o.push(new e(c))});else if(n.content&&n.trigger){if(n.content=r(n.content),n.trigger=r(n.trigger),n.content.length!==n.trigger.length)throw new Error("Dropdown.create: Expected the same number of content elements as trigger elements");n.trigger.each(function(c){var i=t.copyObject(n);i.trigger=r(this),i.content=n.content.eq(c),o.push(new e(i))})}return o}return{createDropdown:n}}),AJS.namespace("AJS.Dropdown.create",null,require("jira/ajs/dropdown/dropdown-factory").createDropdown);