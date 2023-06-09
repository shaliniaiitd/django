AJS.test.require("jira.webresources:util-lite", function () {
    'use strict';

    var Assistive;
    var assert = sinon.assert;

    function stubDiv() {
        var innerTextStub = sinon.stub();
        var textContentStub = sinon.stub();
        var divStub = {
            innerText: "",
            textContent: "",
            setAttribute: sinon.stub(),
            innerTextStub: innerTextStub,
            textContentStub: textContentStub
        };
        Object.defineProperty(divStub, "innerText", { set: innerTextStub });
        Object.defineProperty(divStub, "textContent", { set: textContentStub });
        return divStub;
    }

    module("Assistive", {
        setup: function setup() {
            this.context = AJS.test.mockableModuleContext();
            this.sandbox = sinon.sandbox.create();
            this.sandbox.useFakeTimers();

            this.divStub = stubDiv();
            this.sandbox.stub(document, "createElement").returns(this.divStub);
            this.sandbox.stub(document.body, "appendChild");

            Assistive = this.context.require('jira/util/assistive');
        },
        teardown: function teardown() {
            this.sandbox.restore();
        }
    });

    test("#wait should execute a callback with timeout needed for screen reader to react", function () {
        var spy = sinon.spy();
        Assistive.wait(spy);

        assert.notCalled(spy);

        this.sandbox.clock.tick(50);

        assert.calledOnce(spy);
    });

    test("#readText should create element and set it's text on first call", function () {
        Assistive.readText("test");

        assert.calledOnce(document.createElement);
        equal(this.divStub.textContentStub.lastCall.args[0], " ", "Element's content is empty.");

        this.sandbox.clock.tick(50);

        equal(this.divStub.textContentStub.lastCall.args[0], "test", "Element's content is set to the parameter value.");
    });

    test("#readText should use existing element and set it's text on 2nd+ call", function () {
        Assistive.readText("test");
        this.sandbox.clock.tick(50);

        assert.calledOnce(document.createElement);

        Assistive.readText("test2");

        assert.calledOnce(document.createElement);

        this.sandbox.clock.tick(50);

        equal(this.divStub.textContentStub.lastCall.args[0], "test2", "Element's content is set to the parameter value.");
    });

    test("#readText set element's text using innerText in IE", function () {
        this.context.mock('jira/util/navigator', { isIE: function isIE() {
                return true;
            } });
        var Assistive = this.context.require('jira/util/assistive');

        Assistive.readText("test");
        this.sandbox.clock.tick(50);

        assert.calledTwice(this.divStub.innerTextStub);
        assert.notCalled(this.divStub.textContentStub);
    });

    test("#readText set element's text using textContent in other browsers", function () {
        Assistive.readText("test");
        this.sandbox.clock.tick(50);

        assert.notCalled(this.divStub.innerTextStub);
        assert.calledTwice(this.divStub.textContentStub);
    });

    test("#createOrUpdateLabel should create element with consecutive id and set it's text when called without id", function () {
        Assistive.createOrUpdateLabel("test");

        assert.calledOnce(document.createElement);
        equal(this.divStub.textContentStub.lastCall.args[0], "test", "Element's content is empty.");
        assert.calledWith(this.divStub.setAttribute, "id", "label-0");

        Assistive.createOrUpdateLabel("test2");

        assert.calledTwice(document.createElement);
        equal(this.divStub.textContentStub.lastCall.args[0], "test2", "Element's content is empty.");
        assert.calledWith(this.divStub.setAttribute, "id", "label-1");
    });

    test("#createOrUpdateLabel should create element with specific and set it's text on first call when called with id", function () {
        Assistive.createOrUpdateLabel("test", "custom-id");

        assert.calledOnce(document.createElement);
        equal(this.divStub.textContentStub.lastCall.args[0], "test", "Element's content is empty.");
        assert.calledWith(this.divStub.setAttribute, "id", "custom-id");
    });

    test("#createOrUpdateLabel should use existing element and set it's text on 2nd+ call when called with id", function () {
        Assistive.createOrUpdateLabel("test", "custom-id");

        assert.calledOnce(document.createElement);
        equal(this.divStub.textContentStub.lastCall.args[0], "test", "Element's content is empty.");
        assert.calledWith(this.divStub.setAttribute, "id", "custom-id");

        this.sandbox.stub(document, "getElementById").withArgs("custom-id").returns(this.divStub);
        Assistive.createOrUpdateLabel("test2", "custom-id");

        assert.calledOnce(document.createElement);
        equal(this.divStub.textContentStub.lastCall.args[0], "test2", "Element's content is empty.");
    });

    test("#createOrUpdateLabel should set element's text using innerText in IE", function () {
        this.context.mock('jira/util/navigator', { isIE: function isIE() {
                return true;
            } });
        var Assistive = this.context.require('jira/util/assistive');

        Assistive.createOrUpdateLabel("test");
        this.sandbox.clock.tick(50);

        assert.calledOnce(this.divStub.innerTextStub);
        assert.notCalled(this.divStub.textContentStub);
    });

    test("#createOrUpdateLabel should set element's text using textContent in other browsers", function () {
        Assistive.createOrUpdateLabel("test");
        this.sandbox.clock.tick(50);

        assert.notCalled(this.divStub.innerTextStub);
        assert.calledOnce(this.divStub.textContentStub);
    });
});