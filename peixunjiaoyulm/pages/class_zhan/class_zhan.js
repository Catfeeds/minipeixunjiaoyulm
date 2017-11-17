// pages/news/news.js
var app = getApp();
//引入这个插件，使html内容自动转换成wxml内容
//var WxParse = require('../../wxParse/wxParse.js');
Page({
   data: {
     exInfo: {},
     eid:0,
   },
   onLoad: function (options) {
      // 页面初始化 options为页面跳转所带来的参数
      var eid = options.eid;
      var title = options.title;
      wx.setNavigationBarTitle({ title: '中国婚庆文化产业园 '+title, });
      this.setData({
        eid: eid
      });
   },

   //报名
   bm: function (e) {
      var that = this;
      var eid = parseInt(e.currentTarget.dataset.id);
      var yprice = e.currentTarget.dataset.cprice;
      var title = e.currentTarget.dataset.title;
      wx.navigateTo({
        url: '../personal_pu/personal_pu?eid=' + eid + '&title=' + title + '&cprice=' + yprice,
      })
   },

   onReady: function () {
      // 页面渲染完成
      wx.hideToast();
   },

   onShow: function () {
     wx.showToast({
       title: '加载中...',
       icon: 'loading'
     });
      // 页面显示
     var that = this;
     wx.request({
       url: app.d.ceshiUrl + '/Api/Exhibition/index',
       method: 'post',
       data: { 
         id: that.data.eid,
        },
       header: {
         'Content-Type': 'application/x-www-form-urlencoded'
       },
       success: function (res) {
         var status = res.data.status;
         if (status == 1) {
           var info = res.data.info;
          //  var content = info.content;
          //  WxParse.wxParse('content', 'html', content, that, 5);
           that.setData({
             exInfo: info
           });
         } else {
           wx.showToast({
             title: '没有找到相关信息！',
             duration: 2000
           });
         }
       },
       fail: function (e) {
         wx.showToast({
           title: '网络异常！',
           duration: 2000
         });
       },
     })
   },

   onShareAppMessage: function () {
      var title = this.data.exInfo.title;
      var id = this.data.exInfo.id;
      return {
         title: title,
         path: '/pages/class_zhan/class_zhan?eid=' + id,
         success: function (res) {
            // 分享成功
         },
         fail: function (res) {
            // 分享失败
         }
      }
   }
})  