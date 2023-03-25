@echo off

rem Calculate offset to ..\logs directory using short path (no spaces etc.)
set atlassian_logsdir=%~dsp0..\logs

set GC_JVM_PARAMETERS=

if %JAVA_VERSION% GEQ 9 (
    goto javaNewGcParams
) else (
	goto javaOldGcParams
)

:javaOldGcParams
rem Set the JVM arguments used to start Jira. For a description of the options, see
rem http://www.oracle.com/technetwork/java/javase/tech/vmoptions-jsp-140102.html

rem -----------------------------------------------------------------------------------
rem This allows us to actually debug GC related issues by correlating timestamps
rem with other parts of the application logs.
rem -----------------------------------------------------------------------------------

set GC_JVM_PARAMETERS=-XX:+PrintGCDetails -XX:+PrintGCDateStamps -XX:+PrintGCTimeStamps -XX:+PrintGCCause %GC_JVM_PARAMETERS%
set GC_JVM_PARAMETERS=-XX:+UseGCLogFileRotation -XX:NumberOfGCLogFiles=5 -XX:GCLogFileSize=20M %GC_JVM_PARAMETERS%
set GC_JVM_PARAMETERS=-Xloggc:"%atlassian_logsdir%\atlassian-jira-gc-%%t.log" %GC_JVM_PARAMETERS% %JVM_GC_ARGS%

goto javaGcParamsDone


:javaNewGcParams
rem In Java 9, GC logging has been re-implemented using the Unified GC logging framework.
rem See http://openjdk.java.net/jeps/158 or https://docs.oracle.com/javase/10/jrockit-hotspot/logging.htm
set GC_JVM_PARAMETERS=-Xlog:gc*:file=\"%atlassian_logsdir%\atlassian-jira-gc-%%t.log\":tags,time,uptime,level:filecount=5,filesize=20M %GC_JVM_PARAMETERS%
set GC_JVM_PARAMETERS=%GC_JVM_PARAMETERS% %JVM_GC_ARGS%

goto javaGcParamsDone


:javaGcParamsDone
set CATALINA_OPTS= %GC_JVM_PARAMETERS% %CATALINA_OPTS%

rem Clean up temporary variables
set atlassian_logsdir=
