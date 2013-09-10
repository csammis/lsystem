describe("A set of tests for an l-system production", function() {

    it("Production creates OK when given lhs and rhs", function() {
        expect(lsystem.production({lhs: "A", rhs: "BA"})).toNotEqual(jasmine.any(String));
    });

    it("Can't create a production without both lhs and rhs", function() {
        expect(lsystem.production({ })).toMatch(/ERROR/);
        expect(lsystem.production({lhs: "A"})).toMatch(/ERROR/);
        expect(lsystem.production({rhs: "A"})).toMatch(/ERROR/);
    });

    it("Can't create a production with an empty lhs", function() {
        expect(lsystem.production({lhs: "", rhs: "BA"})).toMatch(/ERROR/);
    });

    it("Production A -> BA on A yields BA", function() {
        var p = lsystem.production({lhs: "A", rhs: "BA"});
        expect(p.produce("A")).toEqual("BA");
    });

    it("Production A -> BA on B yields B", function() {
        var p = lsystem.production({lhs: "A", rhs: "BA"});
        expect(p.produce("B")).toEqual("B");
    });

    it("Production A -> BA on ABBAABABA yields BABBBABABBABBA", function() {
        var p = lsystem.production({lhs: "A", rhs: "BA"});
        expect(p.produce("ABBAABABA")).toEqual("BABBBABABBABBA");
    });
});

describe("A set of tests for l-system production synthesis", function() {
    it("Production is created given an input of the correct form", function() {
        var prod = lsystem.createProduction("A -> BA");
        expect(prod).toNotEqual(jasmine.any(String));
    });

    it("A production is not created given an input with incorrect form", function() {
        expect(lsystem.createProduction("A => BA")).toMatch(/ERROR/);
    });
});

describe("A set of tests for runGenerations", function() {
    it("An error is returned when runGenerations is called with no axiom", function() {
        expect(lsystem.runGenerations(1)).toMatch(/ERROR/);
    });

    it("An error is returned when runGenerations is called with no argument", function() {
        lsystem.axiom = "A";
        expect(lsystem.runGenerations()).toMatch(/ERROR/);
    });

    it("An error is returned when runGenerations is called with non-numeric argument", function() {
        lsystem.axiom = "A";
        expect(lsystem.runGenerations("A")).toMatch(/ERROR/);
    });
});
