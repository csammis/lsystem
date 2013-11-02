function TurtleRender() {

    var angle = 90.0;

    this.getName = function() {
        return "Turtle graphics";
    };

    this.getConfigDisplay = function() {
        return "<b>F</b>: move forward<br />" +
            "<b>L</b>: turn left by " + angle + "&deg;<br />" +
            "<b>R</b>: turn right by " + angle + "&deg;<br />";
    };

    this.render = function(data) {
        var $canvas = self.getRenderCanvas();
    };

    var self = {
        getRenderCanvas : function() {
            var $obj = $("#TurtleRenderCanvas");
            if ($obj.length == 0) {
                var $displayArea = $("#displayarea");
                $obj = $("<canvas />", { id : "TurtleRenderCanvas" })
                    .attr( { "width" : $displayArea.width() - 4,
                             "height" : $displayArea.height() - 4 })
                    .css("border", "solid 1px black");

                $displayArea.empty();
                $displayArea.append($obj);
            }
            return $obj;
        }
    };
};
