/**
 * Shifter groups for Issue Actions and Workflow
 */
require(['jira/util/urls', 'jira/util/formatter', 'wrm/context-path', 'jira/jquery/deferred', 'jquery', 'underscore', 'jira/ajs/ajax/smart-ajax', 'jira/shifter'], function (urls, formatter, wrmContextPath, jQueryDeferred, jQuery, _, SmartAjax, Shifter) {
    'use strict';

    Shifter.register(function () {
        var actionDeferred = jQueryDeferred();
        var workflowDeferred = jQueryDeferred();

        /**
         * Tries, in order, calling a list of functions, stopping
         * after the first function that returns a non-undefined value.
         * This value is returned.
         *
         * @param {Array<String>} fns - function names, can be namespaced.
         * @return {any|undefined} value - undefined if none of the functions returned a non-undefined value.
         */
        function tryGetting(fns) {
            for (var i = 0; i < fns.length; i++) {
                var func = _.reduce(fns[i].split('.'), function (obj, prop) {
                    return obj !== undefined ? obj[prop] : undefined;
                }, window);
                if (_.isFunction(func)) {
                    var value = func();
                    if (value != null) {
                        return value;
                    }
                }
            }
            return undefined;
        }

        // Try getting the issueKey and issueId from different functions
        // Eventually, only the JIRA.Issues functions should be used
        var issueKey = tryGetting(['JIRA.Issues.getSelectedIssueKey', 'JIRA.Issue.getIssueKey', // standalone view-issue without ka.AJAX_VIEW_ISSUE dark feature
        'JIRA.IssueNavigator.getSelectedIssueKey' // classic issuenav
        ]);
        var issueId = tryGetting(['JIRA.Issues.getSelectedIssueKey', 'JIRA.Issue.getIssueId', // standalone view-issue without ka.AJAX_VIEW_ISSUE dark feature
        'JIRA.IssueNavigator.getSelectedIssueId' // classic issuenav
        ]);

        if (issueId == null) {
            return null;
        }

        var url = formatter.format(wrmContextPath() + "/rest/api/1.0/issues/{0}/ActionsAndOperations?atl_token={1}", issueId, urls.atl_token());

        SmartAjax.makeRequest({
            dataType: "json",
            url: url
        }).done(function (response) {
            var actionSuggestions = _.map(response.operations, function (operation) {
                return {
                    label: operation.name,
                    value: {
                        styleClass: operation.styleClass,
                        url: operation.url
                    }
                };
            });
            var workflowSuggestions = _.map(response.actions, function (workflow) {
                var url = wrmContextPath() + "/secure/WorkflowUIDispatcher.jspa?id=" + response.id + "&action=" + workflow.action + "&atl_token=" + response.atlToken;
                return {
                    label: workflow.name,
                    value: {
                        styleClass: 'issueaction-workflow-transition',
                        url: url
                    }
                };
            });
            actionDeferred.resolve(actionSuggestions);
            workflowDeferred.resolve(workflowSuggestions);
        }).fail(function (jqXHR, textStatus) {
            var errorMsg;
            if (JIRA && JIRA.Templates && JIRA.Templates.ViewIssue && JIRA.Templates.ViewIssue.Body && JIRA.Templates.ViewIssue.Body.errorsLoading) {
                //If we have the template for the cog error, use it
                errorMsg = JIRA.Templates.ViewIssue.Body.errorsLoading({
                    isTimeout: textStatus === "timeout"
                });
            } else {
                //If not, show the generic error
                errorMsg = formatter.I18n.getText("issuepicker.find.issue.error");
            }

            actionDeferred.resolve([{
                label: errorMsg,
                messageID: 'error-loading-issue',
                useAUI: false,
                isMessage: true
            }]);
            workflowDeferred.reject();
        });

        var onSelection = function onSelection(value, label) {
            var $dialogTrigger = jQuery('<a>', {
                text: label,
                'class': value.styleClass,
                href: value.url,
                css: {
                    display: 'none'
                }
            });
            $dialogTrigger.appendTo('body').get(0).click();
            $dialogTrigger.remove();
        };

        return [{
            id: 'issue-actions',
            name: formatter.I18n.getText("shifter.group.issueactions"),
            context: issueKey,
            weight: 200,
            getSuggestions: function getSuggestions() {
                return actionDeferred;
            },
            onSelection: onSelection
        }, {
            id: 'issue-transitions',
            name: formatter.I18n.getText("opsbar.more.transitions"),
            context: issueKey,
            weight: 220,
            getSuggestions: function getSuggestions() {
                return workflowDeferred;
            },
            onSelection: onSelection
        }];
    });
});