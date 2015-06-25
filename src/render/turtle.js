function TurtleRender() {

    var DEG2RAD = Math.PI / 180;
    var DEBUGGING = false;

    var stopRenderLoop = false;

    this.getName = function() {
        return "Turtle graphics";
    };

    this.getConfigDisplay = function() {
        return "<b>L</b>: turn left by 90&deg;<br />" +
            "<b>L(<i>x</i>)</b>: turn left by <i>x</i>&deg;<br />" +
            "<b>R</b>: turn right by 90&deg;<br />" +
            "<b>R(<i>x</i>)</b>: turn right by <i>x</i>&deg;<br />" +
            "<b>A,B,F,G</b>: move forward<br />" +
            "<b>[</b>: push position and heading<br />" +
            "<b>]</b>: pop position and heading<br />" +
            "<b>Other characters</b>: control evolution</br /><br />" +
            '<input type="checkbox" id="animateTurtle" checked="checked"/> Animate output';
    };

    var readParameter = function(data, i, defaultValue, func) {
        var newIndex = i;
        if (data.charAt(i + 1) != '(') {
            func(defaultValue);
        } else {
            var idx = data.indexOf(')', i);
            var arg = data.substr(i + 2, idx - i - 2);
            func(arg);
            newIndex = idx;
        }
        return newIndex;
    };

    this.stopRender = function() {
        stopRenderLoop = true;
    };

    this.render = function(data, onFinished) {
        stopRenderLoop = false;

        var $canvas = self.getRenderCanvas();
        var context = $canvas[0].getContext('2d');

        // Parse the incoming data to figure out how big the render will be
        var x = 0, y = 0;
        var minX = x, maxX = x, minY = y, maxY = y;
        var unscaledCoords = new Array();

        // Store the current heading in angles around a unit circle. Start by heading east.
        var currHeading = 0;
        var stack = new Array();

        for (var i = 0; i < data.length; i++) {
            var c = data.charAt(i);
            switch (c) {
                case 'L':
                    i = readParameter(data, i, '90', function(f) { currHeading -= parseInt(f, 10); });
                    break;
                case 'R':
                    i = readParameter(data, i, '90', function(f) { currHeading += parseInt(f, 10); });
                    break;
                case 'A':
                case 'B':
                case 'F':
                case 'G':
                    x += Math.cos(currHeading * DEG2RAD);
                    y += Math.sin(currHeading * DEG2RAD);
                    unscaledCoords.push({x: x, y: y});
                    if (x > maxX) maxX = x;
                    if (x < minX) minX = x;
                    if (y > maxY) maxY = y;
                    if (y < minY) minY = y;
                    break;
                case '[':
                    var o = {x: x, y: y, h: currHeading};
                    stack.push(o);
                    break;
                case ']':
                    var o = stack.pop();
                    x = o.x;
                    y = o.y;
                    currHeading = o.h;
                    //csnote: shouldn't draw a line to the coordinate pushed here
                    unscaledCoords.push({x: x, y: y, nodraw: true});
                    break;
                default:
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
        xOffset = renderX + (renderWidth / 2) - maxX * step;
        yOffset = renderY - (renderHeight / 2) - minY * step;
        
        // Start at the offset coordinates
        x = xOffset; y = yOffset;

        if (DEBUGGING) {
            context.beginPath();
            context.arc(x, y, 10, 10, 0, 2 * Math.PI);
            context.stroke();
        }

        var updateXY = function(iter) {
            context.beginPath();
            context.moveTo(x, y);
            var coord = unscaledCoords[iter];
            x = (coord.x * step) + xOffset;
            y = (coord.y * step) + yOffset;
            if (coord.nodraw === undefined)
            {
                context.lineTo(x, y);
            }
            context.stroke();
            if (DEBUGGING) {
                var text = '(' + x + ',' + y + ')';
                context.fillText(text, x, y);
                console.log(text);
            }
        };

        if ($('#animateTurtle').is(':checked')) {
            var iter = 0;
            var renderFunc = function() {
                updateXY(iter);
                if (iter < (unscaledCoords.length - 1)) {
                    iter++;
                    if (!stopRenderLoop)
                    {
                        requestAnimationFrame(renderFunc);
                    }
                    else
                    {
                        onFinished();
                    }
                }
                else
                {
                    onFinished();
                }
            };
            requestAnimationFrame(renderFunc);
        } else {
            for (var i = 0; i < unscaledCoords.length; i++) {
                updateXY(i);
            }
            onFinished();
        }
    };

    var self = {
        getRenderCanvas : function() {
            var $obj = $("#TurtleRenderCanvas");
            if ($obj.length == 0) {
                var $displayArea = $("#main");
                $obj = $("<canvas />", { id : "TurtleRenderCanvas" })
                    .attr( { "width" : $displayArea.width() - 4,
                             "height" : $displayArea.height() - 4 });

                $displayArea.empty();
                $displayArea.append($obj);
            }
            return $obj;
        }
    };
};
