<%@ page import="com.atlassian.jira.component.ComponentAccessor" %>
<%@ page import="com.atlassian.jira.config.properties.APKeys" %>
<%@ page import="com.atlassian.jira.config.properties.ApplicationProperties" %>
<%@ page import="com.atlassian.jira.web.util.ProductVersionDataBeanProvider" %>
<%@ page import="com.atlassian.webresource.api.assembler.PageBuilderService" %>
<%@ page import="com.opensymphony.util.TextUtils" %>
<%@ taglib uri="sitemesh-decorator" prefix="decorator" %>
<%@ taglib uri="jiratags" prefix="jira" %>
<%@ taglib uri="webwork" prefix="ww" %>
<%@ taglib uri="webwork" prefix="ui"%>
<%
    final ApplicationProperties applicationProperties = ComponentAccessor.getComponentOfType(ApplicationProperties.class);
    final String jiraTitle = applicationProperties.getDefaultBackedString(APKeys.JIRA_TITLE);
    final String jiraLogoUrl = applicationProperties.getDefaultBackedString(APKeys.JIRA_LF_LOGO_URL);
%>
<!DOCTYPE html>
<html lang="<%= ComponentAccessor.getJiraAuthenticationContext().getI18nHelper().getLocale().getLanguage() %>">
<head>
    <title><%= TextUtils.htmlEncode(jiraTitle) %> - <decorator:title/></title>
    <meta http-equiv="Content-Type" content="<%= applicationProperties.getContentType() %>" />
    <link rel="shortcut icon" href="<%=request.getContextPath()%>/favicon.ico" />
    <decorator:head/>
<%
    final PageBuilderService pbs = ComponentAccessor.getComponent(PageBuilderService.class);
    pbs.assembler().resources().requireWebResource("jira.webresources:jira-setup");
    pbs.assembler().assembled().drainIncludedResources().writeHtmlTags(out, com.atlassian.webresource.api.UrlMode.RELATIVE);
%>
    <meta name="ajs-setup-session-id" content="<ww:property value="/setupSessionId"/>"/>
    <meta name="ajs-server-id" content="<ww:property value="/serverId"/>"/>
    <meta name="ajs-instant-setup" content="<ww:property value="/instantSetup"/>"/>
    <meta name="ajs-setup-analytics-iframe-url" content="<ww:property value="/analyticsIframeUrl"/>"/>
    <meta name="ajs-license-product-key" content="<ww:property value="/licenseProductKey"/>"/>
</head>
<body id="jira" class="aui-layout aui-theme-default aui-page-focused aui-page-focused-large <decorator:getProperty property="body.class" />" <%= ComponentAccessor.getComponent(ProductVersionDataBeanProvider.class).get().getBodyHtmlAttributes() %>>
<div id="page">
    <header id="header" role="banner">
        <nav class="aui-header" role="navigation">
            <div class="aui-header-inner">
                <div class="aui-header-primary">
                    <h1 id="logo" class="aui-header-logo">
                        <img src="<%=request.getContextPath() + TextUtils.htmlEncode(jiraLogoUrl)%>" alt="<%=TextUtils.htmlEncode(jiraTitle)%>"/>
                    </h1>
                </div>
            </div>
        </nav>
    </header>
    <div id="content">
        <ui:soy moduleKey="'com.atlassian.auiplugin:soy'" template="'aui.page.pagePanel'">
            <ui:param name="'extraClasses'">margin-fix</ui:param>
            <ui:param name="'content'">
                <ui:soy moduleKey="'com.atlassian.auiplugin:soy'" template="'aui.page.pagePanelContent'">
                    <ui:param name="'content'">
                        <decorator:body />
                    </ui:param>
                </ui:soy>
            </ui:param>
        </ui:soy>
    </div>
    <footer id="footer" role="contentinfo"></footer>
</div>
</body>
</html>
