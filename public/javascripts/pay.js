/**
 * Created by Administrator on 2017/6/7.
 */


function isPay(payResult,callBack){
    var callback = callBack || function(){};
  $.ajax({
    type: "POST",
    url:"/wxPayResult",
    data:{
      payResult:payResult,
      cradID: location.search.slice(location.search.indexOf('=')+1),
    },
    success: function(res){
      if(res.status == 1){
        callback();
      }
    }
  })
}
function isWeixinOrAlipay(){
  var ua = navigator.userAgent.toLowerCase(),payResult= 0;
  if(ua.match(/MicroMessenger/i)=="micromessenger") {
      if(!location.search.slice(location.search.indexOf('=')+1)){window.location.href('/payInfo');return false;};
      $.ajax({
        type: "GET",
        url:"/wxPay",
        success: function(res){
          if(res.status == 1){
            wx.chooseWXPay({
              timestamp: res.datas.timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
              nonceStr: res.datas.nonceStr, // 支付签名随机串，不长于 32 位
              package:  res.datas.prepay_id, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=***）
              signType: res.datas.signType, // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
              paySign: res.datas.paySign ,// 支付签名
              success:  function(res){
                // 支付成功后的回调函数
                var callBack = function(){};
                if (res.errMsg == "chooseWXPay:ok") {
                  payResult=1;
                  callBack = function(){window.location.href= "/paySuccess";};
                }
                isPay(payResult,callBack);
              },
              cancel :function(res){
                isPay(payResult);
              },
              fail:function(res){
                alert(JSON.stringify(res));
              }
            });
          }
        }
      })
  }else{
    console.log('支付宝浏览器');
    if(location.search.slice(location.search.indexOf('=')+1)){
      window.location.href= "HTTPS://QR.ALIPAY.COM/FKX08304RZEUIO0OWZJG93";
    }
  }
}
function loadJssdk(res){
  wx.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: res.datas.appId, // 必填，公众号的唯一标识
    timestamp: res.datas.timestamp, // 必填，生成签名的时间戳
    nonceStr: res.datas.noncestr, // 必填，生成签名的随机串
    signature: res.datas.signature, // 必填，签名，见附录1
    jsApiList: ['chooseWXPay','getLocation','openLocation','previewImage'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
  });
}
function getWxJssdk(){
  $.ajax({
    type: "GET",
    url:"/initWx?url="+encodeURIComponent(location.href.split('#')[0]),
    success: function(res){
      if(res.status == 1){
        loadJssdk(res)
      }
    }
  })
}

getWxJssdk();
