describe("A set of tests for an l-system production", function() {

    it("Production creates OK when given lhs and rhs", function() {
        expect(l-system.production({lhs: "A", rhs: "BA"}).toEqual(jasmine.any(Function)));
    });

    it("Can't create a production without lhs and rhs", function() {
        expect(l-system.production({ })).toMatch(/ERROR/);
    });
});
