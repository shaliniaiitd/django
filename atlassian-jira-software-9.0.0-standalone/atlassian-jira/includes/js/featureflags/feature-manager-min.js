define("jira/featureflags/feature-manager",["wrm/data","exports"],function(e,a){"use strict";var r=e.claim("jira.core:feature-flags-data.feature-flag-data"),t=r&&r["feature-flag-states"]||{},f=r&&r["enabled-feature-keys"]||[],n=function(e,a){return-1!==e.indexOf(a)};a.isFeatureEnabled=function(e){return t.hasOwnProperty(e)?t[e]:n(f,e)}});