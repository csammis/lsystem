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

    var onAddNewProduction = function(prod) {
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
            var output = lSystem.runGenerations(generationCount);
            selectedRenderer.render(output);
        }
    };

    $(function() {
        initRenderers();
        bindControls();
        parseUri();
    });

    var initRenderers = function() {
        renderers.push(new TextRender());
        renderers.push(new TurtleRender());

        var $select = $("#renderselect");
        $.each(renderers, function (i, renderer) {
            $select.append($("<option>", { value: i, text: renderer.getName() }));
        });
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
                onAddNewProduction(this.value);
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

    var parseUri = function() {
        var uri = window.location.search.substring(1);
        var uriParts = uri.split("&");
        for (var i = 0; i < uriParts.length; i++) {
            var paramParts = uriParts[i].split("=");
            var paramName = decodeURIComponent(paramParts[0]);
            var paramValue = decodeURIComponent(paramParts[1]);

            if (paramName == "axiom") {
                $("#axiom").val(paramValue);
            }
            else if (paramName.substring(0, 4) == "prod") {
                onAddNewProduction(paramValue);
            }
            else if (paramName == "gens") {
                $("#generations").val(paramValue);
                $("#generations").change();
            }
            else if (paramName == "renderer") {
                $("#renderselect").val(paramValue);
                $("#renderselect").change();
            }
        }
    };

})();
