var lsystem = {
    // lhs: string, rhs: string
    production : function(spec) {
        if (spec.lhs === undefined || spec.lhs.length == 0 || spec.rhs === undefined) {
            return "ERROR - must specify lhs and rhs";
        };

        var that = { };

        that.produce = function(input) {
            if (input.substr(spec.lhs.length * -1) == spec.lhs) {
                return input.slice(0, (input.length - spec.lhs.length) + 1) + spec.rhs; 
            }

            return input;
        };

        return that;
    }
};
