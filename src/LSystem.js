function LSystem() {
    var system = { };
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

        system[lhs] = rhs;
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
            for (var i = 0; i < result.length; ) {
                for (var p in system) {
                    if (system.hasOwnProperty(p) && result.substr(i, p.length) == p) {
                        output += system[p];
                        i += p.length;
                        break;
                    }
                }
            }
            result = output;
        }
        return result;
    };
};
