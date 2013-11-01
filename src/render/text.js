function TextRender() {

    this.getName = function() {
        return "Raw text";
    };

    this.getConfigDisplay = function() {
        return "";
    };

    this.render = function(data) {
        $("#displayarea").empty().append($("<span>").addClass("wordwrap").text(data));
    };
};
