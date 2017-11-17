// pages/user/dingdan.js
//index.js  
//获取应用实例  
var app = getApp();
var common = require("../../utils/common.js");
Page({
  data: {
    uil: false,
    tabArr: {
      curHdIndex: 0,
      curBdIndex: 0
    },
    page:2,
    clist:[],
    oo: 0,
    p: '',
    cont: [],
    cid:0,
    title: '',
  },
  // tab切换
  tabFun: function (e) {
    //获取触发事件组件的dataset属性 
    var _datasetId = e.target.dataset.id;
    var _obj = {};
    _obj.curHdIndex = _datasetId;
    _obj.curBdIndex = _datasetId;
    this.setData({
      tabArr: _obj,
      cid: _datasetId,
      page: 2
    });
    this.loadData();
  },
  bitap: function (e) {
    //获取触发事件组件的dataset属性 
    var xb = e.target.dataset.xb;
    var imgs = e.target.dataset.imgs;
    this.data.cont[xb].img = imgs;
    //item.img = imgs;
    this.setData({
      cont: this.data.cont,
    });
  },

  onLoad: function (options) {
    var that = this;
    var cid = options.cid;
    var title = options.title;
    var ptitle = app.d.title;
    var _obj = {};
    _obj.curHdIndex = parseInt(cid);
    _obj.curBdIndex = parseInt(cid);
    that.setData({
      tabArr: _obj,
      cid: cid,
      title: ptitle + ' ' + title
    });
  },

  onShow: function () {
    // 生命周期函数--监听页面显示
    var that = this;
    var cityid = app.d.cityId;
    var cid = that.data.cid;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Index/life_list',
      method: 'post',
      data: {
        uid: app.d.userId,
        cityid: cityid,
        cid: cid,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var list = res.data.list;
        var clist = res.data.clist;
        var cid = res.data.cid;
        if (!cid) {
          cid = clist[0].id;
        }
        var _obj = {};
        _obj.curHdIndex = cid;
        _obj.curBdIndex = cid;
        that.setData({
          cont: list,
          clist: clist,
          tabArr: _obj,
          cid: cid,
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

  //加载数据
  loadData: function(e) {
    var that = this;
    var cityid = app.d.cityId;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Index/life_list',
      method: 'post',
      data: {
        uid: app.d.userId,
        cid: that.data.cid,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var list = res.data.list;
        that.setData({
          cont: list,
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
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var page = that.data.page;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Index/life_list',
      method: 'post',
      data: {
        uid: app.d.userId,
        cid: that.data.cid,
        page: page
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var list = res.data.list;
        if (list == '') {
          wx.showToast({
            title: '没有找到更多数据！',
            duration: 2000
          });
          return false;
        }
        that.setData({
          cont: that.data.cont.concat(list),
          page: parseInt(page) + 1,
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

  //拨打电话
  calling: function (e) {
    var tel = e.target.dataset.tel;
    wx.makePhoneCall({
      phoneNumber: tel, //此号码为真实电话号码
      success: function () {
        console.log("拨打电话成功！");
      },
      fail: function () {
        console.log("拨打电话失败！")
      }
    })
  },

  onShareAppMessage: function () {
    var title = this.data.title;
    return {
      title: title,
      path: '/pages/lifezone/lifezone',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },
})