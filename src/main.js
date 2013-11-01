(function() {
    var lSystem = new LSystem();
    var generationCount = 5;

    var renderers = new Array();
    var selectedRenderer = undefined;

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

    var onAddNewProduction = function() {
        var prod = $("#newprod").val();
        var ret = lSystem.addProduction(prod);
        if (typeof ret == "string") {
            alert(ret);
        } else {
            createProductionDisplay(prod);
            $("#newprod").val("");
        }
    };

    var onStart = function() {
        var ret = lSystem.setAxiom($("#axiom").val());
        if (typeof ret == "string") {
            alert(ret);
        } else {
            $("#render").empty().append($("<span>").addClass("wordwrap").text(lSystem.runGenerations(generationCount)));
        }

    };

    $(function() {
        initRenderers();
        resizeCanvas();
        bindControls();
    });

    var initRenderers = function() {
        renderers.push(new NullRender());
        renderers.push(new TurtleRender());
    };

    var resizeCanvas = function() {
        // Size the canvas to the display area
        var canvas = document.getElementById("rendering");
        var displayArea = document.getElementById("displayarea");
        canvas.width = displayArea.clientWidth - 4;
        canvas.height = displayArea.clientHeight - 4;
    };

    var bindControls = function() {
        // Pressing "Enter" on the new production entry adds the production to the system
        $("#newprod").keypress(function(e) {
            if (e.which == 13) {
                e.preventDefault();
                onAddNewProduction();
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

        // Bind the Start button to starting this show
        $("#start").click(function() { onStart(); });

        // Bind the render selector
        $("#renderselect").change(function() {
            selectedRenderer = renderers[this.value];
            var config = selectedRenderer.getConfigDisplay();
            $("#renderexplain").html(config);
        });
        $("#renderselect").change();
    };

})();
