<%@ page import="com.atlassian.jira.web.exception.InvalidDirectJspCallException" %>
<%@ page import="webwork.action.ActionContext" %>
<%@ taglib uri="webwork" prefix="ww" %>
<%@ taglib uri="webwork" prefix="aui" %>
<%@ taglib uri="webwork" prefix="ui" %>
<%
    if (ActionContext.getValueStack().findValue("/") == null)
    {
        throw new InvalidDirectJspCallException("Calling logout.jsp directly. This is no longer supported.", "logout.jsp");
    }
%>
<html>
<head>
    <title><ww:text name="'logout.title'"/></title>
    <meta name="decorator" content="login" />
</head>
<body>
    <div class="form-body">
        <ui:soy moduleKey="'jira.webresources:soy-templates'" template="'JIRA.Templates.Headers.pageHeader'">
            <ui:param name="'mainContent'">
                <h1><ww:text name="'logout.title'"/></h1>
            </ui:param>
        </ui:soy>
        <aui:component template="auimessage.jsp" theme="'aui'">
            <aui:param name="'messageType'">info</aui:param>
            <aui:param name="'titleText'"><ww:text name="'logout.desc.line1'" /></aui:param>
            <aui:param name="'messageHtml'">
                <p>
                    <ww:text name="'logout.desc.line2'">
                        <ww:param name="'value0'"><a href="<%= request.getContextPath() %>/login.jsp"></ww:param>
                        <ww:param name="'value1'"></a></ww:param>
                    </ww:text>
                </p>
            </aui:param>
        </aui:component>
    </div>
</body>
</html>
