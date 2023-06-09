AJS.test.require(["jira.webresources:manageshared"], function () {
    'use strict';

    var $ = require("jquery");

    var href1 = "/jira/secure/ConfigurePortalPages.jspa?view=favourites";
    var href2 = "/jira/secure/ConfigurePortalPages.jspa?view=my";

    var utilModuleName = "jira/tabs/tab-manager/util";
    var markup = '<ul class="vertical tabs">' + '<li class="active first-tab"><a href="' + href1 + '">Favourites</a></li>' + '<li class="second-tab"><a href="' + href2 + '">My filters</a></li>' + '</ul>';

    module("TabManager", {
        setup: function setup() {
            this.sandbox = sinon.sandbox.create({
                useFakeServer: true
            });

            $("#qunit-fixture").html(markup);
        },

        tearDown: function tearDown() {
            this.sandbox.restore();
        },

        getMockableContext: function getMockableContext() {
            if (!this.mockableContext) {
                this.mockableContext = AJS.test.mockableModuleContext();
            }

            return this.mockableContext;
        },

        prepareTabManagerUtilStub: function prepareTabManagerUtilStub() {
            this.utilMock = this.sandbox.stub();

            this.utilMock.prototype.constructCompleteUrl = this.sandbox.stub().returns("fake/url");
            this.utilMock.prototype.getTabParamFromUrl = this.sandbox.stub().returns({ param: "fake" });
            this.utilMock.prototype.getTabParamFromUrl.withArgs(href2).returns({ param: "fake2" });
            this.utilMock.prototype.updateInitialUrl = this.sandbox.stub();
            this.utilMock.prototype.replaceHistoryItem = this.sandbox.stub();
            this.utilMock.prototype.saveHistoryItem = this.sandbox.stub();

            this.getMockableContext().mock(utilModuleName, this.utilMock);
        },

        initializeTabManager: function initializeTabManager() {
            this.tabManager = this.getMockableContext().require("jira/tabs/tab-manager");
            this.tabManager.navigationTabs.init({});
        }
    });

    test("navigateToTab() should call tabManagerUtil.saveHistoryItem() if not handling history event", function () {
        this.prepareTabManagerUtilStub();
        this.initializeTabManager();

        var navigateToTab = this.tabManager.navigationTabs._getNavigateToTabFunc();
        var $tab = $(".second-tab");
        navigateToTab($tab, false, $tab.find("a").attr("href"));
        this.sandbox.server.requests[0].respond(200, { "Content-Type": "text/html" }, "");

        sinon.assert.calledOnce(this.tabManager.navigationTabs._getTabManagerUtil().saveHistoryItem);
    });

    test("navigateToTab() shouldn't call tabManagerUtil.saveHistoryItem() if handling history event", function () {
        this.prepareTabManagerUtilStub();
        this.initializeTabManager();

        var navigateToTab = this.tabManager.navigationTabs._getNavigateToTabFunc();
        var $tab = $(".second-tab");
        navigateToTab($tab, true, $tab.find("a").attr("href"));
        this.sandbox.server.requests[0].respond(200, { "Content-Type": "text/html" }, "");

        sinon.assert.notCalled(this.tabManager.navigationTabs._getTabManagerUtil().saveHistoryItem);
    });

    test("init() has default tabParam", function () {
        this.prepareTabManagerUtilStub();
        this.initializeTabManager();

        equal(this.utilMock.args[0][1], "filterView");
    });

    test("init() attempts to add tab parameter to the query string and overwrite current history item", function () {
        this.prepareTabManagerUtilStub();
        this.initializeTabManager();

        sinon.assert.calledOnce(this.tabManager.navigationTabs._getTabManagerUtil().updateInitialUrl);
        sinon.assert.calledOnce(this.tabManager.navigationTabs._getTabManagerUtil().replaceHistoryItem);
    });
});