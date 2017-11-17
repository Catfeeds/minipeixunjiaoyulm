// pages/news/news.js
var app = getApp();
//引入这个插件，使html内容自动转换成wxml内容
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    courseInfo:{}
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    var courseId = options.courseId;
    var title = options.title;
    wx.setNavigationBarTitle({ title: '中国婚庆文化产业园 '+title, });

    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Course/index',
      method: 'post',
      data: { id: courseId},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if(status==1){
          var info = res.data.info;
          var content = info.content;
          WxParse.wxParse('content', 'html', content, that, 5);
          that.setData({
            courseInfo: info
          });
        }else{
          wx.showToast({
            title: '没有找到相关信息！',
            duration: 2000
          });
        }
        //endInitData
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
  },

  //报名
  bm: function (e) {
    var that = this;
    var couserId = parseInt(e.currentTarget.dataset.id);
    var yprice = e.currentTarget.dataset.cprice;
    var title = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: '../works/works?couserId=' + couserId + '&title=' + title + '&cprice=' + yprice,
    })
  },
  
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },
  onShareAppMessage: function () {
    var title = this.data.courseInfo.title;
    var id = this.data.courseInfo.id;
    return {
      title: title,
      path: '/pages/product/detail?courseId=' + id,
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  }
})