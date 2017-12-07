/**
 * Created by qu on 2017/3/25.
 */

var totalgoal = 0;
var global_pic_arr = [];
var pic_index = 0;
var pic_index_max = 10;
var ip_local = '0.0.0.0';
var city = 'beijing';
var pass_count = 0;
var finished = false;
var question_index = 1;
function load() {
    init_pan();
    var url;
    if (city == 'shanghai') {
        url = '/streetgame/backstage/load.php?city_index=0';
    } else if (city == 'beijing') {
        url = '/streetgame/backstage/load.php?city_index=1';
    }
    pic_arr = load_request(url, 1000, update_pic);
    document.addEventListener('touchstart', touch, false);
    document.addEventListener('touchmove', touch, false);
    document.addEventListener('touchend', touch, false);
    var isdown = false;
    var angle = 0;
    var startangle = 0;
    var oldangle = 0;
    var plateX = $('#testcss').offset().left + 125;
    var plateY = $('#testcss').offset().top + 125;
    var istaped = false;
    var istaped_pic = false;
    var ismoved = false;
    function touch(event) {
        var event = event || window.event;

        // var plate = document.getElementById("testcss");
        switch (event.type) {
            case "touchstart":

                var ox = parseInt(event.touches[0].clientX) - parseInt(plateX);//计算出鼠标相对于画布中心的位置
                var oy = parseInt(event.touches[0].clientY) - parseInt(plateY);
                var to = Math.abs(ox / oy);

                startangle = Math.atan(to) / (2 * Math.PI) * 360;//鼠标相对于旋转中心的角度
                if (ox < 0 && oy < 0) {
                    startangle = -startangle;
                } else if (ox < 0 && oy > 0) {
                    startangle = -(180 - startangle)
                } else if (ox > 0 && oy < 0) {
                    startangle = startangle;
                } else if (ox > 0 && oy > 0) {
                    startangle = 180 - startangle;
                }
                startangle -= oldangle;
                if (ox < 125 && ox > -125 && oy < 125 && oy > -125) {
                    isdown = true;
                }
                if (ox < 50 && ox > -50 && oy < 50 && oy > -50) {
                    istaped = true;
                }
                if (event.touches[0].clientY < document.getElementById('imgdiv').offsetHeight) {
                    istaped_pic = true;
                }
                break;
            case "touchend":
                oldangle = angle;
                while (oldangle < 0 || oldangle >= 360) {
                    if (oldangle < 0) {
                        oldangle += 360;
                    } else {
                        oldangle -= 360;
                    }
                }
                if (istaped == true && ismoved == false) {   // 模拟tap事件
                    if (pic_index >= pic_index_max) { // 游戏做完
                        finished = true;
                        send_score(edit_title);
                        show_pane_final();
                        // document.getElementById('score').innerHTML = '总得分：'+totalgoal;
                    } else {
                        var realAngle = Number(global_pic_arr[pic_index]['jpg_direction']);
                        console.log(pic_index + ',' + global_pic_arr[pic_index]['jpg_name'] + ',' + global_pic_arr[pic_index]['jpg_direction']);
                        oldangle = parseInt(oldangle);
                        var diff = Math.abs(oldangle - realAngle);
                        global_pic_arr[pic_index]['user_angle'] = oldangle;
                        var goal = 0;
                        if (diff > 180) {
                            diff = 360 - diff;
                        }
                        if (diff <= 30) {
                            goal = 10;
                        } else if (diff < 90) {
                            goal = parseInt(-(diff - 90) / 6) + 1;
                        } else {
                            goal = 0;
                        }
                        global_pic_arr[pic_index]['user_score'] = goal;
                        totalgoal += goal;
                        pic_index += 1;
                        document.getElementById('total_score').innerHTML = '得分：' + totalgoal;
                        if (pic_index < pic_index_max) {
                            update_pic(global_pic_arr, pic_index);
                            question_index += 1;
                            document.getElementById('question_index').innerHTML = question_index + '/10';
                            $(".circle").each(function () {
                                $(this).removeClass("checked");
                            });
                            $(".circle:eq(" + (question_index - 1) + ")").addClass("checked");
                        } else {
                            finished = true;
                            send_score(edit_title);
                            show_pane_final();
                        }
                    }
                    if (pic_index == 2) {
                        get_ip();
                    }
                    if (pic_index == 5) {
                        console.log(ip_local);
                    }
                }
                if (istaped_pic == true && finished == false) {
                    if (pass_count < 3) {
                        pic_index += 1;
                        update_pic(global_pic_arr, pic_index);
                        pic_index_max += 1;
                        pass_count += 1;
                        istaped_pic = false;
                        // document.getElementById('score').innerHTML = '您还有' + (3 - pass_count) + '次跳过机会';
                    }
                }
                ismoved = false;
                istaped = false;
                isdown = false;
                break;
            case "touchmove":
                event.preventDefault();
                event.stopPropagation();
                ismoved = true;
                // angle = (event.touches[0].clientY - plateY) / (event.touches[0].clientX - plateX)
                if (isdown) {
                    var ox = parseInt(event.touches[0].clientX) - parseInt(plateX);//计算出鼠标相对于画布中心的位置
                    var oy = parseInt(event.touches[0].clientY) - parseInt(plateY);
                    var to = Math.abs(ox / oy);

                    angle = Math.atan(to) / (2 * Math.PI) * 360;//鼠标相对于旋转中心的角度
                    if (ox < 0 && oy < 0) {
                        angle = -angle;
                    } else if (ox < 0 && oy > 0) {
                        angle = -(180 - angle)
                    } else if (ox > 0 && oy < 0) {
                        angle = angle;
                    } else if (ox > 0 && oy > 0) {
                        angle = 180 - angle;
                    }
                    angle -= startangle;
                    angle_ = -angle;
                    $("#testcss").css("transform", "rotate(" + angle + "deg)");
                    $("#N").css("transform", "rotate(" + angle_ + "deg)");
                    $("#W").css("transform", "rotate(" + angle_ + "deg)");
                    $("#S").css("transform", "rotate(" + angle_ + "deg)");
                    $("#E").css("transform", "rotate(" + angle_ + "deg)");
                    $(".angle_numbers").each(function(){
                        $(this).css("transform", "rotate(" + angle_ + "deg)");
                    });
                }
                break;
        }


    }

    function load_request(url, time, callback) {
        var pic_arr = [];
        var request = new XMLHttpRequest();
        var timeout = false;
        var timer = setTimeout(function () {
            timeout = true;
            request.abort();
        }, time);
        request.open("GET", url);
        request.onreadystatechange = function () {
            if (request.readyState !== 4) return;
            if (timeout) return;
            clearTimeout(timer);
            if (request.status === 200) {
                pic_arr = eval('(' + request.response + ')');
                callback(pic_arr);
            }
        }
        request.send(null);
        return pic_arr;
    }

    function update_pic(pic_arr) {
        var i = arguments[1] ? arguments[1] : 0;
        if (city == 'shanghai') {
            document.getElementById("streetimg").src = "http://120.26.51.49/data/streetgame/shanghai_outring_50m/" + pic_arr[i]['jpg_name'] + ".jpg";
        } else if (city == 'beijing') {
            document.getElementById("streetimg").src = "http://120.26.51.49/data/streetgame/beijing_5ring_50m/" + pic_arr[i]['jpg_name'] + ".jpg";
        }
        if (i <= 1) {
            console.log(pic_arr);
            global_pic_arr = pic_arr;
        }
    }

    function get_ip() {
        // var request = new XMLHttpRequest();
        // request.open("GET", "http://jsonip.com/?callback=?");
        // htmlobj=$.ajax({url:"http://jsonip.com/"});
        $.ajax({
            url: "http://pv.sohu.com/cityjson",
            success: function(result){
                console.log(result);
            }
        });
        // $.get("http://pv.sohu.com/cityjson", function(result){
        //     console.log("test");
        //     ip_local = eval('(' + request.response + ')')[0];
        // })
        // request.open("GET", "/streetgame/backstage/load.php?city_index=1/");
        // request.onreadystatechange = function () {
        //     if (request.status == 200) {
        //         console.log(request.response);
        //         ip_local = eval('(' + request.response + ')')[0];
        //     }
        // }
    }

    function send_score(callback) {
        var commit_url = "/streetgame/backstage/commit.php";
        $.post(commit_url, { ip: ip_local, score: totalgoal, detail: global_pic_arr })
            .done(function (data) {
                callback();
            });
    }

    function edit_title() {
        document.title = '方向感测试小游戏\n您的总得分：' + totalgoal;
    }
}



$(document).ready(function () {
    $("#taketest").on("click", function () {
        $("#pane").fadeOut();
    });
    $("#beijing").on("click", function () {
        $("#pane2").fadeOut();
        load();
    });
    $("#shanghai").on("click", function () {
        $("#pane2").fadeOut();
        load();
    });
});



function init_pan() {
    var left_list = [125,180,220,235,220,180, 118,63,22,8,22,62];
    var top_list = [15,29,70,125,180,220, 235,220,180,125,70,29];
    var i = 0;
    $(".angle_numbers").each(function(){
        $(this).css("left", left_list[i]-5);
        $(this).css("top", top_list[i]-8);
        i+=1;
    });
}


var randomScalingFactor = function () {
    return Math.round(Math.random() * 100);
};


function show_pane_final() {
    $("#pane_final").fadeIn(function () {
        $("#main").hide();
        console.log("123");
        function Circle() {
            this.radius = 80;    // 圆环半径
            this.lineWidth = 20;  // 圆环边的宽度
            this.strokeStyle = 'white'; //边的颜色
            this.fillStyle = 'rgb(156,190,183)';  //填充色
            this.lineCap = 'round';
        }

        Circle.prototype.draw = function (ctx) {
            ctx.beginPath();
            ctx.arc(100, 100, this.radius, 0, Math.PI * 2, true);  // 坐标为250的圆，这里起始角度是0，结束角度是Math.PI*2
            ctx.lineWidth = this.lineWidth;
            ctx.strokeStyle = this.strokeStyle;
            ctx.stroke();  // 这里用stroke画一个空心圆，想填充颜色的童鞋可以用fill方法
        };

        function Ring(startAngle, percent) {
            Circle.call(this);
            this.startAngle = startAngle || 3 * Math.PI / 2; //弧起始角度
            this.percent = percent;  //弧占的比例
        }

        Ring.prototype = Object.create(Circle.prototype);

        Ring.prototype.drawRing = function (ctx) {
            this.draw(ctx);
            ctx.beginPath();
            var anglePerSec = 2 * Math.PI / (100 / this.percent); // 蓝色的弧度
            ctx.arc(100, 100, this.radius, this.startAngle, this.startAngle + anglePerSec, false); //这里的圆心坐标要和cirle的保持一致
            ctx.strokeStyle = this.fillStyle;
            ctx.lineCap = this.lineCap;
            ctx.stroke();
            ctx.closePath();
        }

        $("#score-donut").text(totalgoal);
        if (totalgoal > 60) {
            $("#score-rank").text("男友力max的活地图！");
        } else if (totalgoal > 35) {
            $("#score-rank").text("您的方向感超级好！赞！");
        } else if (totalgoal > 15) {
            $("#score-rank").text("亲，出门记得看地图哦！");
        } else {
            $("#score-rank").text("呃，I'm Sorry...");
        }
        var canvas = document.getElementById('canvas');
        var ctx = canvas.getContext('2d');
        var ring = new Ring(0, totalgoal);  // 从2*Math.PI/3弧度开始，进度为50%的环
        ring.drawRing(ctx);
    });
}

// window.addEventListener('load',load,false);
