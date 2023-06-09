(function () {
    'use strict';

    var $ = require('jquery');
    var params = require('aui/params');
    var InlineDialog = require('aui/inline-dialog');
    var AuiTabs = require('aui/tabs');
    var ToggleBlock = require('jira/toggleblock/toggle-block');
    var describeBrowser = require('jira/ajs/browser/describe-browser');
    var Issue = require('jira/issue');
    var Messages = require('jira/message');
    var Cookie = require('jira/data/cookie');
    var Forms = require('jira/util/forms');
    var formatter = require('jira/util/formatter');
    var Meta = require('jira/util/data/meta');
    var Events = require('jira/util/events');
    var Navigator = require('jira/util/navigator');
    var skate = require('jira/skate');
    var strings = require('jira/util/strings');
    var wrmContextPath = require('wrm/context-path');

    var contextPath = wrmContextPath();

    // Cache a jQuery reference of $document
    var $document = $(document);

    // Preparing all over labels
    function initOverlabels() {
        $("label.overlabel").overlabel();
    }

    /*
     Sets the width of the issue navigator results wrapper.
     Keeps the right hand page elements within the browser view when the results table is wider than the browser view.
     Also fixes rendering issue with IE8 (JRA-18224)
     */
    function initIssueNavContainment() {
        var $issueNav = $("div.results");
        var $issueNavWrapWidth = $issueNav.width();
        $issueNav.bind("resultsWidthChanged", function () {
            var $issueNavWrap = $(this);

            $issueNavWrap.css("width", 100 / $issueNavWrapWidth * ($issueNavWrapWidth - (parseInt($(document.documentElement).prop("scrollWidth"), 10) - $(window).width())) + "%");
        });
        $(window).resize(function () {
            $issueNav.trigger("resultsWidthChanged");
        });
        $issueNav.trigger("resultsWidthChanged");

        $("#issuenav").bind("contractBlock expandBlock", function () {
            $(".results").trigger("resultsWidthChanged");
        });
    }

    // For switching tabs on field screens (edit, transition, create)
    function initFieldTabs() {
        $(".fieldTabs li").click(function (e) {
            e.preventDefault();
            e.stopPropagation();
            var $this = $(this);
            if (!$this.hasClass("active")) {
                $(".fieldTabs li.active").removeClass("active");
                $this.addClass("active");
                $(".fieldTabArea.active").removeClass("active");
                $("#" + $this.attr("rel")).addClass("active");
            }
        });
    }

    // Toggle form accessKeys. JRA-16102
    function initHandleAccessKeys() {
        $("form").handleAccessKeys();
        $document.bind("dialogContentReady", function () {
            $("form", this.$content).handleAccessKeys({
                selective: false // replace all access keys, not just ones in this form
            });
        });
    }

    // Hide all inline dialogs if we press escape (JRADEV-5811)
    function initHandleInlineLayerHide() {
        $document.keydown(function (e) {
            if (InlineDialog.current && e.which === 27 && !$(e.target).is(":input")) {
                InlineDialog.current.hide();
            }
        });
    }

    function initToggleBlocks() {
        new ToggleBlock({
            blockSelector: ".twixi-block",
            storageCollectionName: "twixi"
        }).addCallback("toggle", function () {
            Issue.getStalker().trigger("stalkerHeightUpdated");
        })
        // Comments
        .addTrigger(".action-head .action-details", "click");

        // Collapsing for the Simple Section
        // Default state is collapsed, so need to reverse the classes
        // Except for the text area, which is the oposite
        new ToggleBlock({
            blockSelector: "#issue-filter .toggle-wrap:not(#navigator-filter-subheading-textsearch-group)",
            triggerSelector: ".toggle-trigger",
            collapsedClass: "expanded",
            expandedClass: "collapsed",
            storageCollectionName: "navSimpleSearch"
        });

        // Generic twixi block
        new ToggleBlock({
            blockSelector: ".twixi-block",
            triggerSelector: ".twixi-trigger",
            storageCollectionName: "twixi"
        });

        new ToggleBlock({
            blockSelector: "#issuenav",
            triggerSelector: "a.toggle-lhc",
            collapsedClass: "lhc-collapsed",
            storageCollectionName: "lhc-state",
            autoFocusTrigger: false
        });

        // If a section has an error contained in it, it should be shown
        $(".error", "#issue-filter").parents(".toggle-wrap").removeClass("collapsed").addClass("expanded");

        $("fieldset.content-toggle input[type='radio']").live("change", function () {
            var $this = $(this);
            $this.closest(".content-toggle").find("input[type='radio']").each(function () {
                var $this = $(this);
                $("#" + $this.attr("name") + "-" + $this.val() + "-content").addClass("hidden");
            });
            $("#" + $this.attr("name") + "-" + $this.val() + "-content").removeClass("hidden");
        });
    }

    /* Logwork radio behaviour to disable/enable corresponding text inputs */
    function initLogWork() {
        $('#log-work-adjust-estimate-new-value,#log-work-adjust-estimate-manual-value').attr('disabled', 'disabled');
        $('#log-work-adjust-estimate-' + $('input[name=worklog_adjustEstimate]:checked,input[name=adjustEstimate]:checked').val() + '-value').removeAttr('disabled');
        $('input[name=worklog_adjustEstimate],input[name=adjustEstimate]').change(function () {
            $('#log-work-adjust-estimate-new-value,#log-work-adjust-estimate-manual-value').attr('disabled', 'disabled');
            $('#log-work-adjust-estimate-' + $(this).val() + '-value').removeAttr('disabled');
        });
    }

    // Make sure that we display one of the panels on page load (if there is a selected radio).
    function initLogin() {
        var radio = $('input:checked');
        if (radio.length !== 0) {
            if (radio.attr('id') === 'forgot-login-rb-forgot-password') {
                $('#username,#password').addClass('hidden');
                $('#password').removeClass('hidden');
            } else if (radio.attr('id') === 'forgot-login-rb-forgot-username') {
                $('#username,#password').addClass('hidden');
                $('#username').removeClass('hidden');
            }
        }

        // Swap the panels if one of the radio's is selected
        $('#forgot-login-rb-forgot-password').change(function () {
            $('#username,#password').addClass('hidden');
            $('#password').removeClass('hidden');
        });
        $('#forgot-login-rb-forgot-username').change(function () {
            $('#username,#password').addClass('hidden');
            $('#username').removeClass('hidden');
        });
    }

    /* File input field-group repeaters */
    function initFileRadio() {
        $("input.upfile").each(function () {
            var input = $(this);
            var container = input.closest(".field-group");
            input.change(function () {
                if (input.val().length > 0) {
                    container.next('.field-group').removeClass('hidden');
                }
            });
        });
    }

    /**
     * Ctrl-Enter (or Cmd+Enter on Mac) should work for text areas
     */
    function initHandleEnterInTextarea() {
        $document.on("keydown", "textarea", Forms.submitOnCtrlEnter);
        // For the JQL text box - we want to submit on Enter.
        // This is used for the old issue naviator (i.e. not Kickass) only.
        $("#jqltext").keypress(Forms.submitOnEnter);
    }

    /**
     * Warn if using an unsupported browser
     */
    function initUnsupportedBrowserWarning() {
        var $warning = $("#browser-warning");
        $(".aui-close-button", $warning).click(function () {
            $warning.slideUp("fast");
            Cookie.save("UNSUPPORTED_BROWSER_WARNING", "handled");
        });
    }

    /**
     * Make normal forms (non-ajax) still conform to the api we have for dialog forms etc. Disabling submission
     * by preventing default on before submit event.
     */
    function initHandleFormSubmit() {
        $("form").submit(function (e) {
            var event = new $.Event("before-submit");
            $(this).trigger(event);
            if (event.isDefaultPrevented()) {
                e.preventDefault();
            }
        });
    }

    /**
     * Textareas that expand on input.
     */
    function initExpandOnInput() {
        var selector = '#comment, #environment, #description';
        var maxTextareaHeight = 200;

        $document.bind('tabSelect', function (e, data) {
            data.pane.find(selector).expandOnInput();
        });

        $(selector).expandOnInput(maxTextareaHeight);

        $document.bind('dialogContentReady', function (e, dialog) {
            dialog.get$popupContent().bind('tabSelect', function (e, data) {
                data.pane.find(selector).expandOnInput(maxTextareaHeight);
            }).find(selector).expandOnInput(maxTextareaHeight);
        });

        // Bind to the event triggered by toggling the wiki markup preview.
        $document.bind('showWikiInput', function (e, $container) {
            $container.find(selector).expandOnInput();
        });
    }

    function initAuiTabHandling() {
        // Ensure tabs are initiated in dialogs. Used in Quick Edit/Quick Create
        Events.bind("dialogContentReady", function () {
            AuiTabs.setup();
        });
    }

    // We want people to cancel forms like they used to when cancel was a button.
    // JRADEV-1823 - Alt-` does not work in IE
    function initCancelFormHandling() {
        var $auiForm = $("form.aui");
        var $cancel = $("a.cancel", $auiForm);
        if (Navigator.isIE() && Navigator.majorVersion() < 12 && $cancel.attr("accessKey")) {
            $cancel.focus(function (e) {
                if (e.altKey) {
                    //simulate a click (for the dirty form filter) then follow the link!
                    $(this).mousedown();
                    window.location.href = $cancel.attr("href");
                }
            });
        }
    }

    // Initialise the bulk edit screen to make checkboxes autoselect on :input change events.
    function initBulkEditCheckboxes() {
        var timeTrackingUpdate = function timeTrackingUpdate() {
            if ($('[name="timetracking_targetsubfield"]').length) {
                $("#cbtimetracking").attr("checked", !!$('[name="timetracking_targetsubfield"]:checked').length);
            }
        };
        var checkRow = function checkRow(input) {
            $(input).closest(".availableActionRow").find("td:first :checkbox").attr('checked', true);
            // TimeTracking doesn't follow common rule
            if (input.name === "timetracking_targetsubfield") {
                timeTrackingUpdate();
            }
        };
        var $rows = $("#availableActionsTable tr.availableActionRow");
        $rows.children("td:last-child").find(":input").change(function () {
            checkRow(this);
        });
        // TimeTracking doesn't follow common rule
        ["originalestimate", "remainingestimate"].forEach(function (subfield) {
            var $checkbox = $("#timetracking_" + subfield + "_subfield");
            $("#timetracking_" + subfield).change(function () {
                $checkbox.attr("checked", true);
            });
        });
        $("form#bulkedit").submit(timeTrackingUpdate);
    }

    function initBulkEditCheckboxesForMultiSelectFields() {
        var checkUpperRow = function checkUpperRow(input) {
            $(input).closest("tr").prev().find("td:first :checkbox").attr('checked', true);
        };
        var $cells = $("#availableActionsTable .availableActionRowMultiSelect");
        $cells.children("td:last-child").find(":input").change(function () {
            checkUpperRow(this);
        });
    }

    function disableMultiSelectFields() {
        $("#availableActionsTable .availableActionMultiSelect select").change(function () {
            var $this = $(this);
            $this.closest("tr").next().toggleClass("hidden", $this.val() === "removeall");
        });
    }

    function initPerformanceMonitor() {
        if (params.showmonitor) {
            var $div = $("<div class='perf-monitor'/>");
            var slowRequest = params["jira.request.server.time"] > 2000;
            var tooManySql = params.jiraSQLstatements > 50;
            if (slowRequest) {
                $div.addClass("tooslow");
            }
            if (tooManySql) {
                $div.addClass("toomanysql");
            }

            $("#header-top").append($div);

            new InlineDialog($div, "perf-monitor-dialog", function ($contents, control, show) {
                var timingInfo = "<div>Page render time <strong>" + params["jira.request.server.time"] + " ms</strong>";
                if (params.jiraSQLstatements) {
                    timingInfo += " / SQL <strong>" + params.jiraSQLstatements + "@" + params.jiraSQLtime + " ms</strong></br>";
                    timingInfo += "<a target=\"_blank\" href=" + contextPath + "/sqldata.jsp?requestId=" + params["jira.request.id"] + ">More...</a>";
                } else {
                    timingInfo += " / No SQL statments";
                }
                timingInfo += "</div>";
                $contents.empty().append(timingInfo);
                show();
            });
        }
    }

    /**
     * A lozenge that appears next to workflow names. Clicking on it reveals a list of
     * projects that make use of the workflow.
     *
     * @skate shared-item-trigger
     */
    skate("shared-item-trigger", {
        type: skate.type.CLASSNAME,
        attached: function sharedItemTriggerAttached(element) {
            var target = element.getAttribute('href');
            new InlineDialog(element, target.substring(1), function (contents, trigger, showPopup) {
                contents.html($(target).html());
                showPopup();
            }, { width: 240 });
        }
    });

    function initClickables() {
        $(".clickable").click(function () {
            window.location.href = $(this).find("a").attr("href");
        });
    }

    function initProjectsList($ctx) {
        $(".projects-list-trigger", $ctx).each(function () {
            var $trigger = $(this);
            $trigger.click(false);
            var target = $trigger.attr('href');
            new InlineDialog(this, target.substring(1), function (contents, trigger, showPopup) {
                contents.html($(target).html());
                showPopup();
            }, {
                onHover: true,
                hideDelay: 500,
                width: 240
            });
        });
    }

    function initHelpLinks() {
        $document.on("click", "[data-helplink=local]", function (e) {
            var url = this.getAttribute('href');
            var child = window.open(url, 'jiraLocalHelp');
            if (child) {
                child.focus();
            }
            e.preventDefault();
            return false;
        });
    }

    function initTooltips() {
        var TOOLTIP_INITIALIZED = "jiraTooltipInitialized";
        var initTooltipMatchingSelector = function initTooltipMatchingSelector(selector) {
            return function (element) {
                var $el = $(element);
                if (!selector || $el.is(selector)) {
                    $el.tooltip();
                    element[TOOLTIP_INITIALIZED] = true;
                }
            };
        };
        var destroyTooltip = function destroyTooltip(element) {
            if (element[TOOLTIP_INITIALIZED]) {
                delete element[TOOLTIP_INITIALIZED];
                var $el = $(element);
                if ($el.tooltip) {
                    $el.tooltip('destroy');
                }
            }
        };

        skate('help-lnk', {
            type: skate.type.CLASSNAME,
            attached: initTooltipMatchingSelector("a[title]"),
            detached: destroyTooltip
        });
        skate('grouppicker-trigger', {
            type: skate.type.CLASSNAME,
            attached: initTooltipMatchingSelector('[title]'),
            detached: destroyTooltip
        });
        skate('popup-trigger', {
            type: skate.type.CLASSNAME,
            attached: initTooltipMatchingSelector('[title]'),
            detached: destroyTooltip
        });
    }

    // document ready
    $(function () {
        // eslint-disable-line @atlassian/onready-checks/no-jquery-onready
        initToggleBlocks();
        initOverlabels();
        initIssueNavContainment();
        initFieldTabs();
        initHandleAccessKeys();
        initLogWork();
        initLogin();
        initFileRadio();
        initHandleEnterInTextarea();
        initUnsupportedBrowserWarning();
        initHandleFormSubmit();
        initExpandOnInput();
        initCancelFormHandling();
        initBulkEditCheckboxes();
        initBulkEditCheckboxesForMultiSelectFields();
        disableMultiSelectFields();
        initHandleInlineLayerHide();
        initPerformanceMonitor();
        initClickables();
        initHelpLinks();
        initTooltips();
        initProjectsList();
    });

    // Run straight away
    describeBrowser(); // Add classNames describing the browser, i.e name and version, to html tag.
    initAuiTabHandling();

    skate("js-filter-form-edit", {
        "type": skate.type.CLASSNAME,
        "extends": "form",
        "events": {
            "submit": function filterFormSubmitted(element, event) {
                if (!event.defaultPrevented) {
                    var filterName = strings.escapeHtml(element.elements.filterName.value);
                    Messages.showMsgOnReload(formatter.I18n.getText("editfilter.save.success", filterName), {
                        type: "SUCCESS",
                        closeable: true,
                        target: "body:not(:has(#edit-entity))" // Only show the success message when redirected.
                    });
                }
            }
        }
    });

    skate("js-filter-form-subscription", {
        "type": skate.type.CLASSNAME,
        "extends": "form",
        "events": {
            "submit": function filterFormSubmitted(element, event) {
                if (!event.defaultPrevented) {
                    var recipient = element.elements.groupName.value || Meta.get('remote-user-fullname');
                    Messages.showMsgOnReload(formatter.I18n.getText("subscriptions.add.success", strings.escapeHtml(recipient)), {
                        type: "SUCCESS",
                        closeable: true,
                        target: "body:not(:has(#filter-subscription))" // Only show the success message when redirected.
                    });
                }
            }
        }
    });
})();