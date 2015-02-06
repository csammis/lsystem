function LSystem() {
    var system = new Array();
    var productionCount = 0;
    var axiom = "";

    var self = this;

    /*
     * A production is represented as:
     *  lhs: string
     *  productions: array of productions whose probability must total 1.0
     *
     * An element in the 'productions' array is represented as:
     *  original: the unparsed string, used for removing a production
     *  rhs: string
     *  probability: float
     */

    this.addProduction = function(prod) {
        if (typeof prod == "undefined") {
            return "ERROR - must be given a production of the form 'lhs -> rhs'";
        }

        var parts = prod.trim().split("->");
        if (parts.length != 2) {
            return "ERROR - production must be of the form 'lhs -> rhs'";
        }

        var left = parts[0].trim(), right = parts[1].trim();
        if (left.length == 0) {
            return "ERROR - no LHS symbol in production";
        }

        var probability = 1.0;
        if (left.indexOf(":") != -1) {
            var leftparts = left.split(":");
            if (leftparts.length != 2) {
                return "ERROR - a stochastic production must be of the form 'lhs : probability -> rhs'";
            }

            left = leftparts[0].trim();
            probability = leftparts[1].trim() * 1.0;
            if (probability < 0 || probability >= 1) {
                return "ERROR - probability of production must be between 0.0 and 1.0";
            }
        }

        var foundLhs = undefined;
        for (var i = 0; i < system.length; i++) {
            if (system[i].lhs == left) {
                foundLhs = system[i];
                break;
            }
        }

        if (typeof foundLhs == "undefined") {
            system.push({lhs : left, productions : new Array() });
            foundLhs = system[system.length - 1];
        }

        foundLhs.productions.push({original: prod, rhs : right, probability : probability});
        productionCount++;
        return self;
    };

    this.removeProduction = function(prod) {
        for (var i = 0; i < system.length; i++) {
            for (var j = 0; j < system[i].productions.length; j++) {
                if (system[i].productions[j].original == prod) {
                    system[i].productions.splice(j, 1);
                    if (system[i].productions.length == 0) {
                        system.splice(i, 1);
                    }
                    productionCount--;
                    break;
                }
            }
        }
        return self;
    };

    this.getProductionCount = function() {
        return productionCount;
    };

    this.setAxiom = function(ax) {
        if (typeof ax == "undefined") {
            return "ERROR - must be given a non-empty string";
        }

        if (ax.length == 0) {
            return "ERROR - Axiom must be a non-empty string";
        }

        axiom = ax;
        return self;
    };

    this.validateProbabilities = function() {
        for (var i = 0; i < system.length; i++) {
            var prod = system[i];
            var total = 0.0;
            for (var j = 0; j < prod.productions.length; j++) {
                total = total + (prod.productions[j].probability);
            }
            if (total != 1.0) {
                return false;
            }
        }
        return true;
    };

    this.runGenerations = function(gens) {

        if (self.validateProbabilities() == false) {
            return "ERROR - production probabilties did not total to 1.0";
        }

        var result = axiom;
        for (var generation = 0; generation < gens; generation++) {
            var output = "";

            nextSymbol:
            for (var index = 0; index < result.length; ) {
                for (var rule = 0; rule < system.length; rule++) {
                    var lhs = system[rule].lhs;
                    var lhsFound = false;
                    var indexIncr = 0;

                    // If the LHS is refering to a parametric expression then the are-we-seeing-this check gets a bit hairy
                    // because requiring the LHS to express the parametric expression seems limited. The production author can
                    // shortcut by specifing an empty set of parantheses on the non-terminal. See the "parametric evaluation" Jasmine spec.

                    if (lhs.substr(lhs.length - 2, 2) == "()") {
                        var token = lhs.substr(0, lhs.length - 2);
                        if (result.substr(index, token.length) == token) {
                            lhsFound = true;
                            var endExpr = result.indexOf(')', index);
                            lhsIncr = endExpr - index + 1;
                        }
                    } else {
                        lhsFound = (result.substr(index, lhs.length) == lhs);
                        lhsIncr = lhs.length;
                    }

                    if (lhsFound) {
                        var rhs = undefined;
                        // Choose the RHS from among the production choices
                        if (system[rule].productions[0].probability == 1.0) {
                            rhs = system[rule].productions[0].rhs;
                        } else {
                            var choice = Math.random();
                            var last = 0.0;
                            for (var i = 0; i < system[rule].productions.length; i++) {
                                if (choice >= last && choice < (last + system[rule].productions[i].probability)) {
                                    rhs = system[rule].productions[i].rhs;
                                    break;
                                }
                                last = last + system[rule].productions[i].probability;
                            }
                        }

                        output += rhs;
                        index += lhsIncr;
                        continue nextSymbol;
                    }
                }

                // Handling the identity function for a non-recognized terminal of length 1
                output += result.charAt(index);
                index++;
            }
            result = output;
        }
        return result;
    };
};
