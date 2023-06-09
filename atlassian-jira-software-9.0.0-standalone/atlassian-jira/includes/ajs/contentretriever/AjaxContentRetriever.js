define('jira/ajs/contentretriever/ajax-content-retriever', ['jira/ajs/contentretriever/content-retriever', 'jira/ajs/ajax/smart-ajax', 'jquery'], function (ContentRetriever, SmartAjax, $) {
    'use strict';

    /**
     * A content retrieval class, that provides a common interface to build and access a jQuery wrapped content element via
     * ajax.
     *
     * @class AJAXContentRetriever
     * @extends ContentRetriever
     * @deprecated use {@link AJS.ProgressiveDataSet} instead.
     * @see AJS.ProgressiveDataSet
     */

    return ContentRetriever.extend({

        /**
         * @param {Object | String} options - if string treats it as the url to request. Otherwise object will be the same as
         * jQuery ajax options (you can see there documentation) apart from a few exceptions:
         * @param {Function} options.formatSuccess - This will be passed the response data after the ajax request and should return
         * @param {Function} options.formatError - This will be passed the response data after the ajax request an error
         * a jQuery wrapped element that was build from the data.
         * @param {Boolean} options.cache - If this flag is set to true, only one request will ever take place
         * @constructs
         */
        init: function init(options) {
            this.ajaxOptions = options;

            if (!this.ajaxOptions.requestDelay && this.ajaxOptions.requestDelay !== 0) {
                this.ajaxOptions.requestDelay = 75;
            }
        },

        /**
         *
         * @returns {Object}
         */
        getAjaxOptions: function getAjaxOptions() {
            var ajaxOptions;
            var instance = this;

            if (typeof this.ajaxOptions === "string") {
                ajaxOptions = {
                    url: this.ajaxOptions
                };
            } else if ($.isFunction(this.ajaxOptions)) {
                ajaxOptions = this.ajaxOptions();
            } else {
                ajaxOptions = this.ajaxOptions;
            }

            ajaxOptions.globalThrobber = false;

            ajaxOptions.success = function (data, textStatus, xhr) {
                instance._requestComplete(xhr, textStatus, data, true, null);
            };

            ajaxOptions.error = function (xhr, textStatus) {
                if (xhr.rc) {
                    // TODO Consider cleaning this up when we upgrade to AG trunk.
                    // Gadgets return their own object with only rc (the status code) guaranteed to exist.
                    xhr.status = xhr.rc;
                }
                instance._requestComplete(xhr, textStatus, null, false, null);
            };

            return ajaxOptions;
        },

        /**
         * Retreives/Gets/Sets content.
         *
         * @param {Function | jQuery} arg
         */
        content: function content(arg) {

            if ($.isFunction(arg)) {

                this.callback = arg;
                this._makeRequest(arg);
            } else if (arg) {

                if (this.callback) {
                    this.callback(arg);
                    delete this.callback;
                }
            }

            return this.$content;
        },

        /**
         * Starting request, used to set a call starting callbacks
         *
         * @param {Function} callback
         */
        startingRequest: function startingRequest(callback) {
            if (callback) {
                this.startingCallback = callback;
            } else if (this.startingCallback) {
                this.locked = true;
                this.startingCallback();
            }
        },

        /**
         * Finished request, call callbac
         *
         * @param {Function} callback
         */
        finishedRequest: function finishedRequest(callback) {
            if (callback) {
                this.finishedCallback = callback;
            } else if (this.finishedCallback) {
                this.locked = false;
                this.finishedCallback();
            }
        },

        /**
         * Failed request, call callback
         *
         * @param {Function} callback
         */
        failedRequest: function failedRequest(callback) {
            if (callback) {
                this.failedCallback = callback;
            } else if (this.failedCallback) {
                this.locked = false;
                this.failedCallback();
            }
        },

        /**
         * Get/Set caching settings
         *
         * @return {Boolean}
         */
        cache: function cache(_cache) {
            if (typeof _cache !== "undefined") {
                this.getAjaxOptions().cache = _cache;
            }
            return this.getAjaxOptions().cache;
        },

        /**
         * Is a request still outstanding. Can another request take place.
         *
         * @return {Boolean}
         */
        isLocked: function isLocked() {
            return this.locked;
        },

        /**
         * Called when request has complete
         *
         * @protected
         */
        _requestComplete: function _requestComplete(xhr, statusText, data, successful) {
            if (statusText === "abort") {
                this.locked = false;
                return;
            }

            var $content;
            var smartAjaxResult;
            var ajaxOptions = this.getAjaxOptions();

            if (SmartAjax.SmartAjaxResult) {
                smartAjaxResult = SmartAjax.SmartAjaxResult.apply(window, arguments);
            }

            if (successful) {

                if ($.isFunction(ajaxOptions.formatSuccess)) {
                    $content = ajaxOptions.formatSuccess(data);
                } else {
                    $content = $("<div>" + data + "</div>");
                }
            } else {

                if ($.isFunction(ajaxOptions.formatError)) {
                    $content = ajaxOptions.formatError(data);
                } else if (smartAjaxResult) {
                    var errorClass = smartAjaxResult.status === 401 ? 'aui-message-warning' : 'aui-message-error';
                    $content = $('<div class="aui-message ' + errorClass + '">' + SmartAjax.buildSimpleErrorContent(smartAjaxResult) + '</div>');
                }
                this.failedRequest();
            }

            this.content($content);

            this.finishedRequest();
        },

        /**
         * Issues request
         *
         * @protected
         */
        _makeRequest: function _makeRequest() {
            var instance = this;

            if (this.outstandingRequest) {
                this.outstandingRequest.abort();
                this.outstandingRequest = null;
            }

            clearTimeout(this._queuedRequest);

            if (this.isLocked()) {
                this._queuedRequest = setTimeout(function () {
                    instance._makeRequest();
                }, this.ajaxOptions.requestDelay);
            } else {
                doRequest();
            }

            function doRequest() {
                instance.startingRequest();
                instance.outstandingRequest = $.ajax(instance.getAjaxOptions());
            }
        }

    });
});

AJS.namespace('AJS.AjaxContentRetriever', null, require('jira/ajs/contentretriever/ajax-content-retriever'));