/**
 * Created by qu on 2017/4/2.
 */
function load2() {

    var pane = document.getElementById('pane');

    function touch2(event) {
        var shanghaiX = $('.shanghai').offset().left;
        var shanghaiY = $('.shanghai').offset().top;
        var beijingX = $('.beijing').offset().left;
        var beijingY = $('.beijing').offset().top;
        switch (event.type) {
            case "touchstart":
                console.log(1);
            case "touchmove":
                event.preventDefault();
                event.stopPropagation();
                console.log(2);
            case "touchend":
                var ox = parseInt(event.touches[0].clientX);
                var oy = parseInt(event.touches[0].clientY);
                if (ox - shanghaiX > 0 && ox - shanghaiX < 100 && oy - shanghaiY > 0 && oy - shanghaiY < 100) {
                    city = 'shanghai';
                    pane.removeEventListener("touchstart", touch2);
                    pane.removeEventListener("touchmove", touch2);
                    pane.removeEventListener("touchend", touch2);
                    load();
                    $("#pane").fadeOut();
                } else if (ox - beijingX > 0 && ox - beijingX < 100 && oy - beijingY > 0 && oy - beijingY < 100) {
                    city = 'beijing';
                    pane.removeEventListener("touchstart", touch2);
                    pane.removeEventListener("touchmove", touch2);
                    pane.removeEventListener("touchend", touch2);
                    load();
                    $("#pane").fadeOut();
                }
        }
    }

    if (pane) {
        pane.addEventListener("touchstart", touch2);
        pane.addEventListener("touchmove", touch2);
        pane.addEventListener("touchend", touch2);
    }
}

window.addEventListener('load',load2,false);