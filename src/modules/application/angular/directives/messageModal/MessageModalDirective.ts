export class MessageModalDirective {
    public link: ($scope: ng.IScope, $element: ng.IAugmentedJQuery, $attrs: ng.IAttributes) => void;
    public restrict = "E";
    public replace = true;
    public template = require("!raw!./MessageModal.html");
    public scope = {};
    public bindToController = {
        messageStatus: "=",
        message: "="
    };
    public controller = MessageModalController;
    public controllerAs = "vm";

    public static Factory(): any {
        var directive = () => {
            return new MessageModalDirective();
        };

        directive["$inject"] = [];

        return directive;
    }

    constructor() {
        MessageModalDirective.prototype.link = ($scope: ng.IScope, $element: ng.IAugmentedJQuery, $attrs: ng.IAttributes) => {
            $element.attr("id", $attrs["modalId"]);
        };
    }
}

export class MessageModalController {
    public messageStatus: number;
    public message: string;
}