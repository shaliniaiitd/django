define("jira/dropdown/element/default-dropdown",["jira/util/logger","jira/ajs/layer/layer-constants","jira/ajs/dropdown/dropdown","jira/skate","jquery"],function(t,n,a,e,o){"use strict";return e("js-default-dropdown",{type:e.type.CLASSNAME,created:function(){},attached:function(e){var r=o(e),i=r.next(".aui-list"),d=r.attr("data-alignment")||n.RIGHT,l=!!r.data("hasDropdown");0===i.length&&t.warn("Dropdown init failed. Could not find content. Printing culprit...",e),l||(r.data("hasDropdown",!0),new a({trigger:r,content:i,alignment:d,setMaxHeightToWindow:r.attr("data-contain-to-window"),hideOnScroll:r.attr("data-hide-on-scroll")||".issue-container"}))}})});