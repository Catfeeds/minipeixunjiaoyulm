// pages/news/news.js
//获取应用实例  
var app = getApp();
//引入这个插件，使html内容自动转换成wxml内容
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data:{
    info:{},
    newsId: 0,
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    var that = this;
    var newsId = options.newsId;
    var title = options.title;
    //更改头部标题
    wx.setNavigationBarTitle({
      title: title,
    });
    that.setData({
      newsId: newsId,
    });
  },
  onReady:function(){
    // 页面渲染完成
    wx.hideToast();
  },
  onShow:function(){
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    });
    // 页面显示
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/News/detail',
      method: 'post',
      data: {
        news_id: that.data.newsId,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        //--init data 
        var status = res.data.status;
        if (status == 1) {
          var info = res.data.info;
          var content = info.content;
          //that.initProductData(data);
          WxParse.wxParse('content', 'html', content, that, 10);
          that.setData({
            info: info,
          });
        } else {
          wx.showToast({
            title: '没有找到相关信息.',
            duration: 2000,
          });
        }
      },
      error: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000,
        });
      },
    });
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  },

  onShareAppMessage: function () {
    var title = this.data.info.name;
    var newsId = this.data.info.newsId;
    return {
      title: title,
      path: '/pages/news/news?newsId=' + newsId,
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },
})