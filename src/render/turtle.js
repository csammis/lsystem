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

    this.preRender = function() {
    };

    this.doRender = function(data) {
    };

    this.postRender = function() {
    };
};
