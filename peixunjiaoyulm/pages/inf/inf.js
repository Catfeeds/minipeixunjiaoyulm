// pages/inf/inf.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:2,
    newsList:[],
    title: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var objectId = options.title;
    //更改头部标题
    var ptitle = app.d.title;
    wx.setNavigationBarTitle({
      title: ptitle+' '+objectId,
    });
    this.setData({
      title: ptitle + ' ' + objectId,
    });
  },

  //点击加载更多
  loadMore: function (e) {
    var that = this;
    var page = that.data.page;
    wx.request({
      url: app.d.ceshiUrl + '/Api/News/getlist',
      method: 'post',
      data: { page: page },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var list = res.data.list;
        if (list == '') {
          wx.showToast({
            title: '没有更多数据！',
            duration: 2000
          });
          return false;
        }

        that.setData({
          page: page + 1,
          newsList: that.data.newsList.concat(list)
        });
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },

  // 资讯
  jumpDetails: function (e) {
    var newsId = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.title;
    wx.navigateTo({
      url: '../news/news?newsId=' + newsId + '&title=' + name,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    });
    //获取所有新闻
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/News/index',
      method: 'post',
      data: {},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var list = res.data.list;
        that.setData({
          newsList: list
        });
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },

  onReady: function () {
    // 页面渲染完成
    wx.hideToast();
  },

  onShareAppMessage: function () {
    var title = this.data.title;
    return {
      title: title,
      path: '/pages/inf/inf',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },
})