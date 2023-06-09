var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

/**
 * @fileOverview
 * The {@link AJS.namespace} function is deprecated and not to be used.
 * Please create AMD modules for your code.
 * Read [JIRA's JavaScript Documentation]{@link https://extranet.atlassian.com/display/JIRADEV/JIRA+JavaScript+Documentation} for more.
 *
 * These tests exist to exercise code paths introduced in an effort to deprecate
 * and remove global objects. See [INC-71]{@link https://jdog.jira-dev.com/browse/INC-71} for more.
 */
AJS.test.require(['jira.webresources:lecacy-namespacing'], function () {
    'use strict';

    var baseConfig = require('jira/legacy/config');

    function behaviouralTests(usingObjectDefineProperty) {
        module('AJS.namespace' + (usingObjectDefineProperty ? ' (Object.defineProperty)' : ' (all browsers)'), {
            setup: function setup() {
                this.config = {
                    hasDefineProperty: usingObjectDefineProperty,
                    logDeprecationNotice: false,
                    noGlobals: false
                };
                this.logger = sinon.spy();
                this.context = AJS.test.mockableModuleContext();
                this.context.mock('jira/legacy/config', this.config);
                this.context.mock('jira/legacy/logger', this.logger);
                equal(_typeof(window.foo), 'undefined', 'there should be no global object yet');
            },
            teardown: function teardown() {
                if (window.foo) {
                    delete window.foo;
                }
            }
        });

        test('creates objects in the global namespace', function () {
            var namespacer = this.context.require('jira/legacy/namespace');
            namespacer('foo.bar.baz');
            equal(_typeof(window.foo.bar.baz), 'object', 'should create a global object');
            ok(this.logger.notCalled, 'no messages output in production');
        });

        test('adds values to window by default', function () {
            var namespacer = this.context.require('jira/legacy/namespace');
            var value = function value() {};
            namespacer('foo.bar.baz', null, value);
            equal(window.foo.bar.baz, value, 'should place the function in window');
            ok(this.logger.notCalled, 'no messages output in production');
        });

        test('adds values to specified locations', function () {
            var namespacer = this.context.require('jira/legacy/namespace');
            var value = function value() {};
            var context = {};
            namespacer('foo.bar.baz', context, value);
            equal(context.foo.bar.baz, value, 'should place the function in our specified context');
            ok(this.logger.notCalled, 'no messages output in production');
        });

        test('does not destroy other values on namespace when creating new ones', function () {
            var namespacer = this.context.require('jira/legacy/namespace');
            var value = function value() {};
            var context = {};
            context.foo = function () {};
            context.foo.bar = function () {};
            context.foo.bar.anotherValue = true;
            namespacer('foo.bar.baz', context, value);
            equal(context.foo.bar.baz, value, 'should place the function in our specified context');
            equal(_typeof(context.foo), 'function', 'should not have overridden the value of foo');
            equal(_typeof(context.foo.bar), 'function', 'should not have overridden the value of bar');
            equal(_typeof(context.foo.bar.anotherValue), 'boolean', 'should not have overridden other values on foo.bar');
        });

        test('overrides previous value when creating new one', function () {
            var namespacer = this.context.require('jira/legacy/namespace');
            var value = function value() {};
            var context = { foo: { bar: { baz: { subValue: true } } } };
            namespacer('foo.bar.baz', context, value);
            equal(_typeof(context.foo.bar.baz), 'function', 'value of foo.bar.baz was replaced');
            equal(_typeof(context.foo.bar.baz.subValue), 'undefined', 'does not preserve subValue');
        });
    }

    behaviouralTests(false);

    // If the browser we're running in has Object.defineProperty support, we can run some more tests.
    if (baseConfig.hasDefineProperty) {
        behaviouralTests(true);
    }

    module('AJS.namespace deprecations (all browsers)', {
        setup: function setup() {
            this.config = {
                hasDefineProperty: false, // NOTE: testing browser-independent behaviour by default
                logDeprecationNotice: true, // NOTE: This is on now by default for our tests
                noGlobals: false
            };
            this.logger = sinon.spy();
            this.context = AJS.test.mockableModuleContext();
            this.context.mock('jira/legacy/config', this.config);
            this.context.mock('jira/legacy/logger', this.logger);
            ok(_typeof(window.foo), 'undefined', 'there should be no global object yet');
        },
        teardown: function teardown() {
            if (window.foo) {
                delete window.foo;
            }
        }
    });

    test('logs deprecation notice if the setting is enabled in config', function () {
        var namespacer = this.context.require('jira/legacy/namespace');
        var value = function value() {};
        namespacer('foo.bar.baz', null, value);
        sinon.assert.calledOnce(this.logger);
        sinon.assert.calledWith(this.logger, 'DEPRECATED: The global object foo.bar.baz is deprecated.');
    });

    test('logs alternative usage if value provided via require()', function () {
        var ourValue = function ourValue() {};
        var namespacer = this.context.require('jira/legacy/namespace');
        define('a/fake/module', function () {
            return ourValue;
        });
        namespacer('foo.bar.baz', null, require('a/fake/module'));
        equal(window.foo.bar.baz, ourValue, 'the value of the module is on the global namespace');
        sinon.assert.calledOnce(this.logger);
        sinon.assert.calledWith(this.logger, 'DEPRECATED: The global object foo.bar.baz is deprecated. Please use require(["a/fake/module"]) instead.');
    });

    test('does NOT output a value when noGlobals is enabled in config', function () {
        this.config.noGlobals = true;
        var namespacer = this.context.require('jira/legacy/namespace');
        var value = function value() {};
        namespacer('foo.bar.baz', null, value);
        equal(_typeof(window.foo), 'undefined', 'object was not created');
        sinon.assert.calledOnce(this.logger);
        sinon.assert.calledWith(this.logger, 'GONE: The global object foo.bar.baz was not created!');
    });

    // If the browser we're running in has Object.defineProperty support, we can run some more tests.
    if (baseConfig.hasDefineProperty) {

        module('AJS.namespace deprecations (Object.defineProperty)', {
            setup: function setup() {
                this.config = {
                    hasDefineProperty: true, // NOTE: we'll make use of Object.defineProperty.
                    logDeprecationNotice: true, // NOTE: This is on now by default for our tests
                    noGlobals: false
                };
                this.logger = sinon.spy();
                this.context = AJS.test.mockableModuleContext();
                this.context.mock('jira/legacy/config', this.config);
                this.context.mock('jira/legacy/logger', this.logger);
                ok(_typeof(window.foo), 'undefined', 'there should be no global object yet');
            },
            teardown: function teardown() {
                if (window.foo) {
                    delete window.foo;
                }
            }
        });

        test('logs deprecation notice on access if the setting is enabled in config', function () {
            var namespacer = this.context.require('jira/legacy/namespace');
            var value = sinon.spy();
            namespacer('foo.bar.baz', null, value);
            sinon.assert.notCalled(this.logger);
            window.foo.bar.baz();
            sinon.assert.calledOnce(this.logger);
            sinon.assert.calledWith(this.logger, 'DEPRECATED: The global object foo.bar.baz is deprecated.');
        });
    }
});