/**
 * 设置ajax
 */

import {Message} from 'element-ui';

let baseURL = '/';
function error(err, url, errback, vm) {
  // console.log(url);
  console.log(err);
  console.log(window.location.href);
  let statusCode = err.status;
  // Message.error({
  //   message:'错了哦，'+url+'请求错误！错误状态：'+statusCode,
  //   duration:4000,
  //   showClose:true,
  //   onClose:function(){
  //     vm.$store.commit("setLoading",false);
  //   }
  // });
  setTimeout(function () {
    vm.$store.commit("setLoading", false);
  }, 4000);
  if (errback) {
    errback(err.responseJSON);
  }
}

function success(callBack, response, vm) {
  // console.log(response.data.code);
  setTimeout(function () {
    vm.$store.commit("setLoading", false);
  }, 500);


  if (response.data.statusCode == 302 || response.data.code == 302) {

    // console.log(response);
    let curentUrl = window.location.href;

    let url = window.location.pathname + window.location.hash;
    sessionStorage.setItem('hisHref', curentUrl);
    self.location = '/sso?redirectFrontURI=' + url;  //rul = pathname + hash
  } else if (response.data.code != 0) {//response.data.code ！=0,请求获取数据失败
    if (response.data.code == 10002) { //没有权限访问系统
      vm.$store.commit("setMenusNone", true);//将菜单设置为空 setMenusNone 在APP.vue中引入，在store menus.js中定义
    }
    Message.error({
      message: response.data.message,
      duration: 4000,
      showClose: true,
      onClose: function () {
        vm.$store.commit("setLoading", false);
      }
    });
  } else {//response.data.code==0,请求获取数据成功
    // vm.$store.commit("setMenusNone",true);
    if (callBack) {
      callBack(response);
    }
  }
}

function query(type, url, param, async, callBack, errorCall, vm) {
  let xhrType = type.toUpperCase();
  $.ajax({
    AccessControlAllowCredentials: true,
    url: baseURL + url,
    type: xhrType, //GET或POST
    timeout: 90000,    //超时时间
    dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
    data: param, //请求数据
    async: async, //同步异步
    success: function (data, textStatus, jqXHR) {
      let response = {
        data: data,
        status: jqXHR.status
      };
      success(callBack, response, vm);
    },
    error: function (xhr, textStatus) {
      error(xhr, url, errorCall, vm);
    }
  })
}

function queryString(type, url, param, async, callBack, errorCall, vm) {
  let xhrType = type.toUpperCase();
  $.ajax({
    AccessControlAllowCredentials: true,
    url: baseURL + url,
    type: xhrType, //GET或POST
    contentType: 'application/json;charset=UTF-8',//json字符串形式提交数据
    timeout: 90000,    //超时时间
    dataType: 'json',    //返回的数据格式：json/xml/html/script/jsonp/text
    data: param, //请求数据
    async: async,//同步异步
    success: function (data, textStatus, jqXHR) {
      let response = {
        data: data,
        status: jqXHR.status
      };
      success(callBack, response, vm);
    },
    error: function (xhr, textStatus) {
      error(xhr, url, errorCall, vm);
    }
  })
}

const Ajax = function (type, url, param, callBack, error, jsAsync) {
  let _this = this;
  _this.$store.commit("setLoading", true);

  let errorCall, async;
  switch (arguments.length) {
    case 6://ajax请求传入6个参数
      errorCall = error;
      async = jsAsync === true ? false : true;
      break;
    case 5://ajax请求传入5个参数，判断最后一个参数是errorfunction还是jsAsync
      if (typeof(error) == 'function') {
        errorCall = error;
        async = true;
      } else {
        errorCall = undefined;
        async = error === true ? false : true;
      }
      break;
    case 4: //ajax请求传入四个参数，errorfunction 跟 jsAsync 为undefined，设置async为true，异步请求
      errorCall = undefined;
      async = true;
      break;
    default: //ajax 传入参数不对，必须要有type, url, param,callBack四个参数，并且顺序不能变动
      console.log('传入参数不对');
  }

  if (typeof(param) == 'object') {
    query(type, url, param, async, callBack, errorCall, _this);//表单形式提交数据
  } else {
    queryString(type, url, param, async, callBack, errorCall, _this);//json字符串形式提交数据
  }
}
export default {
  install(Vue) {
    Vue.prototype.Ajax = Ajax;
  }
};
