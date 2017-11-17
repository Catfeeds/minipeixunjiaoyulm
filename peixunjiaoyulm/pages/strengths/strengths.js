// pages/teachers/teachers.js
var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    // 切换
    tabArr: {
      curHdIndex: 0,
      curBdIndex: 0,
      ab: 0,
      agg: 0
    },
    p: 0,
    t: 0,
    wu: 5,
  // 切换终
    cont:[],
    page:2,
    title: '',
  },
  // tab切换
  tabFun: function (e) {
    //获取触发事件组件的dataset属性 
    var _datasetId = e.target.dataset.id;
    var _datasetp = e.target.dataset.p;
    var _datasett = e.target.dataset.t;
    console.log(e);
    console.log("----" + _datasetp + "----");
    console.log("----" + this.data.dfd + "----");
    var _obj = {};
    _obj.curHdIndex = _datasetId;
    _obj.curBdIndex = _datasetId;
    //  第一个没排序
    if (_datasetId == 0) {
      _obj.ab = 0;
      this.setData({
        tabArr: _obj,
        p: 0,
        t: 0,
        wu: 0,
        dfd: 'rewrew'
      });
    };
    //  第二个
    if (_datasetId == 1 && _datasetp == 0) {
      _obj.agg = 0;
      _obj.ab = 4;
      this.setData({
        tabArr: _obj,
        p: 5,
        wu: 5,
        t: 0,
        dfd: 1,
      });
    };

    if (_datasetId == 1 && _datasetp == 5) {
      _obj.agg = 0;
      var wu = this.data.wu
      _obj.ab = wu;
      this.setData({
        tabArr: _obj,
        p: 0,
        dfd: 3,
      });

    };
    //  第三个
    if (_datasetId == 2 && _datasett == 0) {
      _obj.ab = 0;
      _obj.agg = 4;
      this.setData({
        tabArr: _obj,
        wu: 0,
        t: 5,
        dfd: 'pppp'
      });
    };
    if (_datasetId == 2 && _datasett == 5) {
      var t = this.data.t
      _obj.agg = t;
      this.setData({
        tabArr: _obj,
        t: 0,
        dfd: 'php'
      });
    };
    //  第4个没排序
    if (_datasetId == 3) {
      _obj.ab = 0;
      this.setData({
        tabArr: _obj,
        p: 0,
        t: 0,
        wu: 0,
        dfd: 'orew'
      });
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var objectId = options.title;
    var ptitle = app.d.title;
    //更改头部标题
    wx.setNavigationBarTitle({
      title: ptitle + ' ' + objectId,
    });
    this.setData({
      title: ptitle + ' ' + objectId,
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.hideToast();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
    })
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Shangchang/index',
      method: 'post',
      data: {
        cityid: app.d.cityId
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var shop = res.data.list;
        that.setData({
          cont: shop,
        });
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
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
    var page = that.data.page;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Shangchang/index',
      method: 'post',
      data: {
        cityid: app.d.cityId,
        page: page,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var shop = res.data.list;
        if(shop==''){
          wx.showToast({
            title: '没有找到更多数据！',
            duration: 2000
          });
          return false;
        }
        that.setData({
          cont: that.data.cont.concat(shop),
          page: parseInt(page)+1,
        });
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var title = this.data.title;
    return {
      title: title,
      path: '/pages/strengths/strengths?title=' + title,
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },
})