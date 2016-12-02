import "../../index";
import "angular";
import "angular-mocks";

import { FooManagerController } from "./FooManagerDirective";

import "phantomjs-polyfill";

var $httpMock: ng.IHttpBackendService;

describe("FooManagerController Tests -", () => {

    var createController: any;

    beforeEach(angular.mock.module("app.application"));

    beforeEach(inject(($injector) => {
        // set up the mock http service responses
        $httpMock = $injector.get("$httpBackend");

        // backend definition common for all tests
        $httpMock.when("GET", "http://localhost/Kash.JSTSUT.Web/api/Foos/0/firstId")
            .respond(200, 123);

        // let firstId =  $httpMock.when("GET", "http://localhost/Kash.JSTSUT.Web/api/Foos/undefined/firstId")
        //    .respond(200, 123);

        $httpMock.when("GET", "http://localhost/Kash.JSTSUT.Web/api/Foos/123")
            .respond(200, { Id: 123, Name: "TestName", Status: "TestStatus" });

        // get hold of a scope (i.e. the root scope)
        // $rootScope = $injector.get("$rootScope");

        // the $controller service is used to create instances of controllers
        var $controller: any = $injector.get("$controller");

        createController = () => {
            return $controller("FooManagerController", {  });
        };
    }));

    afterEach(() => {
        $httpMock.verifyNoOutstandingExpectation();
        $httpMock.verifyNoOutstandingRequest();
    });

    it("save() [create]", () => {
        // arrange
        var controller: FooManagerController = createController();

        // flusheamos las peticiones de construcción del controlador
        $httpMock.flush();

        controller.IsNew = true;

        controller.Id = 0;
        controller.Name = "TestName";
        controller.Status = "TestStatus";

        $httpMock
            .expectPOST("http://localhost/Kash.JSTSUT.Web/api/Foos", { Name: "TestName", Status: "TestStatus" })
            .respond(201, { Id: 123, Name: "TestName", Status: "TestStatus" });

        // act
        controller.Save();
        $httpMock.flush();

        // assert
        expect(controller.Id).toBe(123);
        expect(controller.Name).toBe("TestName");
        expect(controller.Status).toBe("TestStatus");

        expect(controller.MessageStatus).toBe("Información del sistema");
        expect(controller.Message).toBe("Creado correctamente");

        expect(controller.IsNew).toBe(false);
    });

    it("save() [create_error]", () => {
        // arrange
        var controller: FooManagerController = createController();

        // flusheamos las peticiones de construcción del controlador
        $httpMock.flush();

        controller.IsNew = true;

        controller.Id = 0;
        controller.Name = "TestName";
        controller.Status = "TestStatus";

        $httpMock
            .expectPOST("http://localhost/Kash.JSTSUT.Web/api/Foos", { Name: "TestName", Status: "TestStatus" })
            .respond(500);

        // act
        controller.Save();
        $httpMock.flush();

        // assert
        expect(controller.MessageStatus).toBe(500);

        expect(controller.IsNew).toBe(true);
        expect(controller.Id).toBe(0);
        expect(controller.Name).toBe("");
        expect(controller.Status).toBe("");
    });

    it("save() [update]", () => {
        // arrange
        var controller: FooManagerController = createController();

        // flusheamos las peticiones de construcción del controlador
        $httpMock.flush();

        controller.IsNew = false;

        controller.Id = 111;
        controller.Name = "TestName111";
        controller.Status = "TestStatus111";

        $httpMock
            .expectPUT("http://localhost/Kash.JSTSUT.Web/api/Foos/111", { Name: "TestName111", Status: "TestStatus111" })
            .respond(204, {});

        // act
        controller.Save();
        $httpMock.flush();

        // assert
        expect(controller.Id).toBe(111);
        expect(controller.Name).toBe("TestName111");
        expect(controller.Status).toBe("TestStatus111");

        expect(controller.MessageStatus).toBe("Información del sistema");
        expect(controller.Message).toBe("Guardado correctamente");

        expect(controller.IsNew).toBe(false);
    });

    it("save() [update_notfound]", () => {
        // arrange
        var controller: FooManagerController = createController();

        // flusheamos las peticiones de construcción del controlador
        $httpMock.flush();

        controller.IsNew = false;

        controller.Id = 111;
        controller.Name = "TestName111";
        controller.Status = "TestStatus111";

        $httpMock
            .expectPUT("http://localhost/Kash.JSTSUT.Web/api/Foos/111", { Name: "TestName111", Status: "TestStatus111" })
            .respond(404);

        // act
        controller.Save();
        $httpMock.flush();

        // assert
        expect(controller.MessageStatus).toBe(404);

        expect(controller.Id).toBe(0);
        expect(controller.Name).toBe("");
        expect(controller.Status).toBe("");
        expect(controller.IsNew).toBe(true);
    });

    it("delete()", () => {
        // arrange
        var controller: FooManagerController = createController();

        // flusheamos las peticiones de construcción del controlador
        $httpMock.flush();

        controller.IsNew = false;
        controller.Id = 123;
        controller.Name = "TestName";
        controller.Status = "TestStatus";

        $httpMock
            .expectDELETE("http://localhost/Kash.JSTSUT.Web/api/Foos/123")
            .respond(201, { Id: 123, Name: "TestName", Status: "TestStatus" });

        $httpMock.expectGET("http://localhost/Kash.JSTSUT.Web/api/Foos/123/previousId")
            .respond(200, 122);

        $httpMock.expectGET("http://localhost/Kash.JSTSUT.Web/api/Foos/122")
            .respond(200, { Id: 122, Name: "TestNamePre", Status: "TestStatusPre" });

        // act
        controller.Delete();
        $httpMock.flush();

        // assert
        expect(controller.Id).toBe(122);
        expect(controller.Name).toBe("TestNamePre");
        expect(controller.Status).toBe("TestStatusPre");

        expect(controller.MessageStatus).toBe("Información del sistema");
        expect(controller.Message).toBe("Eliminado correctamente");

        expect(controller.IsNew).toBe(false);
    });

    it("delete() [notfound]", () => {
        // arrange
        var controller: FooManagerController = createController();

        // flusheamos las peticiones de construcción del controlador
        $httpMock.flush();

        controller.IsNew = false;
        controller.Id = 123;
        controller.Name = "TestName";
        controller.Status = "TestStatus";

        $httpMock
            .expectDELETE("http://localhost/Kash.JSTSUT.Web/api/Foos/123")
            .respond(404);

        // act
        controller.Delete();
        $httpMock.flush();

        // assert
        expect(controller.MessageStatus).toBe(404);

        expect(controller.Id).toBe(0);
        expect(controller.Name).toBe("");
        expect(controller.Status).toBe("");
        expect(controller.IsNew).toBe(true);
    });

    it("retrieve() [first]", () => {
        // arrange
        var controller: FooManagerController = createController();

        // flusheamos las peticiones de construcción del controlador
        $httpMock.flush();

        controller.IsNew = true;

        controller.Id = undefined;
        controller.Name = "TestName";
        controller.Status = "TestStatus";

        $httpMock
            .expectGET("http://localhost/Kash.JSTSUT.Web/api/Foos/undefined/firstId")
            .respond(200, 1);

        $httpMock
            .expectGET("http://localhost/Kash.JSTSUT.Web/api/Foos/1")
            .respond(200, { Id: 1, Name: "111", Status: "111" });

        // act
        controller.Retrieve("first");
        $httpMock.flush();

        // assert
        expect(controller.Id).toBe(1);
        expect(controller.Name).toBe("111");
        expect(controller.Status).toBe("111");

        expect(controller.IsNew).toBe(false);
    });

    it("retrieve() [first_empty]", () => {
        // arrange
        var controller: FooManagerController = createController();

        // flusheamos las peticiones de construcción del controlador
        $httpMock.flush();

        controller.IsNew = true;

        controller.Id = undefined;
        controller.Name = "TestName";
        controller.Status = "TestStatus";

        $httpMock
            .expectGET("http://localhost/Kash.JSTSUT.Web/api/Foos/undefined/firstId")
            .respond(404);

        // act
        controller.Retrieve("first");
        $httpMock.flush();

        // assert
        expect(controller.MessageStatus).toBe(404);

        expect(controller.Id).toBe(0);
        expect(controller.Name).toBe("");
        expect(controller.Status).toBe("");
        expect(controller.IsNew).toBe(true);
    });

    it("retrieve() [first_getid_notfound]", () => {
        // arrange
        var controller: FooManagerController = createController();

        // flusheamos las peticiones de construcción del controlador
        $httpMock.flush();

        controller.IsNew = true;

        controller.Id = undefined;
        controller.Name = "TestName";
        controller.Status = "TestStatus";

        $httpMock
            .expectGET("http://localhost/Kash.JSTSUT.Web/api/Foos/undefined/firstId")
            .respond(200, 1);

        $httpMock
            .expectGET("http://localhost/Kash.JSTSUT.Web/api/Foos/1")
            .respond(404);

        // act
        controller.Retrieve("first");
        $httpMock.flush();

        // assert
        expect(controller.MessageStatus).toBe(404);

        expect(controller.Id).toBe(0);
        expect(controller.Name).toBe("");
        expect(controller.Status).toBe("");
        expect(controller.IsNew).toBe(true);
    });

    it("retrieve() [previous]", () => {
        // arrange
        var controller: FooManagerController = createController();

        // flusheamos las peticiones de construcción del controlador
        $httpMock.flush();

        controller.IsNew = true;

        controller.Id = 10;
        controller.Name = "TestName";
        controller.Status = "TestStatus";

        $httpMock
            .expectGET("http://localhost/Kash.JSTSUT.Web/api/Foos/10/previousId")
            .respond(200, 5);


        $httpMock
            .expectGET("http://localhost/Kash.JSTSUT.Web/api/Foos/5")
            .respond(200, { Id: 5, Name: "555", Status: "555" });

        // act
        controller.Retrieve("previous");
        $httpMock.flush();

        // assert
        expect(controller.Id).toBe(5);
        expect(controller.Name).toBe("555");
        expect(controller.Status).toBe("555");

        expect(controller.IsNew).toBe(false);
    });

    it("retrieve() [previous_notfound]", () => {
        // arrange
        var controller: FooManagerController = createController();

        // flusheamos las peticiones de construcción del controlador
        $httpMock.flush();

        controller.IsNew = true;

        controller.Id = 10;
        controller.Name = "TestName";
        controller.Status = "TestStatus";

        $httpMock
            .expectGET("http://localhost/Kash.JSTSUT.Web/api/Foos/10/previousId")
            .respond(404);

        // act
        controller.Retrieve("previous");
        $httpMock.flush();

        // assert
        expect(controller.MessageStatus).toBe(404);

        expect(controller.Id).toBe(0);
        expect(controller.Name).toBe("");
        expect(controller.Status).toBe("");
        expect(controller.IsNew).toBe(true);
    });

    it("retrieve() [previous_getid_notfound]", () => {
        // arrange
        var controller: FooManagerController = createController();

        // flusheamos las peticiones de construcción del controlador
        $httpMock.flush();

        controller.IsNew = true;

        controller.Id = 10;
        controller.Name = "TestName";
        controller.Status = "TestStatus";

        $httpMock
            .expectGET("http://localhost/Kash.JSTSUT.Web/api/Foos/10/previousId")
            .respond(200, 5);


        $httpMock
            .expectGET("http://localhost/Kash.JSTSUT.Web/api/Foos/5")
            .respond(404);

        // act
        controller.Retrieve("previous");
        $httpMock.flush();

        // assert
        expect(controller.MessageStatus).toBe(404);

        expect(controller.Id).toBe(0);
        expect(controller.Name).toBe("");
        expect(controller.Status).toBe("");
        expect(controller.IsNew).toBe(true);
    });

    it("retrieve() [next]", () => {
        // arrange
        var controller: FooManagerController = createController();

        // flusheamos las peticiones de construcción del controlador
        $httpMock.flush();

        controller.IsNew = true;

        controller.Id = 10;
        controller.Name = "TestName";
        controller.Status = "TestStatus";

        $httpMock
            .expectGET("http://localhost/Kash.JSTSUT.Web/api/Foos/10/nextId")
            .respond(200, 15);


        $httpMock
            .expectGET("http://localhost/Kash.JSTSUT.Web/api/Foos/15")
            .respond(200, { Id: 15, Name: "1555", Status: "1555" });

        // act
        controller.Retrieve("next");
        $httpMock.flush();

        // assert
        expect(controller.Id).toBe(15);
        expect(controller.Name).toBe("1555");
        expect(controller.Status).toBe("1555");

        expect(controller.IsNew).toBe(false);
    });

    it("retrieve() [next_notfound]", () => {
        // arrange
        var controller: FooManagerController = createController();

        // flusheamos las peticiones de construcción del controlador
        $httpMock.flush();

        controller.IsNew = true;

        controller.Id = 10;
        controller.Name = "TestName";
        controller.Status = "TestStatus";

        $httpMock
            .expectGET("http://localhost/Kash.JSTSUT.Web/api/Foos/10/nextId")
            .respond(404);

        // act
        controller.Retrieve("next");
        $httpMock.flush();

        // assert
        expect(controller.MessageStatus).toBe(404);

        expect(controller.Id).toBe(0);
        expect(controller.Name).toBe("");
        expect(controller.Status).toBe("");
        expect(controller.IsNew).toBe(true);
    });

    it("retrieve() [next_getid_notfound]", () => {
        // arrange
        var controller: FooManagerController = createController();

        // flusheamos las peticiones de construcción del controlador
        $httpMock.flush();

        controller.IsNew = true;

        controller.Id = 10;
        controller.Name = "TestName";
        controller.Status = "TestStatus";

        $httpMock
            .expectGET("http://localhost/Kash.JSTSUT.Web/api/Foos/10/nextId")
            .respond(200, 15);


        $httpMock
            .expectGET("http://localhost/Kash.JSTSUT.Web/api/Foos/15")
            .respond(404);

        // act
        controller.Retrieve("next");
        $httpMock.flush();

        // assert
        expect(controller.MessageStatus).toBe(404);

        expect(controller.Id).toBe(0);
        expect(controller.Name).toBe("");
        expect(controller.Status).toBe("");
        expect(controller.IsNew).toBe(true);
    });

    it("new()", () => {
        // arrange
        var controller: FooManagerController = createController();

        // flusheamos las peticiones de construcción del controlador
        $httpMock.flush();

        // act
        controller.New();

        // assert
        expect(controller.Id).toBe(0);
        expect(controller.Name).toBe("");
        expect(controller.Status).toBe("");
    });
});