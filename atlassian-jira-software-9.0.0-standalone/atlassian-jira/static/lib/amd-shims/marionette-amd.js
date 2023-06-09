/**
 * AMD module for Marionette 1.6.4
 *
 * @deprecated Please use newer versions of Marionette
 */
define('marionette', ['require'], function (require) {
    'use strict';

    var marionetteFactory = require('atlassian/libs/factories/marionette-1.6.4');
    var Backbone = require('backbone');
    var _ = require('underscore');

    var marionette = marionetteFactory(_, Backbone);

    var marionetteMixins = require('jira/marionette/marionette.mixins');
    _.extend(marionette.View.prototype, marionetteMixins.viewExtensions);

    return marionette;
});

AJS.namespace('Backbone.Marionette', null, require('marionette'));