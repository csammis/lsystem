(function() {
    var lSystem = new LSystem();
    var generationCount = 5;

    var createProductionDisplay = function(prod) {
        $("#productions").append(
            $("<div>").addClass("production").append(
                $("<span>").addClass("productiontext").text(prod)
            ).hover(
                function() { $(this).addClass("productionHover"); },
                function() { $(this).removeClass("productionHover"); }
            )
        );
    };

    $(function() {
        // Pressing "Enter" on the new production entry adds the production to the system
        $("#newprod").keypress(function(e) {
            if (e.which == 13) {
                e.preventDefault();

                var prod = this.value;
                var ret = lSystem.addProduction(prod);
                if (typeof ret == "string") {
                    alert(ret);
                } else {
                    createProductionDisplay(prod);
                    this.value = "";
                }
            }
        });

        // Bind the generations slider to a backing value
        var $generationCountValue = $("#generationValue");
        $("#generations").change(function() {
            generationCount = this.value * 1.0;
            $generationCountValue.html("Generations (" + this.value + ")");
        });
        $("#generations").val(generationCount);
        $("#generations").change();
    });


})();
