function TurtleRender() {

    var angle = 90.0;

    var DEBUGGING = false;

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

        var currDir = self.EAST;

        // Parse the incoming data to figure out how big the render will be
        var x = 0, y = 0;
        var minX = x, maxX = x, minY = y, maxY = y;
        var coords = new Array();

        for (var i = 0; i < data.length; i++) {
            var c = data.charAt(i);
            switch (c)
            {
                case 'F':
                    coords.push(currDir);
                    x += currDir.x;
                    y += currDir.y;
                    if (x > maxX) maxX = x;
                    if (x < minX) minX = x;
                    if (y > maxY) maxY = y;
                    if (y < minY) minY = y;
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

        // Render loop: clear the canvas, figure out the starting location, draw lines
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, $canvas.width(), $canvas.height());
        context.fillStyle = "#000000";

        // Determine the step size so that the render is scaled to the canvas dimensions
        var step = $canvas.width() / (maxX - minX);
        if ((step * (maxY - minY)) > $canvas.height())
        {
            step = $canvas.height() / (maxY - minY);
        }

        // Center the render in the canvas
        var renderWidth = (maxX - minX) * step, renderHeight = (maxY - minY) * step;
        var renderX = $canvas.width() / 2, renderY = $canvas.height() / 2;
        x = renderX + (renderWidth / 2) - maxX * step;
        y = renderY - (renderHeight / 2) - minY * step;

        if (DEBUGGING)
        {
            // Mark starting point and draw a bounding box
            context.beginPath();
            context.arc(x, y, 10, 10, 0, 2 * Math.PI);
            context.rect(renderX - (renderWidth / 2), renderY - (renderHeight / 2), renderWidth, renderHeight);
            context.stroke();
        }

        
        context.beginPath();
        for (var i = 0; i < coords.length; i++) {
            context.moveTo(x, y);
            x += coords[i].x * step;
            y += coords[i].y * step;
            context.lineTo(x, y);
        }
        context.stroke();
    };

    var self = {
        getRenderCanvas : function() {
            var $obj = $("#TurtleRenderCanvas");
            if ($obj.length == 0) {
                var $displayArea = $("#displayarea");
                $obj = $("<canvas />", { id : "TurtleRenderCanvas" })
                    .attr( { "width" : $displayArea.width() - 4,
                             "height" : $displayArea.height() - 4 });

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
