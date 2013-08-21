describe("A set of tests for an l-system production", function() {

    it("Production creates OK when given lhs and rhs", function() {
        expect(lsystem.production({lhs: "A", rhs: "BA"})).toEqual(jasmine.any(Object));
    });

    it("Can't create a production without both lhs and rhs", function() {
        expect(lsystem.production({ })).toMatch(/ERROR/);
        expect(lsystem.production({lhs: "A"})).toMatch(/ERROR/);
        expect(lsystem.production({rhs: "A"})).toMatch(/ERROR/);
    });

    it("Can't create a production with an empty lhs", function() {
        expect(lsystem.production({lhs: "", rhs: "BA"})).toMatch(/ERROR/);
    });

    it("Production A -> BA on A yields ABA", function() {
        var p = lsystem.production({lhs: "A", rhs: "BA"});
        expect(p.produce("A")).toEqual("ABA");
    });

    it("Production A -> BA on B yields B", function() {
        var p = lsystem.production({lhs: "A", rhs: "BA"});
        expect(p.produce("B")).toEqual("B");
    });

    it("Production A -> BA on ABBAABABA yields ABBAABABABA", function() {
        var p = lsystem.production({lhs: "A", rhs: "BA"});
        expect(p.produce("ABBAABABA")).toEqual("ABBAABABABA");
    });
});
