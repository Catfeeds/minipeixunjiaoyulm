var city = require('../../utils/city.js');
var app = getApp()
Page({
  data: {
    city: '',
    searchLetter: [],
    showLetter: "",
    winHeight: 0,
    // tHeight: 0,
    // bHeight: 0,
    cityList: [],
    isShowLetter: false,
    scrollTop: 0,//置顶高度
    scrollTopId: '',//置顶id
    hotcityList: [{ cityCode: 523000, city: '东莞市' }, { cityCode: 440100, city: '广州市' }, { cityCode: 440300, city: '深圳市' },]
  },

  onLoad: function (options) {
    var citys = options.tiele;
    // 生命周期函数--监听页面加载
    var searchLetter = city.searchLetter;
    var cityList = city.cityList();
    var sysInfo = wx.getSystemInfoSync();
    var winHeight = sysInfo.windowHeight;
    var itemH = winHeight / searchLetter.length;
    var tempObj = [];
    for (var i = 0; i < searchLetter.length; i++) {
      var temp = {};
      temp.name = searchLetter[i];
      temp.tHeight = i * itemH;
      temp.bHeight = (i + 1) * itemH;
      tempObj.push(temp)
    }
    this.getcity();
    this.setData({
      winHeight: winHeight,
      itemH: itemH,
      searchLetter: tempObj,
      //cityList: cityList,
      city: citys,
    })
  },

  //获取所有城市
  getcity: function (e) {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Index/getallcity',
      method: 'post',
      data: {},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var cityList = res.data.list;
        that.setData({
          cityList: cityList,
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

  //城市选择事件
  bindCity: function (e) {
    var address = e.currentTarget.dataset.city;
    var cityId = e.currentTarget.dataset.id;

      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1];  //当前页面
      var prevPage = pages[pages.length - 2]; //上一个页面
      //保存客户点击的城市
      this.savecity(cityId);

      //直接调用上一个页面的setData()方法，把数据存到上一个页面中去
      prevPage.setData({
        address: address,
        cityId: cityId
      })
      app.d.cityId = cityId;
      wx.navigateBack();
   },

  //保存客户点击的城市
  savecity: function (cityid) {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Index/savecity',
      method: 'post',
      data: {
        cityid: cityid,
        uid: app.d.userId
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {

      }
    })
  }, 

  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示

  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },
  clickLetter: function (e) {
    console.log(e.currentTarget.dataset.letter)
    var showLetter = e.currentTarget.dataset.letter;
    this.setData({
      showLetter: showLetter,
      isShowLetter: true,
      scrollTopId: showLetter,
    })
    var that = this;
    setTimeout(function () {
      that.setData({
        isShowLetter: false
      })
    }, 1000)
  },
  //选择城市
  // bindCity: function (e) {
  //   var ad = e.currentTarget.dataset.city
  //   console.log("bindCity")
  //   this.setData({
  //     city: e.currentTarget.dataset.city
  //   })
  //   wx.switchTab({
  //     url: '../index/index',
  //   })

  // },
  //选择热门城市
  // bindHotCity: function (e) {
  //   console.log("bindHotCity")
  //   this.setData({
  //     city: e.currentTarget.dataset.city
  //   })
  // },
  //点击热门城市回到顶部
  hotCity: function () {
    this.setData({
      scrollTop: 0,
    })
  }
})