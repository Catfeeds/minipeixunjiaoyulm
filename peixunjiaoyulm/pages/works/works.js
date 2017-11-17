var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    sex:1,
    title:'',
    courseIndex:0,
    courseList:[],
    courseId:[],
    coursePrice: [],
    cid: 0,
    cprice: 0.00,
    date:'',
    index: 0,
    li: ['小学','初中','高中','中专', '大专', '本科','双学士', '硕士', '博士','其他'],
    yue: ['3000以下', '3000-5000', '5000-8000', '8000-1万', '1万-5万','5万-10万', '10万以上'],
    currId:0,
    xl:0,
    yx:0,
  },


  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },

  // 学历
  li: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      xl: e.detail.value
    })
  },
  // 月薪
  yue: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      yx: e.detail.value
    })
  },


  reg: function (e) {
    var that = this;
    var info = e.detail.value;
    var courseId = info.cid;
    var tel = info.tel;
    if (courseId==0){
      wx.showToast({
        title: '请选择报名课程！',
        duration: 2000
      });
      return false;
    }
    if (!tel) {
      wx.showToast({
        title: '请输入您的联系方式！',
        duration: 2000
      });
      return false;
    }

    var xueli = that.data.li;
    var xl = that.data.xl;
    var yue = that.data.yue;
    var yx = that.data.yx;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Course/course',
      data: {
        uid: app.d.userId,  //会员ID
        truename: info.truename,//姓名
        course_id: info.cid,//活动ID
        sex: that.data.sex, //性别
        sr: that.data.date, //生日
        city: info.city,  //婚姻
        hy: that.data.hy,  //婚姻
        tall: info.tall, //身高
        xl: xueli[xl],  //学历
        yx: yue[yx],   //月薪
        weixin: info.weixin, //微信
        qq: info.qq,  //qq
        address: info.address, //地址
        tel: tel,  //联系方式
        email: info.email,  //邮箱
        remark: info.remark,//备注
        lxdx: info.lxdx, //理想对象
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // success
        var status = res.data.status;
        var cid = parseInt(that.data.cid);
        var price = parseFloat(info.cprice);
        if (status == 1) {
          if (cid > 0 && price > 0) {
            //发起微信支付
            wx.showToast({
              title: '正在发起微信支付...',
              icon: 'loading',
              duration: 2000
            });
            setTimeout(function (e) {
              that.wxpay();
            }, 2500);
          } else {
            wx.showToast({
              title: '报名成功！',
              duration: 2000
            });
          }
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
          title: '网络异常！',
          duration: 2000
        });
      }
    })
  },

  /**
   * 获取性别
   */
  radioChange: function (e) {
    var sex = e.detail.value;
    this.setData({
      sex: sex
    });
  },

  /**
   * 婚姻状况
   */
  hyChange: function (e) {
    var hy = e.detail.value;
    this.setData({
      hy: hy
    });
  },

  /**
   * 获取培训课程
   */
  bindChangeCourse: function (e) {
    this.setData({
      courseIndex: e.detail.value,
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //获取所有的培训课程
    var that = this;
    var currId = options.couserId;
    var cprice = options.cprice;
    var title = options.title;
    that.setData({
      cid: currId,
      currId: currId,
      cprice: cprice,
      title: title
    });
    wx.request({
      url: app.d.ceshiUrl + '/Api/Course/getlist',
      method: 'post',
      data: {},
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var list = res.data.list;
        var cArr = [];
        var cId = [];
        var cPrice = [];
        cArr.push('请选择');
        cId.push('0');
        cPrice.push('0.00');
        for (var i = 0; i < list.length; i++) {
          cArr.push(list[i].title);
          cId.push(list[i].id);
          cPrice.push(list[i].price);
        }
        that.setData({
          courseList: cArr,
          courseId: cId,
          coursePrice: cPrice,
          date: res.data.date
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

  //调起微信支付
  wxpay: function (e) {
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Wxpay/buycourse',
      data: {
        course_id: that.data.cid,
        uid: app.d.userId,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }, // 设置请求的 header
      success: function (res) {
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
                title: "报名成功!",
                duration: 2000,
              });
              setTimeout(function () {
                wx.navigateTo({
                  url: '../class/class?courseId=' + that.data.cid,
                });
              }, 2500);
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
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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