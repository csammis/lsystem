describe("LSystem.addProduction", function() {
    var lSystem = { };

    beforeEach(function() {
        lSystem = new LSystem();
    });

    it("Argument must be supplied", function() {
        expect(lSystem.addProduction()).toMatch(/ERROR/);
    });

    it("Argument must be in form lhs -> rhs", function() {
        expect(lSystem.addProduction("foo")).toMatch(/ERROR/);
    });

    it("Caller must supply a non-blank LHS", function() {
        expect(lSystem.addProduction(" -> rhs")).toMatch(/ERROR/);
    });

    it("Well-formed production is added", function() {
        expect(lSystem.addProduction("lhs -> rhs")).toBe(lSystem);
    });

    it("addProduction chains correctly", function() {
        expect(lSystem.addProduction("A -> B").addProduction("B -> C")).toBe(lSystem);
    });
});

describe("LSystem.setAxiom", function() {
    var lSystem = { };

    beforeEach(function() {
        lSystem = new LSystem();
    });

    it("Argument must be supplied", function() {
        expect(lSystem.setAxiom()).toMatch(/ERROR/);
    });

    it("Argument cannot be empty", function() {
        expect(lSystem.setAxiom("")).toMatch(/ERROR/);
    });

    it("Well-formed axiom is added", function() {
        expect(lSystem.setAxiom("A")).toBe(lSystem);
    });

    it("setAxiom chains correctly", function() {
        expect(lSystem.setAxiom("A").setAxiom("B")).toBe(lSystem);
    });
});

describe("LSystem.runGenerations: Lindenmayer's algae l-system", function() {
    
    var lSystem = { };
    
    beforeEach(function() {
        lSystem = new LSystem();
        lSystem.addProduction("A -> AB")
            .addProduction("B -> A")
            .setAxiom("A");
    });

    it("generation 1", function() {
        expect(lSystem.runGenerations(1)).toEqual("AB");
    });

    it("generation 2", function() {
        expect(lSystem.runGenerations(2)).toEqual("ABA");
    });

    it("generation 3", function() {
        expect(lSystem.runGenerations(3)).toEqual("ABAAB");
    });

    it("generation 4", function() {
        expect(lSystem.runGenerations(4)).toEqual("ABAABABA");
    });
});
