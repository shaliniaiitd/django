define("jira/ajs/layer/inline-layer/standard-positioning",["jira/lib/class","jquery"],function(t,i){"use strict";return t.extend({init:function(){this.rebuiltCallbacks=[]},left:function(){var t=this.offset();return{left:t.left,top:t.top+this.offsetTarget().outerHeight()}},right:function(){var t=this.offset();return{left:t.left-this.layer().outerWidth()+this.offsetTarget().outerWidth(),top:t.top+this.offsetTarget().outerHeight()}},window:function(t){function i(){return t.apply(this,arguments)}return i.toString=function(){return t.toString()},i}(function(){return window}),offset:function(){var t=this.offsetTarget().offset();return this.offsetTarget().hasFixedParent()?(this.layer().css("position","fixed"),t.top=t.top-i(window).scrollTop()):this.layer().css("position","absolute"),t},rebuilt:function(t){var e=this;i.isFunction(t)?this.rebuiltCallbacks.push(t):i.each(this.rebuiltCallbacks,function(){this(e.layer())})},appendToBody:function(){this.layer().appendTo("body")},appendToPlaceholder:function(){this.layer().appendTo(this.$placeholder)},scrollTo:function(){}})});