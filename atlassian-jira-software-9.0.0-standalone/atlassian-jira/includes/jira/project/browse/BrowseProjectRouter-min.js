define("jira/project/browse/router",["underscore","backbone","jira/util/navigation"],function(t,e,i){"use strict";return e.Router.extend({initialize:function(e){this.route(/(.*)/,"every",this.handleRouteChange),this.application=e.application,this.listenTo(this.application.layout.paginationView,"navigate",function(e){var a=t.extend(this.application.filter.getQueryParams(!1),{page:e});i.navigate(a)}),this.listenTo(this.application.layout.projectCollectionView,"sorted",function(e,a){var r=t.extend(this.application.filter.getQueryParams(!1),{sortColumn:e,sortOrder:a});i.navigate(r)}),this.application.filter.on("filter",function(t){i.navigate(t)})},getParams:function(){var t=i.getParam("selectedCategory")||"",e=i.getParam("selectedProjectType")||"";return{categoryId:t,projectTypeId:e,page:+i.getParam("page",!0)||1,contains:i.getParam("contains",!0)||"",sortColumn:i.getParam("sortColumn")||"",sortOrder:i.getParam("sortOrder")||"",category:this.application.categories.selectCategory(t),projectType:this.application.availableProjectTypes.selectProjectType(e)}},handleRouteChange:function(){var t=this.getParams();t.contains&&this.application.filter.set("contains",t.contains,{silent:!0}),!1!==t.category&&this.application.filter.set("category",t.category.toJSON(),{silent:!0}),!1!==t.projectType&&this.application.filter.set("projectType",t.projectType.toJSON(),{silent:!0}),t.sortColumn&&this.application.filter.set("sortColumn",t.sortColumn,{silent:!0}),t.sortOrder&&this.application.filter.set("sortOrder",t.sortOrder,{silent:!0}),t.sortOrder&&t.sortColumn&&this.application.projects.updateSorting(t.sortColumn,t.sortOrder),this.application.filter.filterCollection(),t.page&&t.page!==this.application.projects.state.currentPage&&this.application.projects.getPage(t.page),this.application.layout.render()}})});