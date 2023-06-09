<%@ taglib uri="webwork" prefix="ww" %>
<%@ taglib uri="webwork" prefix="ui" %>
<%@ taglib uri="webwork" prefix="aui" %>
<%@ taglib uri="sitemesh-page" prefix="page" %>

<%  // don't show ANYTHING to the user if they come here looking for trouble
    if (com.atlassian.jira.util.JiraUtils.isSetup())
    {
%>
<%--
Leave this as a raw HTML. Do not use response.getWriter() or response.getOutputStream() here as this will fail
on Orion. Let the application server figure out how it want to output this text.
--%>
Jira has already been set up.
<%
}
else
{
%>
<html>
<head>
    <title><ww:text name="'setup.title'"/></title>
</head>

<body class="jira-setup-license-page">
<page:applyDecorator id="jira-setupwizard" name="auiform">
    <page:param name="action">SetupLicense.jspa</page:param>
    <page:param name="useCustomButtons">true</page:param>

    <aui:component template="formHeading.jsp" theme="'aui'">
        <aui:param name="'text'"><ww:text name="'setupLicense.title'"/></aui:param>
    </aui:component>

    <div>
        <p>
            <ww:text name="'setupLicense.desc'">
                <ww:param name="'value0'"><a href="http://<ww:text name="'setupLicense.mac.url'"/>" target="_blank" rel="noopener noreferrer">MyAtlassian</a></ww:param>
            </ww:text>
        </p>
    </div>

    <div id="license-input-container" class="license-input-container hidden">
        <%-- content gets added via soy template call in setup-license.js --%>
    </div>

</page:applyDecorator>

<div id="hidden-license-setup" class="hidden">
    <div id="mac-redirect" data-mac-redirect-url="<ww:property value="/macRedirect"/>"></div>
    <form method="post" id="setupLicenseForm" action="SetupLicense.jspa">
        <input name="setupLicenseKey" id="setupLicenseKey" value="<ww:property value="/licenseString"/>"/>

        <ui:component name="'atl_token'" value="/xsrfToken" template="hidden.jsp" />

        <aui:component theme="'aui'" template="formSubmit.jsp">
            <aui:param name="'id'">jira-setupwizard-submit</aui:param>
            <aui:param name="'submitButtonName'">next</aui:param>
            <aui:param name="'submitButtonCssClass'">aui-button-primary</aui:param>
        </aui:component>
    </form>
</div>
</body>
</html>
<% } %>
