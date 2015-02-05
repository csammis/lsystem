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

describe("LSystem.addProduction - stochastic", function () {
    var lSystem = { };

    beforeEach(function() {
        lSystem = new LSystem();
    });

    it("Well-formed stochastic production is added", function() {
        expect(lSystem.addProduction("A : 0.3 -> B")).toBe(lSystem);
    });

    it("Stochastic production must be in the form lhs : probability -> rhs", function() {
        expect(lSystem.addProduction("A : 0.1 : 0.2 -> B")).toMatch(/ERROR/);
    });

    it("Probability of production must be in the range [0.0, 1.0) - testing lower bound", function () {
        expect(lSystem.addProduction("A : -0.1 -> B")).toMatch(/ERROR/);
    });

    it("Probability of production must be in the range [0.0, 1.0) - testing upper bound", function () {
        expect(lSystem.addProduction("A : 1.0 -> B")).toMatch(/ERROR/);
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

describe("LSystem.validateProbabilities", function() {
    var lSystem = { };

    beforeEach(function() {
        lSystem = new LSystem();
    });

    it("validateProbabilities with zero rules is successful", function () {
        expect(lSystem.validateProbabilities()).toBe(true);
    });

    it("validateProbabilities with non-stochastic rules is successful", function() {
        expect(lSystem.addProduction("A -> AB")
            .addProduction("B -> A")
            .validateProbabilities()).toBe(true);
    });

    it("validateProbabilities with stochastic rules totaling 1.0 is successful", function() {
        expect(lSystem.addProduction("A : 0.4 -> AB")
            .addProduction("A : 0.6 -> ABAB")
            .validateProbabilities()).toBe(true);
    });

    it("validateProbabilties with stochastic rules not totaling 1.0 fails correctly", function () {
        expect(lSystem.addProduction("A : 0.4 -> AB")
            .addProduction("A : 0.5 -> ABAB")
            .validateProbabilities()).toBe(false);
    });
});

describe("LSystem.runGenerations: stochastic productions (approximate)", function() {
    var lSystem = { };
    var inputCount = 1000;
    var randomIndex = 0;
    var randomArray = { };

    var mockRandom = function () {
        var retval = randomArray[randomIndex];
        randomIndex++;
        return retval;
    };

    var initMockRandom = function() {
        randomIndex = 0;
        randomArray = new Array();
        for (var i = 0; i < inputCount; i++) {
            randomArray.push(i / inputCount);
        }

    };

    beforeEach(function() {
        initMockRandom();
        spyOn(Math, "random").and.callFake(mockRandom);

        lSystem = new LSystem();
        var axiom = "";
        for (var i = 0; i < inputCount; i++) {
            axiom = axiom + "A";
        }
        lSystem.setAxiom(axiom);
    });

    it("runGenerations functions correctly with two stochastic rules", function() {
        var output = lSystem.addProduction("A : 0.3 -> B")
                            .addProduction("A : 0.7 -> C")
                            .runGenerations(1);
        var aCount = 0, bCount = 0, cCount = 0;
        for (var i = 0; i < inputCount; i++) {
            if (output.charAt(i) == 'A') aCount++;
            if (output.charAt(i) == 'B') bCount++;
            if (output.charAt(i) == 'C') cCount++;
        }

        expect(aCount).toBe(0);
        expect(bCount).toBe(inputCount * 0.3);
        expect(cCount).toBe(inputCount * 0.7);
    });

    it("runGenerations functions correctly with three stochastic rules", function() {
        var output = lSystem.addProduction("A : 0.25 -> B")
                            .addProduction("A : 0.53 -> C")
                            .addProduction("A : 0.22 -> D")
                            .runGenerations(1);
        var aCount = 0, bCount = 0, cCount = 0, dCount = 0;
        for (var i = 0; i < inputCount; i++) {
            if (output.charAt(i) == 'A') aCount++;
            if (output.charAt(i) == 'B') bCount++;
            if (output.charAt(i) == 'C') cCount++;
            if (output.charAt(i) == 'D') dCount++;
        }

        expect(aCount).toBe(0);
        expect(bCount).toBe(inputCount * 0.25);
        expect(cCount).toBe(inputCount * 0.53);
        expect(dCount).toBe(inputCount * 0.22);
    });
});

describe("LSystem.runGenerations: parametric evaluation", function() {
    var lSystem = { };

    beforeEach(function() {
        lSystem = new LSystem();
        lSystem.setAxiom("B(x)");
    });

    it("B(x) -> A over B(x) produces A", function() {
        expect(lSystem.addProduction("B(x) -> A").runGenerations(1)).toEqual("A");
    });

    it("B() -> A over B(x) produces A", function() {
        expect(lSystem.addProduction("B() -> A").runGenerations(1)).toEqual("A");
    });

    it("B -> A over B(x) produces A(x)", function() {
        expect(lSystem.addProduction("B -> A").runGenerations(1)).toEqual("A(x)");
    });

    it("B() -> A over BAB(x) produces garbage", function() {
        expect(lSystem.setAxiom("BAB(x)").addProduction("B() -> A")).not.toEqual("AAA");
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

    it("generation 0", function() {
        expect(lSystem.runGenerations(0)).toEqual("A");
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

describe("LSystem.runGenerations: Koch curve", function() {

    var lSystem = { };

    beforeEach(function() {
        lSystem = new LSystem();
        lSystem.addProduction("F -> F+F-F-F+F").setAxiom("F");
    });

    it("generation 0", function() {
        expect(lSystem.runGenerations(0)).toEqual("F");
    });

    it("generation 1", function() {
        expect(lSystem.runGenerations(1)).toEqual("F+F-F-F+F");
    });

    it("generation 2", function() {
        expect(lSystem.runGenerations(2)).toEqual("F+F-F-F+F+F+F-F-F+F-F+F-F-F+F-F+F-F-F+F+F+F-F-F+F");
    });

    it("generation 3", function() {
        expect(lSystem.runGenerations(3)).toEqual("F+F-F-F+F+F+F-F-F+F-F+F-F-F+F-F+F-F-F+F+F+F-F-F+F+F+F-F-F+F+F+F-F-F+F-F+F-F-F+F-F+F-F-F+F+F+F-F-F+F-F+F-F-F+F+F+F-F-F+F-F+F-F-F+F-F+F-F-F+F+F+F-F-F+F-F+F-F-F+F+F+F-F-F+F-F+F-F-F+F-F+F-F-F+F+F+F-F-F+F+F+F-F-F+F+F+F-F-F+F-F+F-F-F+F-F+F-F-F+F+F+F-F-F+F");
    });
});
