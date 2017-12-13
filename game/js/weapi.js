/**
 * Created by qu on 2017/3/25.
 */

var currUrl = window.location.href.replace(window.location.hash, '');
$.getJSON('/streetgame/backstage/wx/signature.php?url=' + encodeURIComponent(currUrl)).done(function(data) {
    wx.config({
        debug: false,
        appId: data.appId,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList: [
            'checkJsApi',
            'onMenuShareTimeline',
            'onMenuShareAppMessage'
        ]
    });
});

wx.ready(function () {
    wx.checkJsApi({
        jsApiList: ['onMenuShareTimeline'], // 需要检测的JS接口列表，所有JS接口列表见附录2,
        success: function(res) {
            console.log(res);
            // 以键值对的形式返回，可用的api值true，不可用为false
            // 如：{"checkResult":{"chooseImage":true},"errMsg":"checkJsApi:ok"}
        }
    });
    wx.onMenuShareTimeline({
        title: "方向感测试小游戏",
        desc: '',
        imgUrl: 'http://www.quyihang.com/streetgame/game/icons/short.png',
        trigger: function (res) {
        },
        success: function (res) {
            document.getElementById('score').innerHTML=('已分享，您的总得分：'+totalgoal);
        },
        cancel: function (res) {
            // alert('已取消');
        },
        fail: function (res) {
            // alert(JSON.stringify(res));
        }
    });
});