define('jira/viewissue/watchers-voters/entities/watchers-user-collection', ['jira/viewissue/watchers-voters/entities/user-collection', 'jira/util/data/meta'], function (WatchersAndVoterUsers, Meta) {
    'use strict';

    return WatchersAndVoterUsers.extend({
        initialize: function initialize(issueKey) {
            this.canBrowseUsers = Meta.get("can-search-users");
            this.isReadOnly = !Meta.get("can-edit-watchers");

            // add options for the underlying Collection
            var options = { issueKey: issueKey, endpoint: "watchers", modelKey: "watchers" };
            // super initialize
            WatchersAndVoterUsers.prototype.initialize.apply(this, [options]);
        },

        addWatcher: function addWatcher(user) {
            return this.ajax({ type: "POST", data: '"' + user + '"' });
        },

        removeWatcher: function removeWatcher(user) {
            return this.ajax({ type: "DELETE", url: this.url() + "?username=" + user });
        }
    });
});