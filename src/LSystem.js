function LSystem() {
    var system = new Array();
    var axiom = "";

    var self = this;

    this.addProduction = function(prod) {
        if (typeof prod == "undefined") {
            return "ERROR - must be given a production of the form 'lhs -> rhs'";
        }

        var parts = prod.trim().split("->");
        if (parts.length != 2) {
            return "ERROR - production must be of the form 'lhs -> rhs'";
        }

        var lhs = parts[0].trim(), rhs = parts[1].trim();
        if (lhs.length == 0) {
            return "ERROR - no LHS symbol in production";
        }

        system.push({l : lhs, r : rhs});
        return self;
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

    this.runGenerations = function(gens) {

        var result = axiom;
        for (var g = 0; g < gens; g++) {
            var output = "";

            nextSymbol: for (var i = 0; i < result.length; ) {
                var foundNonterminal = false;
                for (var p = 0; p < system.length; p++) {
                    var lhs = system[p].l, rhs = system[p].r;
                    if (result.substr(i, lhs.length) == lhs) {
                        output += rhs;
                        i += lhs.length;
                        continue nextSymbol;
                    }
                }

                // Handling the identity function by assuming that each non-recognized terminal is of length 1
                output += result.charAt(i);
                i++;
            }
            result = output;
        }
        return result;
    };
};
