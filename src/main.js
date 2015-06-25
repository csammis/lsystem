(function() {
    var lSystem = new LSystem();
    var generationCount = 5;

    var renderers = new Array();
    var selectedRenderer = undefined;

    var createProductionDisplay = function(prod) {
        var $production = $('<div>').addClass('production')
                                    .hover(
                                        function() { $(this).addClass("productionHover"); },
                                        function() { $(this).removeClass("productionHover"); }
                                    );

        var $spancontainer = $('<span>').addClass('productioncontainer').appendTo($production);
        $("<span>").addClass("productiontext").text(prod).click(function() {
            var $stash = $(this);
            var preEditProd = $stash.text();
            $stash.detach();

            var finished = function() { $spancontainer.empty(); $stash.appendTo($spancontainer); };

            var $edit = $('<input>').attr('type', 'text').addClass('productionedit').val(preEditProd).appendTo($spancontainer);
            $edit.keydown(function(event) {
                if (event.which == 13) {
                    event.preventDefault();
                    lSystem.removeProduction(preEditProd);
                    var newProd = $edit.val();
                    if (newProd == '') {
                        $stash.remove();
                        $production.remove();
                    } else {
                        var retval = lSystem.addProduction(newProd);
                        if (typeof retval == 'string') {
                            alert(retval);
                            lSystem.addProduction(preEditProd);
                        } else {
                            $stash.text(newProd);
                            finished();
                        }
                    }
                } else if (event.which == 27) {
                    event.preventDefault();
                    finished();
                }
            }).focus().select();
        })
        .appendTo($spancontainer);

        $('#productions').append($production);
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
            $("#start-stopper-block-stopped").hide();
            $("#start-stopper-block-started").show();
            var output = lSystem.runGenerations(generationCount);
            selectedRenderer.render(output, function() {
                $("#start-stopper-block-started").hide();
                $("#start-stopper-block-stopped").show();
            });
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
        $("#start-stopper-block-stopped").click(function() { onStart(); });
        $("#start-stopper-block-started").hide();
        $("#start-stopper-block-started").css("visibility", "visible");

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
