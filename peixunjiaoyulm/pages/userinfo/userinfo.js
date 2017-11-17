var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    info: {},
    id:0,
  },

  /**
  * 生命周期函数--监听页面显示
  */
  onLoad: function (options) {
    var objectId = options.title;
    //更改头部标题
    var ptitle = app.d.title;
    wx.setNavigationBarTitle({
      title: ptitle + ' ' + objectId,
    });
    this.setData({
      title: ptitle + ' ' + objectId,
      id: options.id,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    wx.showToast({
      title: '加载中...',
      icon: 'loading',
    });
    //获取会员资料
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/getdaninfo',
      method: 'post',
      data: {
        uid: app.d.userId,
        id: that.data.id,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if(status==1) {
          that.setData({
            info: res.data.info,
          });
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
        wx.hideToast();
      },
      fail: function (e) {
        wx.hideToast();
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },

  bindPickerChangeshengArr: function (e) {
    this.setData({
      shengIndex: e.detail.value,
      shiArr: [],
      shiId: [],
    });
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Address/get_city',
      data: { sheng: e.detail.value },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // success
        var status = res.data.status;
        var city = res.data.city_list;

        var hArr = [];
        var hId = [];
        hArr.push('请选择');
        hId.push('0');
        for (var i = 0; i < city.length; i++) {
          hArr.push(city[i].name);
          hId.push(city[i].id);
        }
        that.setData({
          sheng: res.data.sheng,
          shiArr: hArr,
          shiId: hId
        })
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },

    })
  },

  //获取市ID
  bindPickerChangeshiArr: function (e) {
    this.setData({
      shiIndex: e.detail.value,
      quArr: [],
      quiId: []
    })
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Address/get_area',
      data: {
        city: e.detail.value,
        sheng: this.data.sheng
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        that.setData({
          city: res.data.city,
        })
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },

  //调起微信支付
  wxpay: function (cid) {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Wxpay/openuser',
      data: {
        utype: cid,
        uid: app.d.userId,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success: function (res) {
        wx.hideToast();
        if (res.data.status == 1) {
          var order = res.data.arr;
          wx.requestPayment({
            timeStamp: order.timeStamp,
            nonceStr: order.nonceStr,
            package: order.package,
            signType: 'MD5',
            paySign: order.paySign,
            success: function (res) {
              wx.showToast({
                title: "支付成功!",
                duration: 2000,
              });
              // setTimeout(function () {
              //   wx.navigateTo({
              //     url: '../class/class?courseId=' + that.data.cid,
              //   });
              // }, 2500);
            },
            fail: function (res) {
              wx.showToast({
                title: res,
                duration: 3000
              })
            }
          })
        } else {
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      fail: function () {
        // fail
        wx.showToast({
          title: '网络异常！err:wxpay',
          duration: 2000
        });
      }
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

})