define('jira/admin/user-browser', ['jira/util/formatter', 'jira-help-tips/feature/help-tip', 'jira/togglelist/toggle-list', 'jquery', 'jira/postsetup/announcements-view-lib', 'jira/postsetup/announcements-initializer'], function (formatter, HelpTip, ToggleList, $, Announcements, AnnouncementsInitializer) {
    'use strict';

    var UserBrowser = {};
    var Templates = JIRA.Templates.Admin.UserBrowser;

    UserBrowser.initToggleLists = function () {
        $(".toggle-list").each(function () {
            var $toggleList = $(this);
            var $listContainer = $toggleList.parent();

            new ToggleList({
                more: $toggleList.find("li:gt(4)"),
                showMoreLink: $listContainer.find(".toggle-list__show-more"),
                showLessLink: $listContainer.find(".toggle-list__show-less")
            });
        });
    };

    function initPostSetupAnnouncements(inviteUserSelector) {
        var postSetupAnnouncements = {
            'create.user.mail.properties.setup': new Announcements.Announcement('create.user.mail.properties.setup', Announcements.soyTemplateAnnouncementBody(Templates.userBrowserEmailDiscovery), Announcements.inViewPort(Announcements.findElement(inviteUserSelector)), Announcements.GRAVITY_BELOW, 30, true)
        };
        AnnouncementsInitializer.createFlagsFromDataProvider(postSetupAnnouncements);
    }

    UserBrowser.initNewUsersTip = function (inviteUserSelector, createUserSelector) {
        if (!HelpTip) {
            return;
        }

        var newUsersTip;
        var tipAnchor;
        var inviteUserButton = $(inviteUserSelector);
        var createUserButton = $(createUserSelector);
        var buttonsContainer = createUserButton.parent();
        if (inviteUserButton.length) {
            tipAnchor = $("<div></div>").css({
                "position": "fixed",
                "z-index": " -1",
                "height": "1px",
                "width": "1px",
                "top": buttonsContainer.offset().top + buttonsContainer.height() + 12,
                "left": buttonsContainer.offset().left + buttonsContainer.width() / 2
            }).insertAfter(buttonsContainer);
            newUsersTip = new HelpTip({
                id: "add.new.users",
                title: formatter.I18n.getText("helptips.add.new.users.title"),
                bodyHtml: formatter.I18n.getText("helptips.add.new.users.body"),
                url: createUserButton.data('url'),
                anchor: tipAnchor,
                callbacks: {
                    hide: function hide() {
                        initPostSetupAnnouncements(inviteUserSelector);
                    }
                }
            });
            inviteUserButton.click(function () {
                newUsersTip.dismiss("inviteuser");
            });
            createUserButton.click(function () {
                newUsersTip.dismiss("createuser");
            });

            newUsersTip.show();
            if (newUsersTip.isDismissed()) {
                initPostSetupAnnouncements(inviteUserSelector);
            }
        }
    };

    return UserBrowser;
});