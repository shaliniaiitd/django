define("jira/ajs/list/list",["jira/util/logger","jira/util/formatter","jira/util/strings","jira/ajs/control","jira/ajs/list/group-descriptor","jira/ajs/list/item-descriptor","jira/ajs/input/mouse","jira/util/assistive","jira/util/browser","jquery","underscore"],function(t,e,i,s,n,o,r,a,l,c,u){"use strict";function h(t){return t.trim().toLowerCase().replace(/[\s\.]+/g,"-")}var d=0;return s.extend({MAX_RESULT_LIMIT:2e3,init:function(t){t=t||{},this.options=t?c.extend(!0,this._getDefaultOptions(t),t):this._getDefaultOptions(t),this.maxInlineResultsDisplayed=this.options.maxInlineResultsDisplayed||this.MAX_RESULT_LIMIT,this._renders=c.extend({},this._renders,this.options.renderers),this.disabled=!0,this.reset();var e=this;this.options.selectionHandler&&this.$container.delegate(this.options.itemSelector,this.options.selectionEvent,function(t){e.options.selectionHandler.call(e,t)}),this.motionDetector.wait(),this.$container.delegate(this.options.itemSelector,"mousemove",function(){e.disabled||!e.motionDetector.moved&&!l.isSelenium()||(e.index=c.inArray(this,e.$visibleItems),e.focus(!0))})},_getDefaultOptions:function(){return{selectionEvent:"click",delegateTarget:document,matchingStrategy:"(^|.*?(\\s+|\\())({0})(.*)",itemSelector:"li.aui-list-item",listItemTag:"a",hasLinks:!0,stallEventBind:!0,expandAllResults:!1,suggestionRole:"option",subtextPrefix:"",loopThroughOptions:!1}},index:0,moveToFirst:function(){this.$visibleItems.length>0&&(this.index=0,this.focus())},moveToNext:function(){this.index<this.maxIndex?(++this.index,this.focus()):this.options.expandAllResults&&this.hasTooManySuggestions?(this._expandAllResults(),++this.index,this.focus()):this.$visibleItems.length>1&&this.options.loopThroughOptions&&(this.index=0,this.focus())},container:function(t){if(!t)return this.$container;this.$container=c(t),this.containerSelector=t},getItemsByDescriptor:function(t){var e=c();return this.$container.find(this.options.itemSelector).each(function(){var i=c.data(this,"descriptor");i&&i.value()===t.value()&&(e=e.add(this))}),e},scrollContainer:function(){return this.options.scrollContainer?this.$container.find(this.options.scrollContainer):this.$container.parent()},_isScrollConstrained:function(){var t=this.scrollContainer()[0];return t.clientHeight<t.scrollHeight},moveToPrevious:function(){this.index>0?(--this.index,this.focus()):this.$visibleItems.length>0&&this.options.loopThroughOptions&&(this.index=this.$visibleItems.length-1,this.focus())},scrollActiveItemIntoView:function(){var t=this.$visibleItems.filter(".active"),e=this.scrollContainer(),i=e.scrollTop();if(0!==t.length){if(!this._isScrollConstrained())return void t.scrollIntoView({callback:c.proxy(this.motionDetector,"wait")});if(0!==t.closest(e).length){if(t.is(e.find(this.items).first()))return void this._scrollContainerTo(0);var s=t.offset().top-e.offset().top,n=e.outerHeight()-t.outerHeight()-s;s>=0?n<0&&this._scrollContainerTo(i-n):this._scrollContainerTo(i+s)}}},_scrollContainerTo:function(t){var e=this.scrollContainer();e.scrollTop()!==t&&(this.motionDetector.unbind(),this.motionDetector.wait(),e.scrollTop(t))},focus:function(t){this.$visibleItems.removeClass("active");var e=this.$visibleItems.eq(this.index);e.addClass("active"),this.lastFocusedItemDescriptor=e.data("descriptor"),this.trigger("itemFocus",e,this.lastFocusedItemDescriptor),t||this.scrollActiveItemIntoView()},motionDetector:new r.MotionDetector,disable:function(){this.disabled||(this._unassignEvents("delegateTarget",this.options.delegateTarget),this.disabled=!0,this.lastFocusedItemDescriptor=null)},enable:function(){var t=this;t.disabled&&(this.options.stallEventBind?window.setTimeout(function(){t._assignEvents("delegateTarget",t.options.delegateTarget)},0):t._assignEvents("delegateTarget",t.options.delegateTarget),t.disabled=!1,this._scrollContainerTo(0))},getFocused:function(){return this.$visibleItems.filter(".active")},reset:function(t){this.$container=c(this.options.containerSelector),this.items=c(this.options.itemSelector,this.$container).not(".no-suggestions"),this.$visibleItems=this._computeVisibleItems(),this.groups=c(this.options.groupSelector,this.$container),this.maxIndex=this.$visibleItems.length-1,this.index=this.$visibleItems[t]?t:0,this.focus(!0)},_computeVisibleItems:function(){return this.items.not(".hidden, .disabled")},selectValue:function(e){var i=this.$container.find(this.options.itemSelector).filter(function(){return c(this).parent().data("descriptor").value()===e});i.length||t.log("WARN: No List item found with Decriptor value '"+e+"'"),i.click()},_getLinkFromItem:function(t){return t=c(t),t.is("a")?t:t.find("a")},_addTitlesToProjectItems:function(t){function e(t){void 0===t.properties.title&&(t.properties.title=t.properties.label)}t.forEach(function(t){t instanceof n?t.properties.items.forEach(function(t){e(t)}):t instanceof o&&e(t)})},_makeResultDiv:function(t,e){function i(){l.length>0&&(r.append(a._generateUngroupedOptions(l,e)),l=[])}var s=c('<div class="aui-list-fixed" role="presentation">'),r=c('<div class="aui-list-scroll" tabindex="-1" role="presentation">'),a=this,l=[];return this.$container&&"project-suggestions"===this.$container.attr("id")&&this._addTitlesToProjectItems(t),c.each(t,function(t,c){var u,h;c instanceof n?(i(),u="fixed"===c.placement()?s:r,h=a._generateOptGroup(c,e),u.append(h)):c instanceof o&&l.push(c)}),i(),0===s.children().length?r:s.add(r)},_addResultToContainer:function(t){if(0===t.not(".aui-list-fixed").find(this.options.itemSelector).length){var e=this.$container.find(".aui-list-scroll");0===e.length&&(e=c('<div class="aui-list-scroll" tabindex="-1" role="presentation">').appendTo(this.$container));var i=this._render("noSuggestion");a.readText(i.text()),e.html(i)}else t.find("ul:last").addClass("aui-last"),this.$container.html(t)},generateListFromJSON:function(t,e,i){this.suggestions=0,this.exactMatchIndex=-1,this.lastFocusedIndex=-1,this.lastQuery=e,this.lastData=t,this.forceAllResults=i,this.hasTooManySuggestions=!1;var s=this._makeResultDiv(t,e);this.$container.hide(),this._addResultToContainer(s,e),this.$container.show();var n=this.exactMatchIndex>=0?this.exactMatchIndex:this.lastFocusedIndex;this.reset(n)},appendToGroupDescriptor:function(t,e){var i=u.find(this.lastData,function(e){return e.id()===t});u.forEach(e,function(t){i.addItem(t)})},_generateOption:function(t,e,i){var s;if(!t.highlighted()&&i&&i.test(t.label())&&(s=t.label().replace(i,function(t,e,i,s,n){var o=c("<div>");return e&&o.append(c("<span>").text(e)),o.append(c("<em>").text(s)),n&&o.append(c("<span>").text(n)),o.html()})),this.exactMatchIndex<0){var n=c.trim(t.label()).toLowerCase();t.noExactMatch()||n!==c.trim(e).toLowerCase()?this.lastFocusedIndex<0&&this.lastFocusedItemDescriptor&&n===c.trim(this.lastFocusedItemDescriptor.label()).toLowerCase()&&(this.lastFocusedIndex=this.suggestions):this.exactMatchIndex=this.suggestions}return this.suggestions++,this._render("suggestion",t,s)},_filterOptions:function(t,i,s){if(!i)return t;for(var n=[],o=new RegExp(e.format(".*{0}.*",i),"i"),r=0,a=t.length;r<a;r++){var l=this._filterOption(t[r],o,s);l&&n.push(l)}return n},_filterOption:function(t,e,i){var s;if(t.highlighted())s=t;else if(i.test(t.label()))s=t;else if(t.keywords()){for(var n=[],o=""+t.keywords(),r=o.split(","),a=0;a<r.length;a++){var l=r[a];e.test(l)&&n.push(l)}n.length&&(t.labelSuffix(" "+n.join(", ")),s=t)}return s},_addOptionsToContainer:function(t,e,i,s){for(var n=this,o=this.maxInlineResultsDisplayed,r=!1,l=this.forceAllResults,u=[],h=0,d=t.length;h<d;h++){var p=t[h];if(!(h<o||l)){this.hasTooManySuggestions=!0;var f=n._render("tooManySuggestions",t.length-h);a.readText(f.text()),u.push(f[0]);break}var g=n._generateOption(p,i,s);g&&(r=!0,u.push(g[0]))}return e.html(c(u)),r},_filterAndAddOptions:function(t,i,s){var n,o;return s&&(n=RegExp.escape(s),o=new RegExp(e.format(this.options.matchingStrategy,n),"i"),t=this._filterOptions(t,n,o)),this.options.maxResultsDisplayedPerGroup&&(t=t.slice(0,this.options.maxResultsDisplayedPerGroup)),this._addOptionsToContainer(t,i,s,o)},_generateUngroupedOptions:function(t,e){var i=this._render("ungroupedSuggestions");if(this._filterAndAddOptions(t,i,e))return i},_generateOptGroup:function(t,e){var i=c(),s=this._render("suggestionGroup",t),n=t.items();if(this._filterAndAddOptions(n,s,e))return t.label()&&!1!==t.showLabel()&&(i=i.add(this._render("suggestionGroupHeading",t))),t.footerText()?s.append(this._render("suggestionsGroupFooter",t.footerText())):t.footerHtml()&&s.append(t.footerHtml()),t.actionBarHtml()&&s.prepend(t.actionBarHtml()),i=i.add(s)},_expandAllResults:function(){this.generateListFromJSON(this.lastData,this.lastQuery,!0)},_events:{delegateTarget:{"aui:keydown":function(t){this._handleKeyEvent(t)}}},_renders:{suggestion:function(t,e){d+=1;var s=t.fieldText()||t.label(),n=i.escapeHtml(h(s)),o=c('<li class="aui-list-item"><'+this.options.listItemTag+' class="aui-list-item-link" role="presentation" /></li>').attr({role:this.options.suggestionRole,id:n+"-"+d}),r=o.children();if(o.addClass("aui-list-item-li-"+n),t.selected()&&o.addClass("aui-checked"),this.options.hasLinks&&r.attr("href",t.href()||"#"),t.styleClass()&&r.addClass(t.styleClass()),e?r.html(e):t.html()?r.html(t.html()):r.text(t.label()),t.labelSuffix()){var a=c("<span class='aui-item-suffix' />").text(this.options.subtextPrefix+t.labelSuffix());r.wrapInner("<span class='aui-item-text' />").append(a)}if(t.icon()&&"none"!==t.icon()){var l=c('<img class="icon"  alt="" loading="lazy" />');l.attr("src",t.icon()),"rounded"===t.iconType()&&l.addClass("rounded"),r.addClass("aui-iconised-link").prepend(l)}return t.title()&&r.prop("title",t.title()),o.data("descriptor",t),o},noSuggestion:function(){return c('<li class="no-suggestions">').text(e.I18n.getText("common.concepts.no.matches"))},tooManySuggestions:function(t){if(this.options.expandAllResults){var i=this,s=c(["<button type='button' class='aui-button aui-button-link view-all'>",e.I18n.getText("common.concepts.view.all.with.total.info",t),"</button>"].join("")),n=c('<li class="no-suggestions"></li>').append(s);return s.click(function(t){i._expandAllResults(),t.stopPropagation()}),s=null,n}return c('<li class="no-suggestions">'+e.I18n.getText("common.concepts.too.many.matches",t)+"</li>")},ungroupedSuggestions:function(){return c("<ul>")},suggestionGroup:function(t){return c("<ul/>").attr({id:h(t.label()),class:"aui-list-section","aria-label":t.label()}).addClass(t.styleClass()).data("descriptor",t)},suggestionGroupHeading:function(t){var e=c("<h5 />").text(t.label()).addClass(t.styleClass()).data("descriptor",t);return t.description()&&c("<span class='aui-section-description' />").text(" ("+t.description()+")").appendTo(e),e},suggestionsGroupFooter:function(t){return c("<li class='aui-list-section-footer' />").text(t)}},_acceptSuggestion:function(t){!t instanceof c&&(t=c(t));var e=this._getLinkFromItem(t);if(e.length){var i=new c.Event("click");e.trigger(i,[e]),i.isDefaultPrevented()||(window.location.href=e.attr("href"))}},getAllItems:function(){return this.$container.find(this.options.itemSelector)},_acceptUserInput:function(t){t.triggerHandler("blur")},_handleSectionByKeyboard:function(t){var e=this.getFocused(),i=c(t.target);if(0!==e.length){if(this._latestQuery&&c.trim(i.val())!==this._latestQuery){var s=i.val().toLowerCase().match(/\S+/g);if(!s)return;var n=this.lastFocusedItemDescriptor&&this.lastFocusedItemDescriptor.html(),o=n?c("<div>").html(n):e,r=[];o.find("em,b").each(function(){var t=c(this),e=c(t.attr("nextSibling")).text().toLowerCase().match(/^\S*/)[0];c.each(t.text().toLowerCase().match(/\S+/g),function(t,i){r.push(i+e)})});for(var a=0;a<s.length;a++){for(var l=s[a],u=l.length,h=!1,d=0;d<r.length;d++)if(r[d].slice(0,u)===l){h=!0;break}if(!h)return void this._acceptUserInput(i)}}this.scrollActiveItemIntoView(),this.options.selectionHandler&&!this.options.selectionHandler.call(this,t)||this._acceptSuggestion(e)}},_isValidInput:function(){return!this.disabled&&this.$container.is(":visible")},keys:{Down:function(t){this.moveToNext(),t.preventDefault()},Up:function(t){this.moveToPrevious(),t.preventDefault()},Return:function(t){this._handleSectionByKeyboard(t),t.preventDefault()}},_buildElementId:h})}),AJS.namespace("AJS.List",null,require("jira/ajs/list/list"));