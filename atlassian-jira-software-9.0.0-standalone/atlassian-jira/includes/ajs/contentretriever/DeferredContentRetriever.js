define('jira/ajs/contentretriever/deferred-content-retriever', ['jira/ajs/contentretriever/content-retriever', 'jquery', 'underscore'], function (ContentRetriever, $, _) {
    'use strict';

    /**
     * A simple content retrieval class, that provides a common interface to access to a provided HTML element
     *
     * @class DeferredContentRetriever
     * @extends ContentRetriever
     * @deprecated use {@link AJS.ProgressiveDataSet} instead.
     * @see AJS.ProgressiveDataSet
     */

    return ContentRetriever.extend({

        /**
         * @param func
         * @constructs
         */
        init: function init(func) {
            this.func = func;
        },

        /**
         * Gets content via invocation or callback
         *
         * @param {Function} callback - if provided executes callback with content being the first argument
         */
        content: function content(callback) {
            if ($.isFunction(callback)) {
                var res = this.func();
                if (res instanceof $) {
                    callback(res);
                } else {
                    res.done(_.bind(function (content) {
                        callback(content);
                    }, this));
                }
            }
        },

        // these methods below are only used by asynchronous content retrievers, however we still need to define them.

        /**
         * Deferred content retrievers never cache.
         * @returns {Boolean} false
         */
        cache: function cache() {
            return false;
        }
    });
});

AJS.namespace('AJS.DeferredContentRetriever', null, require('jira/ajs/contentretriever/deferred-content-retriever'));