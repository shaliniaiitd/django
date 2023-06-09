define('jira/viewissue/slideshow/slideshow-configuration', ['jira/ajs/keyboardshortcut/keyboard-shortcut-toggle', 'jquery'], function (KST, $) {
    'use strict';

    var defaultOpts = {
        type: 'image',
        centerOnScroll: true,

        // disable JIRA's keyboard shortcuts when displaying a lightbox
        onStart: KST.disable,
        onClosed: KST.enable
    };

    var transition = 'elastic';

    return $.extend({}, defaultOpts, {
        transitionIn: transition,
        transitionOut: transition
    });
});