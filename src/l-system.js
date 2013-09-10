var lsystem = {
    // lhs: string, rhs: string
    production : function(spec) {
        if (spec.lhs === undefined || spec.lhs.length == 0 || spec.rhs === undefined) {
            return "ERROR - must specify lhs and rhs";
        };

        var lhsRE = new RegExp(spec.lhs, "g");

        var that = { };

        that.produce = function(input) {
            return input.replace(lhsRE, spec.rhs);
        };

        return that;
    },

    // Utility to create a production from a string 'lhs -> rhs';
    createProduction : function(prod) {
        var parts = prod.trim().split("->");
        if (parts.length != 2)
        {
            return "ERROR - production must be of the form 'lhs -> rhs'";
        }

        return this.production({lhs: parts[0].trim(), rhs : parts[1].trim()});
    },

    axiom : "",

    runGenerations : function(n) {
        if (this.axiom.trim().length == 0) {
            return "ERROR - no axiom";
        }

        if (typeof n != "number") {
            return "ERROR - runGenerations called without a number of generations";
        }

        return axiom;
    }
};
