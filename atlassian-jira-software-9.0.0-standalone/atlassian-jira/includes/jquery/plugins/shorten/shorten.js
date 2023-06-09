define('jira/ajs/shorten/shortener', ['jira/util/formatter', 'jira/ajs/control', 'jira/data/local-storage', 'jquery'], function (formatter, Control, localStorage, jQuery) {
    /**
     * Shorten long lists with an ellipsis
     *
     * <h4>Use </h4>
     *
     * <h5>Markup:</h5>
     *
     * <pre>
     * <div id="mylist">
     *      <a href='#'>a</a>
     *      <a href='#'>b</a>
     *      <a href='#'>c</a>
     *      <a href='#'>d</a>
     *      <a href='#'>e</a>
     *      <a href='#'>f</a>
     *      <a href='#'>g</a>
     *      <a href='#'>h</a>
     *      <a href='#'>i</a>
     *      <a href='#'>j</a>
     *      <a href='#'>k</a>
     * </div>
     * </pre>
     *
     * <h5>JavaScript</h5>
     *
     * <pre>
     * require(["jira/ajs/shorten/shortener"], function(Shortener) {
     *     // no options
     *     new Shortener("#mylist");
     *
     *     // with options
     *     new Shortener({
     *         element: "#myList",
     *         numRows: 2
     *     });
     * });
     * </pre>
     *
     * @class Shortener
     * @extends Control
     *
     */
    return Control.extend({

        _getDefaultOptions: function _getDefaultOptions() {
            return {
                items: "a, span",
                numRows: 1,
                shortenText: "hide",
                shortenOnInit: true,
                persist: true,
                expandButtonTooltip: formatter.I18n.getText("viewissue.shorten.view.more"),
                collapseButtonTooltip: formatter.I18n.getText("viewissue.shorten.hide")
            };
        },

        /**
         * Creates a shorten control
         *
         * @constructs
         * @param {Object} options
         * @param {String |jQuery} [options.items=a,span] - selector or jQuery collection specifying items
         * @param {Number} [options.numRows=1] - Number of rows to display when shortened
         * @param {String} [options.shortenText=hide] - Text to display in link at the end of the list when expanded
         * @param {Boolean} [options.shortenOnInit=true] - If true will shorten onload
         */
        init: function init(options) {

            if (typeof options === "string") {
                options = { element: options };
            }

            options = options || {};

            this.options = jQuery.extend(this._getDefaultOptions(), options);
            this._timerId = 0;
            this.expanded = false;

            this.$container = jQuery(this.options.element);
            this._assignEvents("body", document.body);
            this._ready();
        },

        /**
         * Validate initialization
         * @return {Boolean}
         */
        _isValid: function _isValid() {
            return !this.initialized && this.$container.is(":visible") && this.$container.children().length > 0;
        },

        /**
         * Lazy initialization, so that we can init on dom ready if it is visible or when a activating a tab makes it visible
         * @private
         */
        _ready: function _ready() {
            if (this._isValid()) {
                this.$container.find('.shortener-expand, .shortener-collapse, br').remove();
                this.$items = this.$container.children(this.options.items);
                this.$expandButton = this._render("expandButton");
                this.$collapseButton = this._render("collapseButton");

                this._assignEvents("expand-button", ".shortener-expand");
                this._assignEvents("collapse-button", ".shortener-collapse");
                this._assignEvents("resize-region", window);

                if (this._isCollapsedOnInit()) {
                    this.collapse();
                } else {
                    this.expand();
                }

                this.initialized = true;
            }
        },

        _renders: {

            /**
             * Creates the jQuery object representing an ellipsis. The ellipsis appended to the shortened list of items. It
             * contains text representing how many items have been hidden. When clicked it reveals the full list.
             * The ellipsis has a class of <strong>ellipsis</strong> and styling should be controlled in css.
             *
             * @method #_renders.expandButton
             * @private
             * @param {number} itemsHidden - number of items hidden
             * @return {jQuery} jQuery wrapped HTML element
             *
             */
            "expandButton": function expandButton() {
                return jQuery("<a href='#' class='ellipsis shortener-expand'></a>").attr("title", this.options.expandButtonTooltip).add("<br>");
            },

            /**
             * Creates the jQuery object representing the shorten tip. The shorten tip is appended to the expanded list of
             * items. When clicked it shortens the list to the user specified paramater <strong>numRows</strong> Ellipsis has
             * a calss of <strong>icon-hide</strong> and styling should be controlled in css.
             *
             * @method #_renders.shortenTip
             * @private
             * @param {string} removeText - number of items hidden
             * @return {jQuery} jQuery wrapped HTML element
             *
             */
            "collapseButton": function collapseButton() {
                return jQuery("<a href='#' title='Hide' class='icon icon-hide shortener-collapse'></a>").append(jQuery("<span>").text(this.options.collapseButtonTooltip));
            }
        },

        _events: {
            "expand-button": {
                "click": function click(event) {
                    if (event.currentTarget === this.$expandButton[0]) {
                        event.preventDefault();
                        this.expand();
                        this._saveState("expanded");
                    }
                }
            },
            "collapse-button": {
                "click": function click(event) {
                    if (event.currentTarget === this.$collapseButton[0]) {
                        event.preventDefault();
                        this.collapse();
                        this._saveState("collapsed");
                        this.$container.scrollIntoView();
                    }
                }
            },
            "resize-region": {
                "resize": function resize() {
                    clearTimeout(this._timerId);
                    if (!this.expanded) {
                        var instance = this;
                        this._timerId = setTimeout(function () {
                            instance.collapse();
                        }, 400);
                    }
                }
            },
            "body": {
                // handling for the case where control is in a tab, and as a result hidden.
                tabSelect: function tabSelect() {
                    this._ready();
                }
            }
        },

        /**
         * @private
         * @param {string} value
         */
        _saveState: function _saveState(value) {
            try {
                localStorage.setItem("AJS.Shortener#" + this.$container.closest("[id]").attr("id"), value);
            } catch (QUOTA_EXCEEDED_ERR) {
                // ignore
            }
        },

        /**
         * @private
         * @return {?string}
         */
        _loadState: function _loadState() {
            return localStorage.getItem("AJS.Shortener#" + this.$container.closest("[id]").attr("id"));
        },

        /**
         * Should list should be shortened on load. This is determined by cookie, if persist options is true, or "shortenOnInit"
         * option. Please not that if persist option is set to true, the list will not be shortened if use has expanded it previously
         * regardless of the shortenOnInit set to true.
         *
         * @private
         * @return boolean
         */
        _isCollapsedOnInit: function _isCollapsedOnInit() {
            var shortenOnInit = this._loadState();
            if (shortenOnInit !== null) {
                return shortenOnInit !== "expanded";
            }
            return this.options.shortenOnInit;
        },

        /**
         * Removes $expandButton and $collapseButton.
         *
         * @private
         */
        _removeButtons: function _removeButtons() {
            this.$expandButton.remove();
            this.$collapseButton.remove();
        },

        /**
         * Get the index within this.$items of the first element that flows over
         * the allowed number of lines, or (-1) if all items fit within the limit.
         *
         * Note: The first item in the list is never considered overflowing, even
         * when it contains several words that might wrap multiple lines, so this
         * function will never return 0.
         *
         * @private
         * @return {number}
         */
        _getOverflowIndex: function _getOverflowIndex() {

            if (this.$items.length > 1) {

                var currentRow = 1;
                var prevItemPageX = -1;

                for (var i = 0; i < this.$items.length; i++) {
                    var itemPageX = this.$items.eq(i).offset().left;
                    if (itemPageX <= prevItemPageX) {
                        // This item flows to a new line.
                        currentRow++;
                        if (currentRow > this.options.numRows) {
                            // This item exceeds the allowed number of lines.
                            return i;
                        }
                    }
                    prevItemPageX = itemPageX;
                }
            }

            return -1;
        },

        /**
         * Expands list to full height, adding a link to shorten
         */
        expand: function expand() {

            this._removeButtons();

            if (this._getOverflowIndex() > 0) {

                this.$collapseButton = this._render("collapseButton");

                this.$container.append(this.$collapseButton);
                this.$container.css("height", "auto");

                // Ensure IE8 renders the new layout.
                if (jQuery.browser.msie && jQuery.browser.version < "9") {
                    jQuery('body').toggleClass('reflow');
                }
            }

            this.expanded = true;
        },

        /**
         * Contracts list to user specified number of rows, adding a link to shorten.
         */
        collapse: function collapse() {

            this._removeButtons();

            var i = this._getOverflowIndex();

            if (i > 0) {
                // Isolate $container in render tree while we make adjustments.
                this.$container.css({
                    "position": "absolute",
                    "visibility": "hidden",
                    "width": this.$container[0].clientWidth + "px"
                });

                var $expandButtonContent = this.$expandButton.first();

                do {
                    var remainingItemCount = this.$items.length - i;

                    $expandButtonContent.text("(" + remainingItemCount + ")");
                    this.$expandButton.insertBefore(this.$items[i]);

                    // Check that $expandButton fits on the same line as the previous item,
                    // otherwise try again with the item before that.
                    i--;

                    var oi = this.$items.eq(i).offset();
                    var ob = this.$expandButton.offset();

                    if (oi.left < ob.left && ob.top < oi.top + 10) {
                        // It fits! We assume $expandButton is on the same line as the previous
                        // item if it's offsetTop is less than a line-height below the item's
                        // offsetTop. Hard-coding 10px is a best approximation of line-height.
                        break;
                    }
                } while (i > 0);

                // Set the $container height required to clip the item immediately after $expandButton.
                var height = i < this.$items.length - 1 ? this.$items.eq(i + 1).offset().top - this.$container.offset().top + "px" : "auto";

                this.$container.css({
                    "height": height,
                    "position": "static",
                    "visibility": "visible",
                    "width": "auto"
                });

                $expandButtonContent.attr("title", formatter.format(this.options.expandButtonTooltip, remainingItemCount));

                // Ensure IE8 renders the new layout.
                // Otherwise, shortening a field in the "People" group will leave the things below it hanging.
                if (jQuery.browser.msie && jQuery.browser.version < "9") {
                    jQuery('body').toggleClass('reflow');
                }
            } else {
                // Make sure no items are being clipped.
                this.$container.css("height", "auto");
            }

            this.expanded = false;
        }
    });
});

define('jira/jquery/plugins/shorten/shorten', ['jira/ajs/shorten/shortener', 'jquery'], function (Shortener, jQuery) {
    /**
     *
     * jQuery plugin to shorten long lists with an ellipsis.
     *
     * For full options see {@link Shortener}
     *
     * @note Delegates to {@link Shortener}
     *
     * @example
     *
     * // no options
     * jQuery("#my-container").shorten();
     *
     * // options
     * jQuery("#my-container").shorten({
     *      numRows: 5
     * });
     *
     * @function external:"jQuery.fn".shorten
     * @param {Object} [options]
     * @param {HTMLElement | jQuery} options.element
     */
    jQuery.fn.shorten = function (options) {

        var res = [];
        options = options || {};

        this.each(function () {
            options.element = this;
            res.push(new Shortener(options));
        });

        return res;
    };
});

AJS.namespace('AJS.Shortener', null, require('jira/ajs/shorten/shortener'));

// Make extension available in global scope immediately / synchronously.
// TODO INC-71 - remove synchronous require
(function () {
    require('jira/jquery/plugins/shorten/shorten');
})();