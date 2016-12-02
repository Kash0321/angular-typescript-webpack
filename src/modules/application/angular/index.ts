import "angular";
import "bootstrap";

import { IndexController } from "./controllers/IndexController";
import { FooManagerDirective, FooManagerController } from "./directives/fooManager/FooManagerDirective";
import { MessageModalDirective, MessageModalController } from "./directives/messageModal/MessageModalDirective";

angular.module("app.application", [])
    .controller("IndexController", IndexController)
    .directive("fooManager", FooManagerDirective.Factory())
    .controller("FooManagerController", FooManagerController)
    .directive("messageModal", MessageModalDirective.Factory())
    .controller("MessageModalController", MessageModalController);