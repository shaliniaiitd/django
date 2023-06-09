define('jira/field/init-comment-controls', ['jira/skate', 'jira/ajs/select/security-level-select', 'jira/wikipreview/wiki-preview'], function (skate, SecurityLevelSelect, wikiPreview) {
    'use strict';

    skate('jira-wikifield', {
        type: skate.type.CLASSNAME,
        created: function created(el) {
            var prefs = {
                fieldId: el.getAttribute('field-id'),
                trigger: el.querySelector('.wiki-preview') ? el.querySelector('.wiki-preview').id : el.getAttribute('field-id') + '-preview_link',
                issueKey: el.getAttribute('issue-key'),
                rendererType: el.getAttribute('renderer-type')
            };
            wikiPreview(prefs, el).init();
        }
    });

    skate('security-level', {
        type: skate.type.CLASSNAME,
        created: function created(el) {
            var commentLevel = el.querySelector('#commentLevel');
            if (commentLevel) {
                new SecurityLevelSelect(commentLevel);
            }
        }
    });
});