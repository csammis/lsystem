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
        var context = $canvas[0].getContext('2d');

        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, $canvas.width(), $canvas.height());

        var currDir = self.EAST, step = 5;
        var x = ($canvas.width() / 2), y = ($canvas.height() / 2);

        context.fillStyle = "#000000";
        for (var i = 0; i < data.length; i++) {
            var c = data.charAt(i);
            switch (c)
            {
                case 'F':
                    context.beginPath();
                    context.moveTo(x, y);
                    x += currDir.x * step;
                    y += currDir.y * step;
                    context.lineTo(x, y);
                    context.stroke();
                    break;
                case 'L':
                    if (currDir == self.NORTH) currDir = self.WEST;
                    else if (currDir == self.WEST) currDir = self.SOUTH;
                    else if (currDir == self.SOUTH) currDir = self.EAST;
                    else if (currDir == self.EAST) currDir = self.NORTH;
                    break;
                case 'R':
                    if (currDir == self.NORTH) currDir = self.EAST;
                    else if (currDir == self.EAST) currDir = self.SOUTH;
                    else if (currDir == self.SOUTH) currDir = self.WEST;
                    else if (currDir == self.WEST) currDir = self.NORTH;
                    break;
            }
        }
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
        },

        NORTH : { x : 0, y : -1 },
        SOUTH : { x : 0, y : 1 },
        EAST : {x : 1, y : 0},
        WEST : {x : -1, y : 0}
    };
};
