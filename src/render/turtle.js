function TurtleRender() {

    var DEG2RAD = Math.PI / 180;
    var DEBUGGING = false;

    this.getName = function() {
        return "Turtle graphics";
    };

    this.getConfigDisplay = function() {
        return "<b>L</b>: turn left by 90&deg;<br />" +
            "<b>L(<i>x</i>)</b>: turn left by <i>x</i>&deg;<br />" +
            "<b>R</b>: turn right by 90&deg;<br />" +
            "<b>R(<i>x</i>)</b>: turn right by <i>x</i>&deg;<br />" +
            "<b>Other letters</b>: move forward";
    };

    this.render = function(data) {
        var $canvas = self.getRenderCanvas();
        var context = $canvas[0].getContext('2d');

        var currDir = self.EAST;

        // Parse the incoming data to figure out how big the render will be
        var x = 0, y = 0;
        var minX = x, maxX = x, minY = y, maxY = y;
        var coords = new Array();

        // Store the current heading in angles around a unit circle. Start by heading east.
        var currHeading = 0;

        for (var i = 0; i < data.length; i++) {
            var c = data.charAt(i);
            switch (c) {
                case 'L':
                    if (data.charAt(i + 1) != '(') {
                        currHeading -= 90;
                    } else {
                        var idx = data.indexOf(')', i);
                        var arg = data.substr(i + 2, idx - i - 2);
                        currHeading -= parseInt(arg, 10);
                        i = idx;
                    }
                    break;
                case 'R':
                    if (data.charAt(i + 1) != '(') {
                        currHeading += 90;
                    } else {
                        var idx = data.indexOf(')', i);
                        var arg = data.substr(i + 2, idx - i - 2);
                        currHeading += parseInt(arg, 10);
                        i = idx;
                    }
                    break;
                default:
                    var xDiff = Math.cos(currHeading * DEG2RAD);
                    var yDiff = Math.sin(currHeading * DEG2RAD);
                    coords.push({x: xDiff, y: yDiff});
                    x += xDiff;
                    y += yDiff;
                    if (x > maxX) maxX = x;
                    if (x < minX) minX = x;
                    if (y > maxY) maxY = y;
                    if (y < minY) minY = y;
                    break;
            }
        }

        // Render loop: clear the canvas, figure out the starting location, draw lines
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, $canvas.width(), $canvas.height());
        context.fillStyle = "#000000";

        // Determine the step size so that the render is scaled to the canvas dimensions
        var step = $canvas.width() / (maxX - minX);
        if ((step * (maxY - minY)) > $canvas.height()) {
            step = $canvas.height() / (maxY - minY);
        }

        // Center the render in the canvas
        var renderWidth = (maxX - minX) * step, renderHeight = (maxY - minY) * step;
        var renderX = $canvas.width() / 2, renderY = $canvas.height() / 2;
        x = renderX + (renderWidth / 2) - maxX * step;
        y = renderY - (renderHeight / 2) - minY * step;

        if (DEBUGGING) {
            // Mark starting point and draw a bounding box
            context.beginPath();
            context.arc(x, y, 10, 10, 0, 2 * Math.PI);
            context.stroke();
        }

        
        context.beginPath();
        for (var i = 0; i < coords.length; i++) {
            context.moveTo(x, y);
            x += coords[i].x * step;
            y += coords[i].y * step;
            context.lineTo(x, y);
            if (DEBUGGING) {
                var text = "(" + x + "," + y + ")";
                context.fillText(text, x, y);
                console.log(text);
            }
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
