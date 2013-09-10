var lsystem = {

    productions : new Set("productions"),
    
    // Creates a production from a string 'lhs -> rhs';
    createProduction : function(prod) {
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

        var lhsRE = new RegExp(lhs, "g");

        var prod = {
            produce : function(input) {
                if (lhsRE.test(input)) {
                    return input.replace(lhsRE, rhs);
                }
                return "";
            }
        };

        this.productions.add(prod);
        return prod;
    },

    axiom : "",

    clearSystem : function() {
        this.axiom = "";
        this.productions.clear();
    }, 

    runGenerations : function(n) {
        if (this.axiom.trim().length == 0) {
            return "ERROR - no axiom";
        }

        if (typeof n != "number") {
            return "ERROR - runGenerations called without a number of generations";
        }

        if (this.productions.size() == 0) {
            return this.axiom;
        }

        var output = this.axiom;
        var prods = this.productions;
        for (var i = 0; i < n; i++) {
            var generation = "";
            for (var p in prods) {
                if (prods.hasOwnProperty(p) && prods.contains(prods[p])) {
                    generation = generation + prods[p].produce(output);
                }
            }
            output = generation;
        }

        return output;
    }
};
