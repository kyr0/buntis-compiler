"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
function hello() {
    const obj = [{ name: "1" }];
    const name = "hello";
    return (React.createElement("div", null,
        hello,
        React.createElement("span", { className: name === "hello" ? "1" : 2 }, obj.map(item => (React.createElement("i", null, item.name))))));
}
exports.hello = hello;
