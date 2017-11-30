/**
 * Created by qu on 2017/4/2.
 */

$(document).ready(function() {
    $("#taketest").on("click", function() {
        $("#pane").fadeOut();
    });
    $("#beijing").on("click", function() {
        $("#pane2").fadeOut();
        load();
    });
    $("#shanghai").on("click", function() {
        $("#pane2").fadeOut();
        load();
    });
})