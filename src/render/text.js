function TextRender() {

    this.getName = function() {
        return "Raw text";
    };

    this.getConfigDisplay = function() {
        return "";
    };

    this.stopRender = function() {
        // no-op
    };

    this.render = function(data, onFinished) {
        $("#displayarea").empty().append($("<span>").addClass("wordwrap").text(data));
        onFinished();
    };
};
