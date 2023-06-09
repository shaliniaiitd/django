define('jira/viewissue/watchers-voters/watchers', ['require'], function (require) {
    'use strict';

    var WatchersReadOnlyView = require('jira/viewissue/watchers-voters/views/watchers-read-only-view');
    var WatchersNoBrowseView = require('jira/viewissue/watchers-voters/views/watchers-no-browse-view');
    var WatchersView = require('jira/viewissue/watchers-voters/views/watchers-view');
    var WatchersUsersCollection = require('jira/viewissue/watchers-voters/entities/watchers-user-collection');
    var WatchersInlineDialogView = require('jira/viewissue/watchers-voters/views/watchers-inline-dialog-view');
    var Events = require('jira/util/events');
    var Types = require('jira/util/events/types');
    var Reasons = require('jira/util/events/reasons');
    var Issue = require('jira/issue');
    var InlineDialog = require('aui/inline-dialog');
    var keyCodes = require('jira/util/key-code');
    var $ = require('jquery');

    var dialogView = null;

    function getDialog() {
        if (!dialogView) {
            dialogView = new WatchersInlineDialogView({
                el: $('#inline-dialog-watchers').get(0)
            });
        }
        return dialogView;
    }

    function getView(collection) {
        if (collection.isReadOnly) {
            return WatchersReadOnlyView;
        } else if (collection.canBrowseUsers) {
            return WatchersView;
        } else {
            return WatchersNoBrowseView;
        }
    }

    $(document).on('click', '#view-watcher-list', function (e) {
        e.preventDefault();
        var dialog = getDialog();
        var loadingIcon = $('#watching-toggle').next('.icon');
        var collection = new WatchersUsersCollection(Issue.getIssueKey());
        loadingIcon.addClass('loading');
        var ViewClass = getView(collection);
        new ViewClass({
            collection: collection
        }).render().done(function (viewHtml) {
            loadingIcon.removeClass('loading');
            dialog.contents(viewHtml);
            dialog.show();
        });
        collection.on('errorOccurred', function () {
            dialog.hide();
        });
    });

    $(document).on('keydown', function (e) {
        if (dialogView) {
            // special case for when user hover is open at same time
            if (e.keyCode === keyCodes.ESCAPE && InlineDialog.current !== dialogView.el && dialogView.isVisible()) {
                if (InlineDialog.current) {
                    InlineDialog.current.hide();
                }
                dialogView.hide();
            }
        }
    });

    // JRA-28786 Clicking any whitespace outside of the Watch dialog should dismiss the dialog
    $(document).on('click', function (e) {
        if (dialogView) {
            var watchersDialogOrSuggestionClicked = $(e.target).closest('#inline-dialog-watchers, #watchers-suggestions').length;
            if (watchersDialogOrSuggestionClicked === 0 && dialogView.isVisible()) {
                dialogView.hide();
            }
        }
    });

    Events.bind(Types.NEW_CONTENT_ADDED, function (e, context, reason) {
        //eslint-disable-line @atlassian/jira-event-checks/no-newcontentadded-handlers
        //-- remove existing floating #inline-dialog-watchers before refresh adds another one
        if (reason === Reasons.panelRefreshed && context.is('#peoplemodule')) {
            getDialog().setElement(context.find('#inline-dialog-watchers').get(0));
        }
    });
});