/**
 * JIRA.Issue.selectIssueTypeScheme
 * @author Scott Harwood
 */
require(['jquery'], function (jQuery) {
    'use strict';

    var lastIdDisplayed = "";

    var hide = function hide() {
        if (lastIdDisplayed && lastIdDisplayed !== '') {
            jQuery("#" + lastIdDisplayed).css("display", "none");
        }
    };

    var show = function show() {
        var selectList = jQuery('#schemeId_select');
        lastIdDisplayed = selectList.val();
        jQuery("#" + selectList.val()).css("display", "");
    };

    var handleSchemeChange = function handleSchemeChange() {
        var selectList = jQuery('#schemeId_select');

        hide();
        show();

        // inline script
        if (selectList.get(0)) {
            changeDescription0(selectList.get(0)); // eslint-disable-line no-undef
        }

        jQuery('#issueTypeSchemeLabel').html(selectList.find("option:selected").html());
    };

    /**
     * @private
     * @returns {Boolean}
     */
    var handleSectionChange = function handleSectionChange() {

        if (jQuery('#createType_chooseScheme:checked').length > 0) {
            jQuery('#chooseScheme').css("display", "");
        } else {
            jQuery('#chooseScheme').css("display", "none");
        }

        if (jQuery('#createType_chooseProject') && jQuery('#createType_chooseProject:checked').length > 0) {
            jQuery('#chooseProject').css("display", "");
        } else {
            jQuery('#chooseProject').css("display", "none");
        }

        if (jQuery('#createType_createScheme:checked').length > 0) {
            jQuery('#optionsForScheme').css("display", "none");
            jQuery('#createScheme').css("display", "");
        } else {
            jQuery('#createScheme').css("display", "none");
            jQuery('#optionsForScheme').css("display", "");
        }

        return true;
    };

    /**
     * @private
     * @param {HTMLElement} projectSelect
     */
    var selectIssueTypeScheme = function selectIssueTypeScheme(projectSelect) {
        if (projectSelect.value && projectSelect.value !== '') {
            // inline script
            changeDescription2(projectSelect); // eslint-disable-line no-undef

            // eslint-disable-next-line eqeqeq
            if (jQuery('#schemeId_select').val() != projectSelect.value) {
                jQuery('#schemeId_select').val(projectSelect.value);
                handleSchemeChange();
            }
        }
    };

    var initSelectIssueTypeScheme = function initSelectIssueTypeScheme() {

        jQuery('#schemeId_select').change(function () {
            handleSchemeChange();
            jQuery('#sameAsProjectId_select').val("");
        });

        jQuery("#schemeId_select").change(function () {
            selectIssueTypeScheme(this);
        });

        jQuery("#sameAsProjectId_select").change(function () {
            selectIssueTypeScheme(this);
        });

        jQuery("#choose-section input").click(function () {
            handleSectionChange(this);
        });

        handleSchemeChange();
        handleSectionChange();
    };

    // need to call after page load to ensure all nodes are there
    jQuery(initSelectIssueTypeScheme);
});