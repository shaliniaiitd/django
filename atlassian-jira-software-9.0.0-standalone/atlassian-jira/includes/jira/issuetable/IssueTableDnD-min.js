define("jira/issuetable/dnd",["jquery","backbone","jira/featureflags/feature-manager","jira/deprecator","underscore"],function(e,t,n,a,r){"use strict";var i=function(t){return{enable:function(){if(n.isFeatureEnabled("com.atlassian.jira.issuetable.draggable")){var a={original:-1,current:-1};e(t.element).children("tbody").sortable("destroy");var r=e(t.element).find("tbody");void 0!==r.sortable("instance")&&r.sortable("destroy"),r.sortable({items:"> tr",appendTo:"parent",helper:"clone",start:function(e,n){var r=n.item[0];a.original=t.idx(r),t.trigger(t.Events.ROW_DRAG_STARTED,{row:r,position:a})},stop:function(e,n){var r=n.item[0];a.current=t.idx(r),t.trigger(t.Events.ROW_DRAG_COMPLETED,{row:r,position:a})}}),e(t.element).find("tbody tr").addClass("issue-table-draggable")}},disable:function(){e(t.element).children("tbody").sortable("destroy")},cancel:function(){e(t.element).children("tbody").sortable("cancel")}}},o=function(n){var a=r.extend({element:n,Events:{ROW_DRAG_STARTED:"jira-issuetable-web-component-row-drag-started",ROW_DRAG_COMPLETED:"jira-issuetable-web-component-row-drag-completed",ROW_DRAG_CANCELED:"jira-issuetable-web-component-row-drag-canceled"},idx:function(t){return e(t).index()},dragging:null},t.Events);return a.dragging=i(a),a},s=r.extend({tables:[],Events:{ATTACHED:"jira-issuetable-web-component-attached",DETACHED:"jira-issuetable-web-component-detached"},onTable:function(e){this.tables.forEach(e),this.on(this.Events.ATTACHED,e)},cancelDragging:function(){this.tables.forEach(function(e){e.dragging.cancel()})}},t.Events);return a.prop(s,"cancelDragging",{sinceVersion:"7.5",removeInVersion:"7.6"}),{enhancedTable:o,impl:{attach:function(e){s.tables.push(e),s.trigger(s.Events.ATTACHED,e)},detach:function(e){s.tables.forEach(function(t,n){e===t&&(s.tables.splice(n),s.trigger(s.Events.DETACHED,t))})}},api:s}});