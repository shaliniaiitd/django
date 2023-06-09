define('jira/viewissue/element/shorten', ['jira/ajs/shorten/shortener', 'jira/skate'], function (Shortener, skate) {
    'use strict';

    return skate('shorten', {
        type: skate.type.CLASSNAME,
        attached: function attached(element) {
            var options = {};
            options.element = element;
            new Shortener(options);
        }
    });
});