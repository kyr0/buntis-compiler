var Validation;
(function (Validation) {
    var SomeThing = /** @class */ (function () {
        function SomeThing() {
        }
        SomeThing.prototype.foo = function () { };
        return SomeThing;
    }());
    Validation.SomeThing = SomeThing;
})(Validation || (Validation = {}));
new Validation.SomeThing();
