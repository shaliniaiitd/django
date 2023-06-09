var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

define('jira/ajs/control', ['jira/lib/class', 'jquery'], function (Class, jQuery) {
    'use strict';

    /**
     * An abstract class, providing utility methods helpful when building controls
     * @class Control
     * @extends Class
     */

    return Class.extend({

        /**
         * @static
         */
        INVALID: "INVALID",

        /**
         * An error for people trying to access private properties
         *
         * @param property - property attempted to be read
         */
        _throwReadOnlyError: function _throwReadOnlyError(property) {
            new Error(this.CLASS_SIGNATURE + ": Sorry [" + property + "] is a read-only property");
        },

        /**
         * Allows binding of multiple events via a group. Event groups are stored under the _events property of the class.
         *
         * @protected
         * @param {String} group - name of object group containing events
         * @param {String | HTMLElement | jQuery} $target - element to bind events to
         */
        _assignEvents: function _assignEvents(group, $target) {
            this._unassignEvents(group, $target); // Prevent duplicate event handlers.
            if (typeof $target === "string") {
                for (var eventType in this._events[group]) {
                    // eslint-disable-line guard-for-in
                    jQuery(document).delegate($target, eventType, this._getDispatcher(group, eventType));
                }
            } else {
                $target = jQuery($target);
                for (var _eventType in this._events[group]) {
                    // eslint-disable-line guard-for-in
                    $target.bind(_eventType, this._getDispatcher(group, _eventType));
                }
            }

            return this;
        },

        /**
         * Allows unbinding of multiple events via a group. Event groups are stored under the _events property of the class.
         *
         * @protected
         * @param {String} group - name of object group containing events
         * @param {String | HTMLElement | jQuery} $target - element to unbind events from
         */
        _unassignEvents: function _unassignEvents(group, $target) {
            if (typeof $target === "string") {
                for (var eventType in this._events[group]) {
                    // eslint-disable-line guard-for-in
                    jQuery(document).undelegate($target, eventType, this._getDispatcher(group, eventType));
                }
            } else {
                $target = jQuery($target);
                for (var _eventType2 in this._events[group]) {
                    // eslint-disable-line guard-for-in
                    $target.unbind(_eventType2, this._getDispatcher(group, _eventType2));
                }
            }
        },

        /**
         * Helper method for _assignEvents, _unassignEvents
         *
         * @param {string} group
         * @param {string} eventType
         */
        _getDispatcher: function _getDispatcher(group, eventType) {
            var ns = group + "/" + eventType;
            if (!this._dispatchers) {
                this._dispatchers = {};
            }
            if (!this._dispatchers[ns]) {
                var handler = this._events[group][eventType];
                var instance = this;
                this._dispatchers[ns] = function (event) {
                    for (var _len = arguments.length, params = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                        params[_key - 1] = arguments[_key];
                    }

                    return handler.call.apply(handler, [instance, event, jQuery(this), instance].concat(params));
                };
            }
            return this._dispatchers[ns];
        },

        /**
         * @return {Boolean}
         */
        _isValidInput: function _isValidInput() {
            return true;
        },

        /**
         * @description
         *   Handle "aui:keydown" and "input" events, by dispatching them to the corresponding handler
         *   in this.keys or this.onEdit method if the key event may have caused a text field value
         *   to be changed.
         *   @see jquery/plugins/keyevents/keyevents.js for supported keys.
         *
         * @param {Object} event -- event object
         */
        _handleKeyEvent: function _handleKeyEvent(event) {
            if (this._isValidInput(event)) {
                if (event.type === "input") {
                    if (typeof this.onEdit === "function") {
                        this.onEdit(event);
                    }
                } else {
                    var heyHandler = this.keys && this.keys[event.key];
                    if (typeof heyHandler === "function") {
                        heyHandler.call(this, event);
                    }
                }
            }
        },

        /**
         * Appends the class signature to the event name for more descriptive and unique event names.
         *
         * @protected
         * @param {String} methodName
         * @return {String}
         */
        getCustomEventName: function getCustomEventName(methodName) {
            return (this.CLASS_SIGNATURE || "") + "_" + methodName;
        },

        /**
         * Gets default arguments to be passed to the custom event handlers
         *
         * @protected
         * @return {Array}
         */
        _getCustomEventArgs: function _getCustomEventArgs() {
            return [this];
        },

        /**
         * Does the browser support css3 box shadows
         *
         * @return {Boolean}
         */
        _supportsBoxShadow: function _supportsBoxShadow() {
            var s = document.body.style;
            return s.WebkitBoxShadow !== undefined || s.MozBoxShadow !== undefined || s.boxShadow !== undefined;
        },

        /**
         * Overrides default options with user options. If the element property is set to a field set, it will attempt
         * to parse options the options from fieldset
         *
         * @param {Object} options
         * @return {String | undefined} if provided options are invalid, will return {@link Control.INVALID}
         */
        _setOptions: function _setOptions(options) {
            var element;
            var optionsFromDOM;

            options = options || {};

            // just supplied element selector
            if (options instanceof jQuery || typeof options === "string" || (typeof options === 'undefined' ? 'undefined' : _typeof(options)) === "object" && options.nodeName) {
                options = { element: options };
            }

            element = jQuery(options.element);

            optionsFromDOM = element.getOptionsFromAttributes();

            this.options = jQuery.extend(true, this._getDefaultOptions(options), optionsFromDOM, options);
            this.options.element = element;

            if (element.length === 0) {
                return this.INVALID;
            }

            return undefined;
        },

        /**
         * Gets position of caret in field
         *
         * @param {HTMLElement} node
         * @return {Number} The caret position within node, or -1 if some text is selected (and no unique caret position exists).
         */
        getCaret: function getCaret(node) {
            var startIndex = node.selectionStart;

            if (startIndex >= 0) {
                return node.selectionEnd > startIndex ? -1 : startIndex;
            }

            if (document.selection) {
                var textRange1 = document.selection.createRange();

                if (textRange1.text.length === 0) {
                    var textRange2 = textRange1.duplicate();

                    textRange2.moveToElementText(node); // Set textRange2 to select all text in node.
                    textRange2.setEndPoint("EndToStart", textRange1); // Set the end point of textRange2 to the start point of textRange1.

                    return textRange2.text.length;
                }
            }

            return -1;
        },

        /**
         * Delegates DOM rendering
         *
         * @protected
         * @return {jQuery}
         */
        _render: function _render() {
            var i;
            var name = arguments[0];
            var args = [];

            for (i = 1; i < arguments.length; i++) {
                args.push(arguments[i]);
            }

            return this._renders[name].apply(this, args);
        }
    });
});

AJS.namespace('AJS.Control', null, require('jira/ajs/control'));