"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bar_1 = require("./bar");
var Foo;
(function (Foo) {
    Foo.a = 1;
    function hello() {
        console.log(Foo.a);
    }
    Foo.hello = hello;
    console.log(bar_1.default);
})(Foo || (Foo = {}));
console.log(a);
