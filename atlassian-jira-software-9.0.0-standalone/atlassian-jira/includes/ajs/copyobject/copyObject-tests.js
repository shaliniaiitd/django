AJS.test.require(["jira.webresources:util-lite"], function () {
    'use strict';

    var copyObject = require("jira/util/objects").copyObject;

    test("simple object", function () {
        var obj = { a: "def", b: 1, c: 1.3, d: null, e: NaN, f: false, g: true };
        deepEqual(copyObject(obj), obj, "simple object with various types");
    });

    test("nested object", function () {
        var obj = { a: "def", b: { c: "ghi" }, e: true };
        deepEqual(copyObject(obj), obj, "nested object with siblings");
        obj = { a: "def", b: { c: "ghi" } };
        deepEqual(copyObject(obj), obj, "nested object with previous sibling");
        obj = { b: { c: "ghi" }, a: "def" };
        deepEqual(copyObject(obj), obj, "nested object with following sibling");
        obj = { b: { c: "ghi" } };
        deepEqual(copyObject(obj), obj, "nested object with no siblings");
        obj = { b: { c: "ghi" }, d: { e: 1 } };
        deepEqual(copyObject(obj), obj, "nested objects");
        obj = { b: { c: { d: "ghi" } } };
        deepEqual(copyObject(obj), obj, "deep nested object");
        obj = { b: { c: { d: { e: "ghi" } } } };
        deepEqual(copyObject(obj), obj, "deep deep nested object");
    });

    test("nested object with deep===false", function () {
        var obj = { a: "def", b: 1, c: 1.3, d: null, e: NaN, f: false, g: true };
        deepEqual(copyObject(obj, false), obj, "simple object with various types");

        deepEqual(copyObject({ a: "def", b: { c: "ghi" }, e: true }, false), { a: "def", e: true }, "nested object");
    });

    test("nested arrays", function () {
        var obj = { a: [1, 2, 3] };
        deepEqual(copyObject(obj), obj, "nested array");
        obj = { a: [1, { b: { c: "def" } }, 3] };
        deepEqual(copyObject(obj), obj, "nested array with object");
        obj = { a: [1, { b: { c: [4, 5, 6] } }, 3] };
        deepEqual(copyObject(obj), obj, "nested array with nested array");

        obj = [];
        obj[0] = 1;
        obj[9] = 9;
        obj = { a: obj };
        deepEqual(copyObject(obj), obj, "nested array with gap");
    });

    test("array object", function () {
        var obj = [1, 2, 3];
        deepEqual(copyObject(obj), obj, "simple array");
    });

    test("nested array with deep===false", function () {
        deepEqual(copyObject({ a: "def", b: [1, 2, 3], e: true }, false), { a: "def", e: true }, "nested array");
    });
});