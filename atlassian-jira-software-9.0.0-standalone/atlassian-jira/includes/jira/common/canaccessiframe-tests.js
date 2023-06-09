AJS.test.require(["jira.webresources:util-lite"], function () {
    'use strict';

    var jQuery = require("jquery");
    var baseURL = window.location.href.replace(/(.*)qunit.*/, "$1");

    module("canAccessIframe", {
        setup: function setup() {
            this.context = AJS.test.mockableModuleContext();
            this.context.mock("aui/params", {
                baseURL: baseURL
            });
        }
    });

    test("Access Granted", function () {
        var incorrectProtocal = baseURL.replace("http:", "https:");
        var canAccessIframe = this.context.require("jira/util/browser").canAccessIframe;

        ok(!canAccessIframe(jQuery("<iframe src='http://www.realsurf.com' />")), "http://www.realsurf.com - Access Refused");
        ok(!canAccessIframe(jQuery("<iframe src='" + baseURL.replace(/(.*)(:\d+)(.*)/, "$1:9999$2") + "' />")), "Expected incorrect port to refuse access");
        ok(!canAccessIframe(jQuery("<iframe src='" + incorrectProtocal + "' />")), incorrectProtocal + " (incorrect protocal)");
    });

    test("Access Refused", function () {
        var canAccessIframe = this.context.require("jira/util/browser").canAccessIframe;
        ok(canAccessIframe(jQuery("<iframe src='" + baseURL + "' />")), baseURL);
        ok(canAccessIframe(jQuery("<iframe src='/test.html' />")), "/test.html");
        ok(canAccessIframe(jQuery("<iframe src='test.html' />")), "test.html");
    });
});