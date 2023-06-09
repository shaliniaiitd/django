<%@ page import="com.atlassian.jira.web.util.ProductVersionDataBeanProvider" %>
<%@ page import="com.atlassian.plugin.webresource.WebResourceManager" %>
<%@ taglib uri="webwork" prefix="ww"%>
<%@ taglib uri="webwork" prefix="ui" %>
<%@ taglib uri="webwork" prefix="aui" %>
<%@ taglib uri="sitemesh-page" prefix="page" %>
<%@ taglib uri="sitemesh-decorator" prefix="decorator" %>
<%@ taglib uri="jiratags" prefix="jira" %>
<%
    // Plugins 2.5 allows us to perform context-based resource inclusion. This defines the context "atl.error"
    final WebResourceManager webResourceManager = ComponentAccessor.getComponent(WebResourceManager.class);
    webResourceManager.requireResourcesForContext("atl.error");
    webResourceManager.requireResourcesForContext("jira.error");
%>
<!DOCTYPE html>
<html lang="<%= ComponentAccessor.getJiraAuthenticationContext().getI18nHelper().getLocale().getLanguage() %>">
<head>
    <%@ include file="/includes/decorators/aui-layout/head-common.jsp" %>
    <%@ include file="/includes/decorators/aui-layout/head-resources.jsp" %>
    <decorator:head/>
</head>
<body id="jira" class="aui-layout aui-theme-default page-type-message <jira:a11y-classes/> <decorator:getProperty property="body.class" />" <%= ComponentAccessor.getComponent(ProductVersionDataBeanProvider.class).get().getBodyHtmlAttributes() %>>
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
                <ui:soy moduleKey="'com.atlassian.auiplugin:soy'" template="'aui.page.pagePanelContent'">
                    <ui:param name="'content'">
                        <decorator:body />
                        <ww:if test="hasErrorMessages == 'true'">
                            <aui:component template="auimessage.jsp" theme="'aui'">
                                <aui:param name="'messageType'">error</aui:param>
                                <aui:param name="'messageHtml'">
                                    <ww:iterator value="flushedErrorMessages">
                                        <p><ww:property /></p>
                                    </ww:iterator>
                                </aui:param>
                            </aui:component>
                        </ww:if>
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
