define("jira/tipsy",["jquery"],function(i){i.fn.tipsy=function(){for(var i=arguments.length,t=Array(i),r=0;r<i;r++)t[r]=arguments[r];this.tooltip&&this.tooltip.apply(this,t)}}),require("jira/tipsy");