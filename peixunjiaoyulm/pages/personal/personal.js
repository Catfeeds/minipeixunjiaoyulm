var reg = /^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/;
var app = getApp();
Page({
  data:{
    zheng: '',
    fan: '',
    yyzz: '',
    dianmian: '',
    disabled: false,
    userver:false,
    index:1,
    name:'',
    uname:'',
    tel:'',
    address:'',
    logo:'../../images/sssss.png',
    audit:10,
    reason: '无',
    ptype:0,
    img1:'',
    img2:'',
    img3: '',
    img4: '',
    tjname:'',
    tjtel:'',
    title:'',
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
            if (statusCode==200){
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
          fail: function ({errMsg}) {
            wx.showToast({
              title: '上传失败',
              duration: 2000
            })
          }
        })
      },
      fail: function ({errMsg}) {
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
          fail: function ({errMsg}) {
            wx.showToast({
              title: '上传失败',
              icon: 'success',
              duration: 2000
            })
          }
        })
      },
      fail: function ({errMsg}) {
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
          fail: function ({errMsg}) {
            wx.showToast({
              title: '上传失败',
              icon: 'success',
              duration: 2000
            })
          }
        })
      },
      fail: function ({errMsg}) {
        wx.showToast({
          title: '图片选择失败',
          icon: 'success',
          duration: 2000
        })
      }
    })
  },

  // 店铺门头照
  shopimgs: function () {
    var that = this;
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
            imgs: that.data.dianmian
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
              })

              that.setData({
                shopimgs: imageSrc,
                img4: res.data,
              })
            } else {
              wx.showToast({
                title: 'upload_failed !',
                duration: 2000
              })
            }
          },
          fail: function ({errMsg}) {
            wx.showToast({
              title: '上传失败',
              duration: 2000
            })
          }
        })
      },
      fail: function ({errMsg}) {
        wx.showToast({
          title: '图片选择失败',
          duration: 2000
        })
      }
    })
  },

//店铺名 失焦事件
bindShopname: function(e) {
    this.setData({
      name: e.detail.value
    })
  },

//详细地址  失去焦点事件
addsInputEvent:function(e){
    this.setData({
      address:e.detail.value
    })
 },

 //绑定错误图片
binderrorimg:function(e){
  var logo = e.target.dataset.errorimg;
  this.setData({
    logo
  })
},

//联系人 失焦事件
bindKeyname(e) {
  this.setData({
    uname: e.detail.value,
  })
},

//手机焦点事件
bindTelInput(e) {
  this.setData({
    tel: e.detail.value,
    userver: reg.test(e.detail.value)
  })
},

//推荐人 失焦事件
bindTjnameInput(e) {
  this.setData({
    tjname: e.detail.value,
  })
},

// 推荐人手机 焦点事件
bindTjtelInput(e) {
  this.setData({
    tjtel: e.detail.value,
    userver: reg.test(e.detail.value)
  })
},

//窗体加载事件
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

//窗体显示事件
onShow: function () {
    var that = this;
    var uid = app.d.userId;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Shop/index',
      method: 'post',
      data: {
        uid: uid
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var shopInfo = res.data.shop_info;
        if (shopInfo != '') {
          that.setData({
            name: shopInfo.name,
            uname: shopInfo.uname,
            tel: shopInfo.tel,
            audit: shopInfo.audit,
            address: shopInfo.address,
            tjname: shopInfo.tjname,
            tjtel: shopInfo.tjtel,
            zheng: shopInfo.zheng,
            fan: shopInfo.fan,
            yyzz: shopInfo.yyzz,
            dianmian: shopInfo.dianmian,
            reason: shopInfo.reason
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

//提交认证
formDataCommit: function (e) {
    var that = this;
    var name = that.data.name;
    var uname = that.data.uname;
    var tel = that.data.tel;
    var address = that.data.address;
    var img1 = that.data.img1;
    var img2 = that.data.img2;
    var img3 = that.data.img3;
    var dianmian = that.data.img4;
    if (!name){
        wx.showToast({
          title: '请输入店铺名称！',
          duration: 2500
        });
        return false;
    }
    if (!tel) {
      wx.showToast({
        title: '请输入联系电话！',
        duration: 2500
      });
      return false;
    }

    wx.request({
      url: app.d.ceshiUrl + '/Api/Shop/audit',
      method: 'post',
      data: { 
        uid : app.d.userId,
        name: name,
        uname: uname,
        tel: tel,
        address: address,
        zheng: img1,
        fan: img2,
        yyzz: img3,
        dianmian: dianmian,
        tjname: that.data.tjname,
        tjtel: that.data.tjtel,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          that.setData({
            disabled: true
          });
          wx.showToast({
              title: '提交成功，请耐心等待审核！',
              duration: 2000
          });
          setTimeout(function(){
            that.onShow();
          },2300);

        } else {
          wx.showToast({
            title: res.data.err,
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

  watch (){
    console.log(1)
  },
})