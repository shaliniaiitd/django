<%@ page import="com.atlassian.jira.security.JiraAuthenticationContext" %>
<%@ page import="com.atlassian.plugin.webresource.WebResourceManager" %>
<%@ page import="webwork.action.ActionContext" %>
<%@ taglib uri="webwork" prefix="ww" %>
<%@ taglib uri="webwork" prefix="ui" %>
<%@ taglib uri="jiratags" prefix="jira" %>
<%@ taglib prefix="decorator" uri="sitemesh-decorator" %>
<%
    // Plugins 2.5 allows us to perform context-based resource inclusion. This defines the context "atl.userprofile"
    final WebResourceManager webResourceManager = ComponentAccessor.getWebResourceManager();
    webResourceManager.requireResourcesForContext("atl.userprofile");
    webResourceManager.requireResourcesForContext("jira.userprofile");
    webResourceManager.requireResourcesForContext("atl.general");
    webResourceManager.requireResourcesForContext("jira.general");
%>
<!DOCTYPE html>
<html lang="<%= ComponentAccessor.getJiraAuthenticationContext().getI18nHelper().getLocale().getLanguage() %>">
<head>
    <%@ include file="/includes/decorators/aui-layout/head-common.jsp" %>
    <%@ include file="/includes/decorators/aui-layout/head-resources.jsp" %>
    <decorator:head/>
</head>
<body id="jira" class="aui-layout aui-theme-default page-type-userprofile <jira:a11y-classes/> <decorator:getProperty property="body.class" />">
<div id="page">
    <header id="header" role="banner">
        <%@ include file="/includes/decorators/aui-layout/notifications-header.jsp" %>
        <%@ include file="/includes/decorators/unsupported-browsers.jsp" %>
        <%@ include file="/includes/decorators/aui-layout/header.jsp" %>
    </header>
    <%@ include file="/includes/decorators/aui-layout/notifications-content.jsp" %>
    <div id="content">
        <ui:soy moduleKey="'com.atlassian.auiplugin:soy'" template="'aui.page.pagePanel'">
            <ui:param name="'content'">
                <%
                    JiraAuthenticationContext authenticationContext = ComponentAccessor.getJiraAuthenticationContext();
                    final HttpServletRequest originalRequest = ActionContext.getRequest();
                    try
                    {
                        //full user format requires the request to be set in the ActionContext :(
                        ActionContext.setRequest(request);
                        if(authenticationContext.getUser() != null)
                        {
                            request.setAttribute("username", authenticationContext.getUser().getName());
                        }
                %>
                <ui:soy moduleKey="'com.atlassian.auiplugin:soy'" template="'aui.page.pagePanelNav'">
                    <ui:param name="'content'">
                        <jira:formatuser userName="@username" type="'fullProfile'" id="'view_profile'"/>
                    </ui:param>
                </ui:soy>
                <%
                    }
                    finally
                    {
                        ActionContext.setRequest(originalRequest);
                    }
                %>
                <ui:soy moduleKey="'com.atlassian.auiplugin:soy'" template="'aui.page.pagePanelContent'">
                    <ui:param name="'content'">
                        <decorator:body />
                    </ui:param>
                </ui:soy>
            </ui:param>
        </ui:soy>
    </div>
    <footer id="footer" role="contentinfo">
        <%--<%@ include file="/includes/decorators/aui-layout/notifications-footer.jsp" %>--%>
        <%@ include file="/includes/decorators/aui-layout/footer.jsp" %>
    </footer>
</div>
<%@ include file="/includes/decorators/aui-layout/endbody-resources.jsp" %>
</body>
</html>
