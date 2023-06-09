AJS.test.require(["jira.webresources:select-pickers"], function () {
    'use strict';

    require(['jira/ajs/list/pageable-list', 'jira/ajs/list/item-descriptor', 'jira/ajs/list/group-descriptor', 'jquery'], function (PageableList, ItemDescriptor, GroupDescriptor, jQuery) {
        module("PageableList", {
            setup: function setup() {
                this.descriptorsBuilder = function (groups, items, addFooterText) {
                    addFooterText = addFooterText || false;
                    var result = [];
                    var group;
                    var number;

                    for (var i = 1; i <= groups; i++) {
                        group = new GroupDescriptor({
                            label: '' + i,
                            styleClass: 'groupDescriptor'
                        });
                        if (addFooterText) {
                            group.footerText(i + 1);
                        }
                        if (Object.prototype.toString.call(items) === '[object Array]') {
                            number = items[i - 1];
                        } else {
                            number = items;
                        }

                        for (var j = 1; j <= number; j++) {
                            group.addItem(new ItemDescriptor({
                                label: i * 100 + j + '',
                                styleClass: 'suggestion'
                            }));
                        }
                        result.push(group);
                    }

                    return result;
                };

                this.selectionCallback = sinon.spy();
                this.$container = jQuery('<div></div>').appendTo(jQuery('#qunit-fixture'));

                this.list = new PageableList({
                    containerSelector: this.$container,
                    pageSize: 5,
                    pagingThreshold: 5,
                    selectionHandler: this.selectionCallback
                });
            }
        });

        test('adding next page renders proper number of groups and suggestions', function () {
            var data = this.descriptorsBuilder(2, [6, 5]);

            this.list.generateListFromJSON(data, '');
            equal(this.list.suggestions, 5, 'properly rendered first page of results');
            equal(this.list.pageNumber, 1, 'proper page number');
            equal(this.$container.find('.suggestion').length, 5, 'rendered proper number of suggestions');
            equal(this.$container.find('ul.groupDescriptor').length, 1, 'rendered proper number of groups');
            this.list.addNextPage();
            equal(this.list.pageNumber, 2, 'proper page number');
            equal(this.$container.find('.suggestion').length, 10, 'rendered proper number of suggestions');
            equal(this.$container.find('ul.groupDescriptor').length, 2, 'rendered proper number of groups');
        });

        test('does not render group twice', function () {
            var data = this.descriptorsBuilder(3, [12, 4, 4]);

            this.list.generateListFromJSON(data, '');
            this.list.addNextPage();
            equal(this.$container.find('ul.groupDescriptor').length, 1, 'renders proper number of groups');
            this.list.addNextPage();
            equal(this.$container.find('ul.groupDescriptor').length, 2, 'renders proper number of groups');
        });

        test('suggestions are placed before group footer', function () {
            var data = this.descriptorsBuilder(2, [12, 5], true);

            this.list.generateListFromJSON(data, '');
            this.list.addNextPage();
            this.list.addNextPage();
            ok(this.$container.find('.aui-list-section-footer').is(':last-child'), 'every group footer is last element in group container');
        });

        test('querying works as expected', function () {
            var data = this.descriptorsBuilder(3, [2, 7, 16]);

            this.list.generateListFromJSON(data, '10');
            equal(this.list.suggestions, 2, 'properly filtered');
            equal(this.$container.find('.suggestion').length, 2, 'properly filtered');
            this.list.generateListFromJSON(data, '20');
            this.list.addNextPage();
            equal(this.list.suggestions, 7, 'properly paged filtered suggestions');
            equal(this.$container.find('.suggestion').length, 7, 'properly paged filtered suggestions');
        });

        test('changing query resets paging', function () {
            var data = this.descriptorsBuilder(2, 11);

            this.list.generateListFromJSON(data, '');
            this.list.addNextPage();
            this.list.generateListFromJSON(data, '');
            equal(this.list.pageNumber, 2, 'keeps pageNumber if query does not change');
            this.list.generateListFromJSON(data, '10');
            equal(this.list.pageNumber, 1, 'changes page number when query change');
        });

        test('forcing all results works as expected', function () {
            var data = this.descriptorsBuilder(3, 16);

            this.list.generateListFromJSON(data, '', true);
            equal(this.list.suggestions, 48, 'rendered all results');
            equal(this.$container.find('.suggestion').length, 48, 'rendered all results');
        });

        test('paginating only if pagination threshold is met', function () {
            var list = new PageableList({
                pageSize: 5,
                pagingThreshold: 10,
                containerSelector: this.$container
            });

            var data9 = this.descriptorsBuilder(2, [5, 4]);
            var data15 = this.descriptorsBuilder(3, 5);

            list.generateListFromJSON(data9, '');
            equal(list.suggestions, 9, 'rendered all results');
            equal(this.$container.find('.suggestion').length, 9, 'rendered all results');
            list.generateListFromJSON(data15, '');
            equal(list.suggestions, 5, 'pages results properly');
            equal(this.$container.find('.suggestion').length, 5, 'pages results properly');
        });

        test('closing a dropdown should reset pageNumber property', function () {
            var list = new PageableList({
                pageSize: 5,
                pagingThreshold: 10,
                containerSelector: this.$container
            });

            var data15 = this.descriptorsBuilder(3, 5);

            list.generateListFromJSON(data15, '');
            equal(list.pageNumber, 1, 'initial state, first page');
            list.addNextPage();
            equal(list.pageNumber, 2, 'requested next page, pageNumber should have increased');
            list.disable();
            equal(list.pageNumber, 1, 'dropdown closed, reset to first page');
        });
    });
});