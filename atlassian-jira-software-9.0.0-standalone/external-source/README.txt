Purpose
-------

This directory is for source code that you wish to compile into your
Jira distribution. For instance, it can be used to:

 - modify the Bugzilla or Mantis importer source:

http://docs.atlassian.com/jira/jadm-docs-090/Importing+Data+from+Bugzilla
http://docs.atlassian.com/jira/jadm-docs-090/Importing+Data+From+Mantis

 - customize/write a service to work with Jira:

http://docs.atlassian.com/jira/jadm-docs-090/Services

 - Create or edit a Jira plugin:

http://docs.atlassian.com/jira/jadm-docs-090/

People making substantial modifications should rather build Jira from
source
(https://developer.atlassian.com/display/JIRADEV/Building+JIRA+from+source). The
plugin development kit
(https://developer.atlassian.com/display/DOCS/Set+up+the+Atlassian+Plugin+SDK+and+Build+a+Project)
should be preferred for serious plugin developers.


Instructions
------------

 - Download Apache Ant from http://ant.apache.org
 - Copy source into a src/ subdirectory
 - Copy resources into the etc/ subdirectory
 - Copy libraries into the lib/ directory
 - Run 'ant'. Files will be compiled and copied into the main webapp
   (../atlassian-jira/WEB-INF/classes/)


To get Jira to automatically reload these files, edit
../conf/server.xml, and set reloadable="true".
