/**
 * Created by qu on 2017/3/25.
 * 待完成：
 * 1. 初始选择北京还是上海，已完成
 * 2. ip和总分传给我，待完成(ip get不到啊)
 * 3. 3次pass
 * 4. 每次显示角度，完成
 */

var totalgoal = 0;
var global_pic_arr = [];
var pic_index = 0;
var pic_index_max = 10;
var ip_local = '0.0.0.0';
var city = 'beijing';
var pass_count = 0;
var finished = false;
function load(){
    var url;
    if(city == 'shanghai'){
        url = '/streetgame/backstage/load.php?city_index=0';
    }else if(city == 'beijing') {
        url = '/streetgame/backstage/load.php?city_index=1';
    }
    pic_arr = load_request(url,1000, update_pic);
    document.addEventListener('touchstart',touch,false);
    document.addEventListener('touchmove',touch,false);
    document.addEventListener('touchend',touch,false);
    var isdown = false;
    var angle = 0;
    var startangle = 0;
    var oldangle = 0;
    var plateX = $('#testcss').offset().left + 125;
    var plateY = $('#testcss').offset().top + 125;
    var istaped = false;
    var istaped_pic = false;
    var ismoved = false;
    function touch (event){
        var event = event || window.event;

        // var plate = document.getElementById("testcss");
        switch(event.type){
            case "touchstart":

                var ox = parseInt(event.touches[0].clientX) - parseInt(plateX);//计算出鼠标相对于画布中心的位置
                var oy = parseInt(event.touches[0].clientY) - parseInt(plateY);
                var to = Math.abs(ox / oy);

                startangle = Math.atan(to) / (2 * Math.PI) * 360;//鼠标相对于旋转中心的角度
                if (ox < 0 && oy < 0)
                {
                    startangle = -startangle;
                } else if (ox < 0 && oy > 0)
                {
                    startangle = -(180 - startangle)
                } else if (ox > 0 && oy < 0)
                {
                    startangle = startangle;
                } else if (ox > 0 && oy > 0)
                {
                    startangle = 180 - startangle;
                }
                startangle -= oldangle;
                if(ox<125&&ox>-125&&oy<125&&oy>-125){
                    isdown = true;
                }
                if(ox<50&&ox>-50&&oy<50&&oy>-50){
                    istaped = true;
                }
                if(event.touches[0].clientY<document.getElementById('imgdiv').offsetHeight){
                    istaped_pic = true;
                }
                break;
            case "touchend":
                oldangle = angle;
                while(oldangle<0||oldangle>=360){
                    if(oldangle<0){
                        oldangle+=360;
                    }else{
                        oldangle-=360;
                    }
                }
                if(istaped==true&&ismoved==false){   // 模拟tap事件
                    if(pic_index >= pic_index_max){
                        finished = true;
                        send_score(edit_title);
                        document.getElementById('score').innerHTML = '分享朋友圈，获得总得分';
                    }else{
                        var realAngle = Number(global_pic_arr[pic_index]['jpg_direction']);
                        console.log(pic_index+','+global_pic_arr[pic_index]['jpg_name']+','+global_pic_arr[pic_index]['jpg_direction']);
                        oldangle = parseInt(oldangle);
                        var diff = Math.abs(oldangle-realAngle);
                        var goal = 0;
                        if(diff>180){
                            diff = 360 - diff;
                        }
                        if(diff<=30){
                            goal = 10;
                        }else if(diff<90){
                            goal = parseInt(-(diff-90)/6)+1;
                        }else{
                            goal = 0;
                        }
                        totalgoal += goal;
                        pic_index += 1;
                        document.getElementById('score').innerHTML = '得分：'+goal;
                        if(pic_index<pic_index_max){
                            update_pic(global_pic_arr, pic_index);
                        }
                    }
                    if(pic_index == 2){
                        get_ip();
                    }
                    if(pic_index == 5){
                        console.log(ip_local);
                    }
                }
                if(istaped_pic==true && finished == false){
                    if(pass_count<3){
                        pic_index += 1;
                        update_pic(global_pic_arr, pic_index);
                        pic_index_max += 1;
                        pass_count += 1;
                        istaped_pic = false;
                        document.getElementById('score').innerHTML = '您还有'+(3-pass_count)+'次跳过机会';
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
                if(isdown){
                    var ox = parseInt(event.touches[0].clientX) - parseInt(plateX);//计算出鼠标相对于画布中心的位置
                    var oy = parseInt(event.touches[0].clientY) - parseInt(plateY);
                    var to = Math.abs(ox / oy);

                    angle = Math.atan(to) / (2 * Math.PI) * 360;//鼠标相对于旋转中心的角度
                    if (ox < 0 && oy < 0)
                    {
                        angle = -angle;
                    } else if (ox < 0 && oy > 0)
                    {
                        angle = -(180 - angle)
                    } else if (ox > 0 && oy < 0)
                    {
                        angle = angle;
                    } else if (ox > 0 && oy > 0)
                    {
                        angle = 180 - angle;
                    }
                    angle -= startangle;
                    $("#testcss").css("transform","rotate("+angle+"deg)");
                }
                break;
        }


    }

    function load_request( url, time, callback){
        var pic_arr = [];
        var request = new XMLHttpRequest();
        var timeout = false;
        var timer = setTimeout( function(){
            timeout = true;
            request.abort();
        }, time );
        request.open( "GET", url );
        request.onreadystatechange = function(){
            if( request.readyState !== 4 ) return;
            if( timeout ) return;
            clearTimeout( timer );
            if( request.status === 200 ){
                pic_arr = eval('(' + request.response + ')');
                callback(pic_arr);
            }
        }
        request.send( null );
        return pic_arr;
    }

    function update_pic(pic_arr){
        var i = arguments[1]?arguments[1]:0;
        if(city == 'shanghai'){
            document.getElementById("streetimg").src = "http://120.26.51.49/data/streetgame/shanghai_outring_50m/"+pic_arr[i]['jpg_name']+".jpg";
        }else if(city == 'beijing'){
            document.getElementById("streetimg").src = "http://120.26.51.49/data/streetgame/beijing_5ring_50m/"+pic_arr[i]['jpg_name']+".jpg";
        }
        if(i<=1){
            console.log(pic_arr);
            global_pic_arr = pic_arr;
        }
    }

    function get_ip(){
        var request = new XMLHttpRequest();
        // request.open("GET", "http://jsonip.com/?callback=?");
        request.open("GET", "/streetgame/backstage/load.php?city_index=1/");
        request.onreadystatechange = function(){
            if(request.status == 200){
                console.log(request.response);
                ip_local = eval('(' + request.response + ')')[0];
            }
        }
    }

    function send_score(callback){
        var commit_url = "/streetgame/backstage/commit.php";
        $.post(commit_url,{ip:ip_local,score:totalgoal})
            .done(function (data) {
                callback();
            });
    }

    function edit_title(){
        document.title = '方向感测试小游戏\n您的总得分：'+totalgoal;
    }
}


// window.addEventListener('load',load,false);
