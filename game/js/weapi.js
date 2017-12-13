/**
 * Created by qu on 2017/3/25.
 */

var currUrl = window.location.href.replace(window.location.hash, '');
$.getJSON('/weapp/signature.php?url=' + encodeURIComponent(currUrl)).done(function(data) {
    wx.config({
        debug: true,
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
        title: '分享！',
        desc: '猜猜猜',
        imgUrl: 'http://mmbiz.qpic.cn/mmbiz_jpg/pJg18ia79wRLKxSkicuvRfuLgicUDdvEJHKl6vibQB9J9scEiaFl2rsoxkPLQxR2V4ibBvNLz5Qibuqp6cgN7mia5MyUHg/640?wx_fmt=jpeg&tp=webp&wxfrom=5&wx_lazy=1',
        trigger: function (res) {
        },
        success: function (res) {
            document.getElementById('score').innerHTML=('已分享，您的总得分：'+totalgoal);
        },
        cancel: function (res) {
            alert('已取消');
        },
        fail: function (res) {
            alert(JSON.stringify(res));
        }
    });
});