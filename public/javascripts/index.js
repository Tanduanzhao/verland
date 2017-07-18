//获取URL参数
function url2obj(){
  var str = location.search.slice(1);
  str = str.split('&');
  var obj = {};
  str.forEach(function(ele) {
    var _index = ele.indexOf('=');
    obj[ele.slice(0, _index)] = decode(ele.slice(_index + 1));
  });
  return obj;
}
function decode(str) {
  return decodeURI(decodeURI(str));
}
//更改标题
function updateTitle(){
  var ua = navigator.userAgent.toLowerCase();
  if(ua.match(/MicroMessenger/i)=="micromessenger") {
    $("title").text('微信支付');
  } else if(ua.match(/AlipayClient/i)=="alipayclient"){
    $("title").text('支付宝支付');
  }else{
    $("title").text('云量支付');
  }
}
//通过config接口注入权限验证配置
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
//微信初始化
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