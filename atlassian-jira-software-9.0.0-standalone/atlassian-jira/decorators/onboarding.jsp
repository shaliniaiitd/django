<%@ page import="com.atlassian.jira.web.util.ProductVersionDataBeanProvider" %>
<%@ page import="com.atlassian.plugin.webresource.WebResourceManager" %>
<%@ taglib prefix="decorator" uri="sitemesh-decorator" %>
<%@ taglib uri="jiratags" prefix="jira" %>
<%
    WebResourceManager webResourceManager = ComponentAccessor.getComponent(WebResourceManager.class);
    webResourceManager.requireResource("com.atlassian.jira.jira-onboarding-assets-plugin:decorator-resources");
%>
<!DOCTYPE html>
<html lang="<%= ComponentAccessor.getJiraAuthenticationContext().getI18nHelper().getLocale().getLanguage() %>">
<head>
    <%@ include file="/includes/decorators/aui-layout/head-common.jsp" %>
    <%@ include file="/includes/decorators/aui-layout/head-resources.jsp" %>
    <decorator:head/>
</head>
<body id="jira" class="aui-layout aui-theme-default page-type-focused <jira:a11y-classes/> <decorator:getProperty property="body.class" />" <%= ComponentAccessor.getComponent(ProductVersionDataBeanProvider.class).get().getBodyHtmlAttributes() %>>
<div id="page">
    <header id="header" role="banner">
        <%@ include file="/includes/decorators/unsupported-browsers.jsp" %>
        <%@ include file="/includes/decorators/aui-layout/header.jsp" %>
    </header>
    <%--body content is required to specify main element landmark--%>
    <div id="content">
        <decorator:body />
    </div>
    <footer id="footer" role="contentinfo">
        <%@ include file="/includes/decorators/aui-layout/footer.jsp" %>
    </footer>
</div>
<%@ include file="/includes/decorators/aui-layout/endbody-resources.jsp" %>
</body>
</html>
