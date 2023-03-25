@echo off

set _EXECJAVA="%JRE_HOME%\bin\java.exe"
call "%CATALINA_HOME%\bin\check-java"
if errorlevel 1 exit /b 1

rem --------------------------------------------------------------------------
rem
rem  You can use variable below to modify garbage collector settings. Please note
rem  that you must replace any space with semicolon!
rem  For Java 8 we recommend default settings
rem  For Java 11 and relatively small heaps we recommend: -XX:+UseParallelGC
rem  For Java 11 and larger heaps we recommend: -XX:+UseG1GC;-XX:+ExplicitGCInvokesConcurrent
rem
rem --------------------------------------------------------------------------
set JVM_GC_ARGS=-XX:+ExplicitGCInvokesConcurrent

if %JAVA_VERSION% GEQ 9 (
	goto javaNewGcParams
) else (
	goto javaOldGcParams
)

:javaOldGcParams
set GC_JVM_PARAMETERS=%JVM_GC_ARGS%;-XX:+PrintGCDetails;-XX:+PrintGCDateStamps;-XX:+PrintGCTimeStamps;-XX:+PrintGCCause;-XX:+UseGCLogFileRotation;-XX:NumberOfGCLogFiles=5;-XX:GCLogFileSize=20M;-Xloggc:%CATALINA_HOME%\logs\atlassian-jira-gc-%%t.log
goto javaGcParamsDone


:javaNewGcParams
set GC_JVM_PARAMETERS=%JVM_GC_ARGS%;-Xlog:gc*:file=.\logs\atlassian-jira-gc-%%t.log:tags,time,uptime,level:filecount=5,filesize=20M
goto javaGcParamsDone


:javaGcParamsDone
