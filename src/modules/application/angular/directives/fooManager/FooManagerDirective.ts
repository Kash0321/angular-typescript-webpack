export class FooManagerDirective {
    public link: ($scope: ng.IScope, $element: ng.IAugmentedJQuery, $attrs: ng.IAttributes) => void;
    public restrict = "E";
    public replace = true;
    public template = require("!raw!./FooManager.html");
    public scope = {};
    public bindToController = {};
    public controller = FooManagerController;
    public controllerAs = "vm";

    public static Factory(): any {
        var directive = () => {
            return new FooManagerDirective();
        };

        directive["$inject"] = [];

        return directive;
    }

    constructor() {
        FooManagerDirective.prototype.link = ($scope: ng.IScope, $element: ng.IAugmentedJQuery, $attrs: ng.IAttributes) => {
            $element.attr("id", $attrs["managerId"]);
        };
    }
}

export interface IFooManagerVM {
    Id: number;
    Name: string;
    Status: string;
}

export class FooManagerController implements IFooManagerVM {
    public Id: number;
    public Name: string;
    public Status: string;
    public IsNew: boolean;
    public MessageStatus: string;
    public Message: string;
    public StartId: number;


    constructor(private $http: ng.IHttpService) {
        this.New();
        this.Retrieve("first");
    }

    public ShowMessage(status: string, message: string): void {
        this.MessageStatus = status;
        this.Message = message;
        $("#msgWindow").modal();
    }

    public Save(): void {
        if (this.IsNew) {
            this.$http.post("http://localhost/Kash.JSTSUT.Web/api/Foos", { Name: this.Name, Status: this.Status }).then(
                (req: ng.IHttpPromiseCallbackArg<IFooManagerVM>) => {
                    this.Id = req.data.Id;
                    this.IsNew = false;
                    this.ShowMessage("Información del sistema", "Creado correctamente");
                },
                (result) => {
                    this.ShowMessage(result.status, result.statusText);
                    this.New();
                }
            );
        } else {
            this.$http.put("http://localhost/Kash.JSTSUT.Web/api/Foos/" + this.Id, { Name: this.Name, Status: this.Status }).then(
                (req) => {
                    this.ShowMessage("Información del sistema", "Guardado correctamente");
                },
                (result) => {
                    this.ShowMessage(result.status, result.statusText);
                    this.New();
                }
            );
        };
    }

    public Delete(): void {
        let theId: number = this.Id;
        this.$http.delete("http://localhost/Kash.JSTSUT.Web/api/Foos/" + theId, {}).then(
            (req) => {
                this.ShowMessage("Información del sistema", "Eliminado correctamente");
                this.Retrieve("previous", theId);
                this.IsNew = false;
            },
            (result) => {
                this.ShowMessage(result.status, result.statusText);
                this.New();
            });
    }

    public New(): void {
        this.Id = 0;
        this.Name = "";
        this.Status = "";

        this.IsNew = true;
    }

    public Retrieve(mode: string, id: number = undefined): void {
        if (id) {
            this.StartId = id;
        } else {
            this.StartId = this.Id;
        }

        let retId: any = undefined;
        this.$http.get("http://localhost/Kash.JSTSUT.Web/api/Foos/" + this.StartId + "/" + mode + "Id", {}).then(
            (req: ng.IHttpPromiseCallbackArg<{}>) => {
                retId = req.data;
                this.IsNew = false;

                this.$http.get("http://localhost/Kash.JSTSUT.Web/api/Foos/" + retId, {}).then(
                    (req2: ng.IHttpPromiseCallbackArg<IFooManagerVM>) => {
                        this.Id = req2.data.Id;
                        this.Name = req2.data.Name;
                        this.Status = req2.data.Status;
                    },
                    (result) => {
                        this.ShowMessage(result.status, result.statusText);
                        this.New();
                    }
                );
            },
            (result) => {
                this.ShowMessage(result.status, result.statusText);
                this.New();
            }
        );
    }
}