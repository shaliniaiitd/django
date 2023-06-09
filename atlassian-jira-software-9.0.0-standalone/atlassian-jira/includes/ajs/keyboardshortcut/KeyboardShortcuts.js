var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

define('jira/ajs/keyboardshortcut/keyboard-shortcut', ['jira/util/formatter', 'jira/util/key-code', 'aui/inline-dialog', 'wrm/context-path', 'jira/jquery/deferred', 'jquery', 'underscore'], function (formatter, keyCodes, InlineDialog, wrmContextPath, Deferred, jQuery, _) {
    'use strict';

    var contextPath = wrmContextPath();

    /**
     * Metaprogramming object for keyboard shortcut actions
     * @class KeyboardShortcut
     * @param {string} shortcut
     */
    var KeyboardShortcut = function KeyboardShortcut(shortcut, ctx) {
        this._executer = null;
        this.shortcuts = [shortcut];
        this._bindShortcut(shortcut, ctx);
    };

    /*
     * Is resolved once shortcuts are initialised via fromJSON
     */
    var keyboardShortcutInit = new Deferred();

    KeyboardShortcut.prototype._bindShortcut = function (shortcut, ctx) {
        if (typeof shortcut !== "string") {
            throw new TypeError("KeyboardShortcut expects string; received " + (typeof shortcut === 'undefined' ? 'undefined' : _typeof(shortcut)));
        }
        if (/^(?:ctrl|alt|shift|meta)+/i.test(shortcut)) {
            throw new SyntaxError('KeyboardShortcut cannot bind the shortcut "' + shortcut + '" because it uses a modifier');
        }
        var self = this;
        jQuery(document).bind("shortcut", shortcut, function (event) {
            if (self._executer && !self._ignoreShortcut(event, shortcut, ctx)) {
                if (InlineDialog.current) {
                    // If there's an inline dialog shown, hide it, since you'll loose focus on the inline
                    // dialog anyway as soon as keys are pressed. @see JRADEV-2323
                    InlineDialog.current.hide();
                }
                self._executer(event);
                event.preventDefault();
            }
        });
    };

    /**
     * Should this invocation of a shortcut be ignored.
     * @param event
     * @param shortcut
     * @param ctx
     * @return {boolean}
     * @private
     */
    KeyboardShortcut.prototype._ignoreShortcut = function (event, shortcut, ctx) {
        var ignore = false;
        _.each(KeyboardShortcut._ignoreConditions, function (condition) {
            if (condition(event, shortcut, ctx)) {
                ignore = true;
            }
        });
        return ignore;
    };

    KeyboardShortcut.prototype._addShortcutTitle = function (selector) {
        var elem = jQuery(selector);
        var title = elem.attr("title") || "";
        var typeStr = formatter.I18n.getText("keyboard.shortcuts.type");
        var thenStr = formatter.I18n.getText("keyboard.shortcuts.then");
        var orStr = formatter.I18n.getText("keyboard.shortcuts.or");
        var shortcuts = jQuery.map(this.shortcuts, function (shortcut) {
            return " '" + shortcut.split("").join("' " + thenStr + " '") + "'";
        });
        var toAppend = " ( " + typeStr + shortcuts.join(" " + orStr + " ") + " )";
        if (!title.includes(toAppend)) {
            title += toAppend;
        }
        elem.attr("title", title);
    };

    /**
     * Scrolls to and adds "focused" class to the next item in the jQuery collection
     * @param selector
     */
    KeyboardShortcut.prototype.moveToNextItem = function (selector) {
        this._executer = function () {
            var index;
            var items = jQuery(selector);
            var focusedElem = jQuery(selector + ".focused");

            if (!this._executer.blurHandler) {
                jQuery(document).one("keypress", function (e) {
                    if (e.keyCode === keyCodes.ESCAPE && focusedElem) {
                        focusedElem.removeClass("focused");
                    }
                });
            }

            if (focusedElem.length === 0) {
                focusedElem = jQuery(selector).eq(0);
            } else {
                focusedElem.removeClass("focused");
                index = jQuery.inArray(focusedElem.get(0), items);
                if (index < items.length - 1) {
                    index = index + 1;
                    focusedElem = items.eq(index);
                } else {
                    focusedElem.removeClass("focused");
                    focusedElem = jQuery(selector).eq(0);
                }
            }
            if (focusedElem && focusedElem.length > 0) {
                focusedElem.addClass("focused");
                focusedElem.scrollIntoView();
                focusedElem.find("a:first").focus();
            }
        };
    };

    /**
     * Scrolls to and adds "focused" class to the previous item in the jQuery collection
     * @param selector
     */
    KeyboardShortcut.prototype.moveToPrevItem = function (selector) {
        this._executer = function () {
            var index;
            var items = jQuery(selector);
            var focusedElem = jQuery(selector + ".focused");

            if (!this._executer.blurHandler) {
                jQuery(document).one("keypress", function (e) {
                    if (e.keyCode === keyCodes.ESCAPE && focusedElem) {
                        focusedElem.removeClass("focused");
                    }
                });
            }

            if (focusedElem.length === 0) {
                focusedElem = jQuery(selector + ":last");
            } else {
                focusedElem.removeClass("focused");
                index = jQuery.inArray(focusedElem.get(0), items);
                if (index > 0) {
                    index = index - 1;
                    focusedElem = items.eq(index);
                } else {
                    focusedElem.removeClass("focused");
                    focusedElem = jQuery(selector + ":last");
                }
            }
            if (focusedElem && focusedElem.length > 0) {
                focusedElem.addClass("focused");
                focusedElem.scrollIntoView();
                focusedElem.find("a:first").focus();
            }
        };
    };

    /**
     * Clicks the element matched by the selector
     * @param {string} selector -- jQuery selector for element
     */
    KeyboardShortcut.prototype.click = function (selector) {
        this._addShortcutTitle(selector);

        this._executer = function () {
            var elem = jQuery(selector).eq(0);
            if (elem.length > 0) {
                elem.click();
            }
        };
    };

    /**
     * Navigates to specified location
     * @param {string} location -- URL
     */
    KeyboardShortcut.prototype.goTo = function (location) {
        this._executer = function () {
            window.location.href = contextPath + location;
        };
    };

    /**
     * Navigates browser window to link href
     * @param {string} selector - jQuery selector for element
     */
    KeyboardShortcut.prototype.followLink = function (selector) {
        this._addShortcutTitle(selector);
        this._executer = function () {
            var elem = jQuery(selector).eq(0);
            if (elem.length > 0 && (elem.prop("nodeName").toLowerCase() === "a" || elem.prop("nodeName").toLowerCase() === "link")) {
                elem.click();
                window.location.href = elem.attr("href");
            }
        };
    };

    /**
     * Scrolls to element if out of view, then clicks it.
     * @param {string} selector - jQuery selector for element
     */
    KeyboardShortcut.prototype.moveToAndClick = function (selector) {
        this._addShortcutTitle(selector);
        this._executer = function () {
            var elem = jQuery(selector).eq(0);
            if (elem.length > 0) {
                elem.click();
                elem.scrollIntoView();
            }
        };
    };

    /**
     * Scrolls to element if out of view, then focuses it
     * @param {string} selector - jQuery selector for element
     */
    KeyboardShortcut.prototype.moveToAndFocus = function (selector) {
        this._addShortcutTitle(selector);
        this._executer = function (e) {
            var $elem = jQuery(selector).eq(0);
            if ($elem.length > 0) {
                $elem.focus();
                $elem.scrollIntoView();
                if ($elem.is(':input')) {
                    e.preventDefault();
                }
            }
        };
    };

    /**
     * Executes the javascript provided by the shortcut plugin point on page load
     * @param {function} command - the function provided by the shortcut key plugin point
     */
    KeyboardShortcut.prototype.evaluate = function (command) {
        if (typeof command !== "function") {
            command = new Function(command);
        }
        command.call(this);
    };

    /**
     * Executes the javascript provided by the shortcut plugin point when the shortcut is invoked
     * @param {function} func
     */
    KeyboardShortcut.prototype.execute = function (func) {
        var self = this;
        this._executer = function () {
            if (typeof func !== "function") {
                func = new Function(func);
            }
            func.call(self);
        };
    };

    /**
     * Bind another shortcut sequence
     * @param {string} shortcut - keys to bind
     * @return {KeyboardShortcut}
     */
    KeyboardShortcut.prototype.or = function (shortcut) {
        this.shortcuts.push(shortcut);
        this._bindShortcut(shortcut);
        return this;
    };

    // Static methods.

    KeyboardShortcut._ignoreConditions = [];
    KeyboardShortcut._shortcuts = [];

    Object.defineProperty(KeyboardShortcut, 'initialised', {
        value: keyboardShortcutInit.promise(),
        writable: false,
        configurable: false
    });

    /**
     * Adds a condition to be evaluated when we type a shortcut. If this condition returns false
     * then the shortcut will be ignored.
     * @param func
     */
    KeyboardShortcut.addIgnoreCondition = function (func) {
        KeyboardShortcut._ignoreConditions.push(func);
    };

    KeyboardShortcut.getKeyboardShortcutKeys = function (moduleKey) {
        for (var index in KeyboardShortcut._shortcuts) {
            if (Object.prototype.hasOwnProperty.call(KeyboardShortcut._shortcuts, index)) {
                var shortcut = KeyboardShortcut._shortcuts[index];
                if (shortcut.moduleKey === moduleKey) {
                    return shortcut.keys.toString();
                }
            }
        }
        return null;
    };

    /**
     * Registers keyboard shortcuts via a JSON string
     * @param {String} json
     * @returns {Object} key-value pairs of keyboard shortcut strings and their associated {@link KeyboardShortcut}
     */
    KeyboardShortcut.fromJSON = function (json) {
        var activeShortcuts;
        if (json) {
            // Set data internally
            KeyboardShortcut._shortcuts = json;

            // Instantiate shortcuts
            activeShortcuts = {};

            _.each(json, function (item) {
                var keys = _.flatten(item.keys);
                var shortcut = keys.join("");
                if (keys.length < shortcut.length) {
                    throw new Error("Shortcut sequence [" + keys.join(",") + "] contains invalid keys");
                }
                var kbShorctut = activeShortcuts[shortcut] = new KeyboardShortcut(shortcut, item.context);
                kbShorctut[item.op](item.param);
            });
        }

        keyboardShortcutInit.resolve(KeyboardShortcut);

        return activeShortcuts;
    };

    return KeyboardShortcut;
});

AJS.namespace('AJS.KeyboardShortcut', null, require('jira/ajs/keyboardshortcut/keyboard-shortcut'));