(function() {
    var lSystem = new LSystem();

    var createProductionDisplay = function(prod) {
        $("#control").append(
            $("<div>").addClass("production").append(
                $("<span>").addClass("productiontext").text(prod)
            ).hover(
                function() { $(this).addClass("productionHover"); },
                function() { $(this).removeClass("productionHover"); }
            )
        );
    };

    $(function() {
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
    });


})();
