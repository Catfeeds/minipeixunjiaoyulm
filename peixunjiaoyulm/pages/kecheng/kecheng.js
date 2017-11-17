// pages/kecheng/kecheng.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      courseList: [],
      page: 2,
      title: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var ptitle = app.d.title;
    //更改头部标题
    wx.setNavigationBarTitle({
      title: ptitle + ' 推荐活动',
    });
    this.setData({
      title: ptitle + ' 推荐活动',
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var cityid = app.d.cityId;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Course/lists',
      method: 'post',
      data: {
        cityid: app.d.cityId
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var list = res.data.list;
        that.setData({
          courseList: list,
        });
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var cityid = app.d.cityId;
    var page = that.data.page;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Course/lists',
      method: 'post',
      data: {
        cityid: app.d.cityId,
        uid: app.d.userId,
        page : page,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var list = res.data.list;
        if (list=='') {
          wx.showToast({
            title: '没有找到更多数据！',
            duration: 2000
          });
          return false;
        }
        that.setData({
          courseList: that.data.courseList.concat(list),
          page: parseInt(page)+1,
        });
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var title = this.data.title;
    return {
      title: title,
      path: '/pages/index/index',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  }
})