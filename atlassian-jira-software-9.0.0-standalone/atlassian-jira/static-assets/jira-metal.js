(function ($) {
    'use strict';

    $(function () {
        // eslint-disable-line @atlassian/onready-checks/no-jquery-onready
        var $body = $('body');
        if ($body.hasClass('error500')) {
            $('.technical-details-header').click(function () {
                $('.technical-details').toggleClass('js-hidden');
                $(this).toggleClass('opened');
            });
        }

        if ($body.hasClass('new-installation-old-license')) {
            var $formArea = $('#confirm-new-installation-form-area');
            if ($('#confirm-new-installation-radio-options').length) {
                var $radioButtonsContainer = $('#confirm-new-installation-radio-options');
                var $radioButtons = $radioButtonsContainer.find('input[type="radio"]');
                var prevRadioOption = $radioButtonsContainer.data('option');

                var formAreas = {
                    'license': $('#confirm-new-installation-license-area'),
                    'evaluation': $('#confirm-new-installation-evaluation-area'),
                    'remove-expired': $('#confirm-new-installation-remove-expired-area')
                };

                // handles choosing one of the options
                $radioButtons.on('change', function () {
                    var active = $(this).val();
                    $formArea.html(formAreas[active].html()).removeClass('hidden');
                });

                // showing form for previously selected option, or, if no option was chosen,
                // we check radio input for default choice (license)
                $radioButtons.filter('[value="' + (prevRadioOption || 'license') + '"]').change().prop('checked', true);
            }
        }
    });
})(jQuery || Zepto); // eslint-disable-line no-undef