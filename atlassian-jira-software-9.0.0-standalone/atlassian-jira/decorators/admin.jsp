<%@ page import="com.atlassian.jira.plugin.keyboardshortcut.KeyboardShortcutManager" %>
<%@ page import="com.atlassian.jira.util.ComponentFactory" %>
<%@ page import="com.atlassian.jira.web.util.ProductVersionDataBeanProvider" %>
<%@ page import="com.atlassian.plugin.webresource.WebResourceManager" %>
<%@ page import="com.atlassian.jira.web.sitemesh.AdminDecoratorHelper" %>
<%@ page import="com.atlassian.jira.util.I18nHelper" %>
<%@ page import="com.atlassian.jira.user.UserPropertyManager" %>
<%@ page import="com.atlassian.jira.cluster.ClusterManager" %>
<%@ page import="com.atlassian.jira.config.properties.JiraSystemProperties" %>
<%@ page import="com.atlassian.jira.user.ApplicationUser" %>
<%@ page import="com.atlassian.jira.config.FeatureManager" %>
<%@ taglib uri="sitemesh-decorator" prefix="decorator" %>
<%@ taglib uri="sitemesh-page" prefix="page" %>
<%@ taglib uri="webwork" prefix="ww" %>
<%@ taglib uri="webwork" prefix="ui" %>
<%@ taglib uri="webwork" prefix="aui" %>
<%@ taglib uri="jiratags" prefix="jira" %>
<decorator:usePage id="configPage"/>
<%
    {
        final ComponentFactory factory = ComponentAccessor.getComponentOfType(ComponentFactory.class);
        final ClusterManager clusterManager = ComponentAccessor.getComponentOfType(ClusterManager.class);
        final FeatureManager featureManager = ComponentAccessor.getComponentOfType(FeatureManager.class);
        final AdminDecoratorHelper helper = factory.createObject(AdminDecoratorHelper.class);
        final JiraAuthenticationContext authCtx = ComponentAccessor.getJiraAuthenticationContext();
        final UserPropertyManager userPropertyManager = ComponentAccessor.getUserPropertyManager();

        helper.setCurrentSection(configPage.getProperty("meta.admin.active.section"));
        helper.setCurrentTab(configPage.getProperty("meta.admin.active.tab"));
        helper.setProject(configPage.getProperty("meta.projectKey"));
        helper.triggerTabLoaded();

        request.setAttribute("adminHelper", helper);
        request.setAttribute("jira.admin.mode", true);
        request.setAttribute("jira.selected.section", helper.getSelectedMenuSection()); // Determine what tab should be active

        // Plugins 2.5 allows us to perform context-based resource inclusion.
        final WebResourceManager adminWebResourceManager = ComponentAccessor.getWebResourceManager();
        if (helper.isProjectAdministration()) {
            adminWebResourceManager.requireResourcesForContext("jira.admin.conf");
        }
        adminWebResourceManager.requireResourcesForContext("atl.admin");
        adminWebResourceManager.requireResourcesForContext("jira.admin");

        ApplicationUser loggedInUser = authCtx.getLoggedInUser();
        if (loggedInUser != null) {
            boolean isSpotlightCardDismissed = userPropertyManager.getPropertySet(loggedInUser).getBoolean("jira.user.suppressedTips.automation.onboarding.spotlight.cards");
            boolean isDCLicensed = clusterManager.isClusterLicensed();
            boolean isSpotlightCardDisabled = featureManager.isEnabled("never.display.automation.onboarding.cards");

            if(!isSpotlightCardDismissed && isDCLicensed && !isSpotlightCardDisabled) {
                adminWebResourceManager.requireResourcesForContext("onboardingSpotlightCardsA4J");
            }
        }

        final KeyboardShortcutManager adminKeyboardShortcutManager = ComponentAccessor.getComponent(KeyboardShortcutManager.class);
        adminKeyboardShortcutManager.requireShortcutsForContext(KeyboardShortcutManager.Context.admin);

        request.setAttribute("sidebarContentHtml", "");
        // shouldLoadSidebar is defined in ProjectAdminDecoratorMapper
        if ("true".equals(request.getAttribute("shouldLoadSidebar")) && helper.isHasSidebar()) {
            request.setAttribute("sidebarContentHtml", helper.getSidebarHtml());
        }
    }
    I18nHelper i18nBean = ComponentAccessor.getJiraAuthenticationContext().getI18nHelper();
%>
<!DOCTYPE html>
<html lang="<%= ComponentAccessor.getJiraAuthenticationContext().getI18nHelper().getLocale().getLanguage() %>">
<head>
    <%@ include file="/includes/decorators/aui-layout/head-common.jsp" %>
    <%@ include file="/includes/decorators/aui-layout/head-resources.jsp" %>
    <decorator:head/>
</head>
<body id="jira"
      class="aui-layout aui-theme-default page-type-admin <jira:a11y-classes/> <decorator:getProperty property="body.class" />" <%= ComponentAccessor.getComponent(ProductVersionDataBeanProvider.class).get().getBodyHtmlAttributes() %> >
<div id="page">
    <header id="header" role="banner">
        <%@ include file="/includes/decorators/aui-layout/notifications-header.jsp" %>
        <%@ include file="/includes/admin/admin-info-notifications.jsp" %>
        <%@ include file="/includes/decorators/unsupported-browsers.jsp" %>
        <%@ include file="/includes/decorators/aui-layout/header.jsp" %>
    </header>
    <%@ include file="/includes/decorators/aui-layout/notifications-content.jsp" %>
    <div id="content">
        <ww:property value="@adminHelper">
            <!-- sidebarContentHtml -->
            <ww:property value="@sidebarContentHtml" escape="false"/>
            <!-- /sidebarContentHtml -->
            <section aria-label='<%=i18nBean.getText("aui.landmarks.page")%>'>
                <ww:if test="hasHeader == true">
                    <ww:if test="@sidebarContentHtml/length > 0 ">
                        <ui:soy moduleKey="'com.atlassian.auiplugin:soy'" template="'aui.page.pageHeader'">
                            <ui:param name="'content'">
                                <ww:property value="headerHtml" escape="false"/>
                            </ui:param>
                        </ui:soy>
                    </ww:if>
                    <ww:else>
                        <ww:property value="headerHtml" escape="false"/>
                    </ww:else>
                </ww:if>
                <ui:soy moduleKey="'com.atlassian.auiplugin:soy'" template="'aui.page.pagePanel'">
                    <ui:param name="'content'">
                        <ui:soy moduleKey="'com.atlassian.auiplugin:soy'" template="'aui.page.pagePanelNav'">
                            <ww:if test="adminMenusAllHidden == true">
                                <ui:param name="'extraClasses'">hidden</ui:param>
                            </ww:if>
                            <ui:param name="'content'">
                                <nav class="aui-navgroup aui-navgroup-vertical" aria-label='<%=i18nBean.getText("aui.landmarks.main")%>'>
                                    <div class="aui-navgroup-inner">
                                        <div class="aui-navgroup-primary">
                                            <ww:property value="sideMenuHtml(./selectedMenuSection)" escape="false"/>
                                        </div>
                                    </div>
                                </nav>
                            </ui:param>
                        </ui:soy>
                        <ui:soy moduleKey="'com.atlassian.auiplugin:soy'" template="'aui.page.pagePanelContent'">
                            <ui:param name="'content'">
                                <decorator:body/>
                            </ui:param>
                        </ui:soy>
                    </ui:param>
                </ui:soy>
            </section>
        </ww:property>
    </div>
    <footer id="footer" role="contentinfo">
        <%--<%@ include file="/includes/decorators/aui-layout/notifications-footer.jsp" %>--%>
        <%@ include file="/includes/decorators/aui-layout/footer.jsp" %>
    </footer>
</div>
<%@ include file="/includes/decorators/aui-layout/endbody-resources.jsp" %>
</body>
</html>
