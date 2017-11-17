var reg = /^((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)$/;
var app = getApp();
Page({
   data: {
      idcard: '',
      yyzz: '',
      disabled: false,
      userver: false,
      index: 1,
      company: '',
      uname: '',
      tel: '',
      logo: '../../images/sssss.png',
      ptype: 0,
      img1: '',
      img2: '',
      eid: 0,
      cprice: 0,
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
                 imgs: self.data.idcard
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

   // 营业执照
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

   //企业名称 失焦事件
   bindShopname: function (e) {
      this.setData({
         company: e.detail.value
      })
   },

   //窗体加载事件
   onLoad: function (options) {
      var that = this;
      var eid = options.eid;
      var title = options.title;
      var cprice = options.cprice;
      that.setData({
        eid: eid,
        cprice: cprice,
      });
   },

   //提交认证
   formDataCommit: function (e) {
      var that = this;
      var company = that.data.company;
      var uname = that.data.uname;
      var tel = that.data.tel;
      var img1 = that.data.img1;
      var img2 = that.data.img2;
      if (!company) {
         wx.showToast({
            title: '请输入企业名称！',
            duration: 2000
         });
         return false;
      }
      if (!tel) {
         wx.showToast({
            title: '请输入联系方式！',
            duration: 2500
         });
         return false;
      }

      wx.request({
        url: app.d.ceshiUrl + '/Api/Exhibition/signup',
        method: 'post',
        data: {
            uid: app.d.userId,
            eid: that.data.eid,
            company: company,
            uname: uname,
            tel: tel,
            idcard: img1,
            yyzz: img2,
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
              var cprice = that.data.cprice;
              if (parseFloat(cprice)>0) {
                //发起微信支付
                wx.showToast({
                  title: '提交成功,正在发起微信支付...',
                  icon: 'loading',
                  duration: 2500
                });
                setTimeout(function (e) {
                  that.wxpay();
                }, 2500);
              } else {
                wx.showToast({
                  title: '提交成功，请耐心等待审核！',
                  duration: 2000
                });
                setTimeout(function(){
                  wx.navigateBack();
                },2300);
              }

            } else {
               wx.showToast({
                  title: res.data.err,
                  duration: 2000
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

   //调起微信支付
   wxpay: function (e) {
     var that = this;
     wx.request({
       url: app.d.ceshiUrl + '/Api/Wxpay/buyexhibition',
       data: {
         eid: that.data.eid,
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
                   url: '../class_zhan/class_zhan?eid=' + eid,
                 });
               }, 2300);
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

   watch() {
      console.log(1)
   }
})