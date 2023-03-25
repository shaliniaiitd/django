define("jira/util/strings",["exports"],function(n){"use strict";var t=AJS.escapeHtml,r=function(n){return"string"==typeof n||n instanceof String},e=function(n){return!r(n)||0===n.length};n.asBooleanOrString=function(n){var t=n?n.toLowerCase():"",r=n;return"true"===t?r=!0:"false"===t&&(r=!1),r},n.startsWith=function(n,t){return!e(n)&&(!e(t)&&0===n.indexOf(t))},n.endsWith=function(n,t){return!e(n)&&(!e(t)&&n.indexOf(t)+t.length===n.length)},n.substringAfter=function(n,t){if(e(n))return n;if(e(t))return"";var r=n.indexOf(t);return r<0?"":n.substring(r+t.length)},n.substringBefore=function(n,t){if(e(n))return n;if(e(t))return"";var r=n.indexOf(t);return r<0?"":n.substring(0,r)},n.contains=function(n,t){return!e(n)&&n.indexOf(t)>=0},n.repeat=function(n,t){return e(n)?"":new Array(t+1).join(n)},n.length=function(n){return e(n)?0:n.length},n.replace=function(n,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"";if(e(n))return"";if(e(t))return"";for(var i=0,u=n.indexOf(t);u>=0;){n=n.substring(0,u)+r+n.substring(u+t.length),i=u+r.length,u=n.indexOf(t,i)}return n.substring(u,n.length)},n.hashCode=function(n){var t=void 0,r=0;if(!n)return"";for(var e=0;e<n.length;e+=1)t=n.charCodeAt(e),r=31*r+t,r|=0;return""+r},n.escapeHtml=t,n.toSentenceCase=function(n){return n?(n+="",n.charAt(0).toUpperCase()+n.substring(1)):""}});