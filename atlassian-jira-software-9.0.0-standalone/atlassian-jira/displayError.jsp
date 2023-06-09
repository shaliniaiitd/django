<%@ page contentType="text/html;charset=UTF-8" language="java" session="false" %>
<%@ taglib uri="webwork" prefix="ui" %>
<%@ taglib uri="jiratags" prefix="jira" %>
<%@ page import="com.atlassian.jira.security.JiraAuthenticationContext" %>
<%@ page import="com.atlassian.jira.util.I18nHelper" %>
<%@ page import="com.atlassian.jira.web.util.ProductVersionDataBean" %>
<%@ page import="com.atlassian.jira.web.util.ProductVersionDataBeanProvider" %>
<%@ page import="com.atlassian.plugin.webresource.WebResourceManager" %>
<%@ page import="com.opensymphony.util.TextUtils" %>
<%@ page import="org.apache.commons.httpclient.HttpStatus" %>
<%
    WebResourceManager webResourceManager = ComponentAccessor.getComponentSafely(WebResourceManager.class).get();
%>
<html>
<%
    // include the relevant contexts
    webResourceManager.requireResourcesForContext("atl.general");
    webResourceManager.requireResourcesForContext("jira.general");
    webResourceManager.requireResourcesForContext("atl.global");
    webResourceManager.requireResourcesForContext("jira.global");

    // figure out the status code
    Integer statusCode = (Integer) request.getAttribute("javax.servlet.error.status_code");
    String statusText = HttpStatus.getStatusText(statusCode);
    String errorMessage = (String) request.getAttribute("javax.servlet.error.message");
    if (errorMessage == null) {
        errorMessage = "";
    }

    I18nHelper i18nBean = ComponentAccessor.getComponent(JiraAuthenticationContext.class).getI18nHelper();
    ProductVersionDataBean dataBean = ComponentAccessor.getComponent(ProductVersionDataBeanProvider.class).get();
%>
<head>
    <title><%=TextUtils.htmlEncode(statusText)%> (<%=statusCode%>)</title>
    <%@ include file="/includes/decorators/aui-layout/head-resources.jsp" %>
    <%= dataBean.getMetaTags() %>
</head>
<body id="jira" class="aui-layout aui-style-default page-type-message <jira:a11y-classes/>" <%= dataBean.getBodyHtmlAttributes() %> >
<%--Marker for func tests. DO NOT DELETE! --%>
<!-- HTTPError<%=statusCode%> -->
    <ui:soy moduleKey="'com.atlassian.auiplugin:soy'" template="'aui.page.pagePanel'">
        <ui:param name="'content'">
            <ui:soy moduleKey="'com.atlassian.auiplugin:soy'" template="'aui.page.pagePanelContent'">
                <ui:param name="'content'">
                    <ui:soy moduleKey="'com.atlassian.auiplugin:soy'" template="'aui.page.pageHeader'">
                        <ui:param name="'content'">
                            <ui:soy moduleKey="'com.atlassian.auiplugin:soy'" template="'aui.page.pageHeaderMain'">
                                <ui:param name="'content'">
                                    <h1><%=TextUtils.htmlEncode(statusText)%> (<%=statusCode%>)</h1>
                                </ui:param>
                            </ui:soy>
                        </ui:param>
                    </ui:soy>
                    <ui:soy moduleKey="'com.atlassian.auiplugin:soy'" template="'aui.message.warning'">
                        <ui:param name="'content'">
                            <p><%=i18nBean.getText("http.generic.error.message", TextUtils.htmlEncode("\"" + statusCode + " - " + statusText + "\""))%></p>
                            <p><%= TextUtils.htmlEncode(errorMessage) %></p>
                            <p><a href="<%=request.getContextPath()%>/secure/MyJiraHome.jspa"><%=TextUtils.htmlEncode(i18nBean.getText("admin.keyboard.shortcut.goto.homr.desc"))%></a></p>
                        </ui:param>
                    </ui:soy>
                </ui:param>
            </ui:soy>
        </ui:param>
    </ui:soy>
</body>
</html>
