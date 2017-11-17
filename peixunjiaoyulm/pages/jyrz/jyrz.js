var app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    zheng: '',
    fan: '',
    tx: '',
    img1: '',
    img2: '',
    img3: '',
    logo: '../../images/sssss.png',
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
    sheng: 0,
    city: 0,
    shengArr: [],//省级数组
    shengId: [],//省级id数组
    shiArr: [],//城市数组
    shiId: [],//城市id数组
    shengIndex: 0,
    shiIndex: 0,
  },

  // 身份证正面
  chooseImage: function () {
    var self = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var imageSrc = res.tempFilePaths[0];
        wx.uploadFile({
          url: app.d.ceshiUrl + '/Api/User/uploadimg',
          filePath: imageSrc,
          name: 'img',
          formData: {
            imgs: self.data.zheng
          },
          header: {
            'Content-Type': 'multipart/form-data'
          },
          success: function (res) {
            var statusCode = res.statusCode;
            if (statusCode == 200) {
              wx.showToast({
                title: '上传成功',
                duration: 2000
              });
              self.setData({
                imageSrc,
                img1: res.data,
              });
            } else {
              wx.showToast({
                title: 'upload_failed !',
                duration: 2000
              })
            }
          },
          fail: function ({ errMsg }) {
            wx.showToast({
              title: '上传失败',
              duration: 2000
            })
          }
        })
      },
      fail: function ({ errMsg }) {
        wx.showToast({
          title: '图片选择失败',
          duration: 2000
        })
      }
    })
  },

  // 身份证反面
  images: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var imageSrc = res.tempFilePaths[0];
        wx.uploadFile({
          url: app.d.ceshiUrl + '/Api/User/uploadimg',
          filePath: imageSrc,
          name: 'img',
          formData: {
            imgs: that.data.fan
          },
          header: {
            'Content-Type': 'multipart/form-data'
          },
          success: function (res) {
            var statusCode = res.statusCode;
            if (statusCode == 200) {
              wx.showToast({
                title: '上传成功',
                icon: 'success',
                duration: 2000
              })
              that.setData({
                images: imageSrc,
                img2: res.data,
              })
            } else {
              wx.showToast({
                title: 'upload_failed !',
                duration: 2000
              })
            }
          },
          fail: function ({ errMsg }) {
            wx.showToast({
              title: '上传失败',
              icon: 'success',
              duration: 2000
            })
          }
        })
      },
      fail: function ({ errMsg }) {
        wx.showToast({
          title: '图片选择失败',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },

  // 营业执照
  imgs: function () {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有  
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var imageSrc = res.tempFilePaths[0];
        wx.uploadFile({
          url: app.d.ceshiUrl + '/Api/User/uploadimg',
          filePath: imageSrc,
          name: 'img',
          formData: {
            imgs: that.data.yyzz
          },
          header: {
            'Content-Type': 'multipart/form-data'
          },
          success: function (res) {
            var statusCode = res.statusCode;
            if (statusCode == 200) {
              wx.showToast({
                title: '上传成功',
                icon: 'success',
                duration: 2000
              })

              that.setData({
                imgs: imageSrc,
                img3: res.data,
              })
            } else {
              wx.showToast({
                title: 'upload_failed !',
                duration: 2000
              })
            }
          },
          fail: function ({ errMsg }) {
            wx.showToast({
              title: '上传失败',
              icon: 'success',
              duration: 2000
            })
          }
        })
      },
      fail: function ({ errMsg }) {
        wx.showToast({
          title: '图片选择失败',
          icon: 'success',
          duration: 2000
        })
      }
    })
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

  //保存会员信息
  reg: function (e) {
    var that = this;
    var info = e.detail.value;
    var cid = info.cid;
    var tel = info.tel;
    if (cid==0){
      wx.showToast({
        title: '请选择会员类型！',
        duration: 2000
      });
      return false;
    }

    var xueli = that.data.li;
    var xl = that.data.xl;
    var yue = that.data.yue;
    var yx = that.data.yx;
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/saveinfo',
      data: {
        uid: app.d.userId,  //会员ID
        truename: info.truename,//姓名
        utype: cid,    //会员类型ID
        sex: that.data.sex, //性别
        birthday: info.age, //年龄
        city: info.city,  //常住城市
        hy: that.data.hy,  //婚姻
        sg: info.tall, //身高
        xl: xueli[xl],  //学历
        yx: yue[yx],   //月薪
        weixin: info.weixin, //微信
        qq: info.qq,  //qq
        address: info.address, //地址
        tel: tel,  //联系方式
        email: info.email,  //邮箱
        intro: info.intro,//备注
        lxdx: info.lxdx, //理想对象
        zheng: that.data.img1,
        fan: that.data.img2,
        photo: that.data.img3,
      },
      method: 'POST', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {// 设置请求的 header
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        // success
        var status = res.data.status;
        var price = parseFloat(info.cprice);
        if (status == 1) {
          if (parseInt(cid) > 0 && price > 0) {
            //发起微信支付
            wx.showToast({
              title: '正在发起微信支付...',
              icon: 'loading',
            });
            setTimeout(function (e) {
              that.wxpay(cid);
            }, 2500);
          } else {
            wx.showToast({
              title: '保存成功！',
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
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    //获取所有的培训课程
    var that = this;
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/getinfo',
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
          cArr.push(list[i].name);
          cId.push(list[i].id);
          cPrice.push(list[i].price);
        }

        //获取所有省份
        var province = res.data.province;
        var sArr = [];
        var sId = [];
        sArr.push('请选择');
        sId.push('0');
        for (var i = 0; i < province.length; i++) {
          sArr.push(province[i].name);
          sId.push(province[i].id);
        }

        that.setData({
          courseList: cArr,
          courseId: cId,
          coursePrice: cPrice,
          date: res.data.date,
          shengArr: sArr,
          shengId: sId,
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