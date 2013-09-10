describe("A set of tests for l-system production synthesis", function() {
    it("Production is created given an input of the correct form", function() {
        var prod = lsystem.createProduction("A -> BA");
        expect(prod).toNotEqual(jasmine.any(String));
    });

    it("Can't create a production with incorrect form", function() {
        expect(lsystem.createProduction("A => BA")).toMatch(/ERROR/);
    });

    it("Can't create a production with no input", function() {
        expect(lsystem.createProduction()).toMatch(/ERROR/);
    });

    it("Can't create a production with an empty lhs", function() {
        expect(lsystem.createProduction(" -> BA")).toMatch(/ERROR/);
    });

    it("Production A -> BA on A yields BA", function() {
        var p = lsystem.createProduction("A -> BA");
        expect(p.produce("A")).toEqual("BA");
    });

    it("Production A -> BA on B yields B", function() {
        var p = lsystem.createProduction("A -> BA");
        expect(p.produce("B")).toEqual("B");
    });

    it("Production A -> BA on ABBAABABA yields BABBBABABBABBA", function() {
        var p = lsystem.createProduction("A -> BA");
        expect(p.produce("ABBAABABA")).toEqual("BABBBABABBABBA");
    });

    it("Production A -> \u03b5 on A yields \u03b5", function() {
        var p = lsystem.createProduction("A ->");
        expect(p.produce("A")).toEqual("");
    });

    it("Production A -> \u03b5 on BA yields B", function() {
        var p = lsystem.createProduction("A ->");
        expect(p.produce("BA")).toEqual("B");
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
