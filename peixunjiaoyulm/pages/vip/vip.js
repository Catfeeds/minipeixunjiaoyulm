// pages/article/article.js
import Util from '../../utils/imgsize';  
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imageWidth: 0,
    imageHeight: 0,
    slideshow: false,
    selectedId: '',
    width: 0,
    height: 0,
    advurl: '',
    hindd:true,
    a:0,
    pan: [],
    img1: '',
    img2: '',
    img3: '',
    page: 2,
    title:'',
    pageColor:0,
    sex: [ '男', '女'],
    index0:0,
    index1:0,
    index11:0,
    index2:0,
    age: ["不限","18", "25", "30", "35", "40", "45", "50", "55"],
    age1: ["不限","20", "25", "30", "35","40","45","50","55","60"],
    marriage:["不限","未婚","离异","丧偶"],
    dan: [],
    yi: [],
    shengArr: [],//省级数组
    shengId: [],//省级id数组
    shiArr: [],//城市数组
    shiId: [],//城市id数组
    shengIndex: 0,
    shiIndex: 0,
    sheng: 0,
    city: 0,
  },


  //tap
  pageBindtap:function (e) {
    this.setData({
      pageColor: e.target.id,
      page:2,
    })
  },
  array:function(e) {
    this.setData({
      index0: e.detail.value
    })
  },
  array1: function (e) {
    this.setData({
      index1: e.detail.value
    })
  },
  array11: function (e) {
    this.setData({
      index11: e.detail.value
    })
  },
  array2: function (e) {
    this.setData({
      index2: e.detail.value
    })
  },
  array3: function (e) {
    this.setData({
      index3: e.detail.value
    })
  },
  array4: function (e) {
    this.setData({
      index4: e.detail.value
    })
  },

  //会员查看资料
  showinfo: function (e) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../userinfo/userinfo?title=会员资料&id='+id,
    })
  },

  //省份变动
  bindPickerChangeshengArr: function (e) {
    this.setData({
      shengIndex: e.detail.value,
      shiArr: [],
      shiId: [],
      quArr: [],
      quiId: []
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
        hArr.push('城市');
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

  //市级变动
  bindPickerChangeshiArr: function (e) {
    this.setData({
      shiIndex: e.detail.value,
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
        var status = res.data.status;
        var area = res.data.area_list;
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

  imageLoad: function (e) {
    console.log(e)
    //获取图片的原始宽度和高度  
    let originalWidth = e.detail.width;
    let originalHeight = e.detail.height;
    let imageSize = Util.imageZoomHeightUtil(originalWidth, originalHeight - 130);

    // let imageSize = Util.imageZoomHeightUtil(originalWidth,originalHeight,);  
    // let imageSize = Util.imageZoomWidthUtil(originalWidth, originalHeight, 145);

    this.setData({
      imageWidth: imageSize.imageWidth, imageHeight: imageSize.imageHeight
    });
  },

  // 打开轮播遮罩层
  show: function (e) {
    var that = this;
    var id = e.target.dataset.id;
    that.setData({
      slideshow: true,
      selectedId: id,
      width: e.target.dataset.width,
      height: e.target.dataset.height,
    })
  },

  // 关闭遮罩层
  hide: function () {
    this.setData({
      slideshow: false
    })
  },

  hid:function(){
  var a=this.data.a
    if(a==0){
      this.setData({
        hindd: false,
        a:1
      })
    }else{
      this.setData({
        hindd: true,
        a: 0
      })
    }

  },
  // 上传图片1
  chooseImage: function () {
    var self = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: function (res) {
        var imageSrc = res.tempFilePaths[0]
        //图片上传服务器
        wx.uploadFile({
          url: app.d.ceshiUrl + '/Api/User/uploadimg',
          filePath: imageSrc,
          name: 'img',
          formData: {
            uid: app.d.userId,
            imgs: self.data.img1,
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
              self.setData({
                imageSrc,
                img1: res.data,
              })
            } else {
              wx.showToast({
                title: 'upload_failed !',
                duration: 2000
              })
            }
          },
          fail: function ({ errMsg }) {
            console.log('uploadImage fail, errMsg is', errMsg)
            wx.showToast({
              title: '上传失败',
              duration: 2000
            })
          }
        })
      },
      fail: function ({ errMsg }) {
        console.log('chooseImage fail, err is', errMsg)
        wx.showToast({
          title: '图片选取失败',
          duration: 2000
        })
      }
    })
  },
  // 上传图片2
  choose: function () {
    var self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: function (res) {
        var image = res.tempFilePaths[0];
        //图片上传服务器
        wx.uploadFile({
          url: app.d.ceshiUrl + '/Api/User/uploadimg',
          filePath: image,
          name: 'img',
          formData: {
            uid: app.d.userId,
            imgs: self.data.img2,
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
              self.setData({
                image,
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
            console.log('uploadImage fail, errMsg is', errMsg);
            wx.showToast({
              title: '上传失败',
              duration: 2000
            })
          }
        })
      },
      fail: function ({ errMsg }) {
        console.log('chooseImage fail, err is', errMsg);
        wx.showToast({
          title: '图片选取失败',
          duration: 2000
        })
      }
    })
  },

  // 上传图片3
  choo: function () {
    var self = this
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: function (res) {
        var img = res.tempFilePaths[0];
        //图片上传服务器
        wx.uploadFile({
          url: app.d.ceshiUrl + '/Api/User/uploadimg',
          filePath: img,
          name: 'img',
          formData: {
            uid: app.d.userId,
            imgs: self.data.img3,
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
              self.setData({
                img,
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
            console.log('uploadImage fail, errMsg is', errMsg);
            wx.showToast({
              title: '上传失败',
              duration: 2000
            })
          }
        })
      },
      fail: function ({ errMsg }) {
        console.log('chooseImage fail, err is', errMsg);
        wx.showToast({
          title: '图片选取失败',
          duration: 2000
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var objectId = options.title;
    var ptitle = app.d.title;
    //更改头部标题
    wx.setNavigationBarTitle({
      title: ptitle+' '+objectId,
    });
    this.setData({
      title: objectId,
    });
    //this.loadData();
  },

  onShow: function () {
    this.loadData();
  },

  //加载所有会员分享
  loadData: function () {
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    });
    var that = this;
    that.setData({
      page : 2,
    });
    wx.request({
      url: app.d.ceshiUrl + '/Api/user/info_list',
      method: 'post',
      data: {
        uid: app.d.userId,
        city: app.d.cityId,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var List = res.data.list;
        var dan = res.data.dan;
        var yi = res.data.yi;
        var province = res.data.prov;
        var sArr = [];
        var sId = [];
        sArr.push('省份');
        sId.push('0');
        for (var i = 0; i < province.length; i++) {
          sArr.push(province[i].name);
          sId.push(province[i].id);
        }
        that.setData({
          pan: List,
          dan: dan,
          yi: yi,
          shengArr: sArr,
          shengId: sId
        });
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！err:loadData',
          duration: 2000
        });
      },
    })
  },

  //提交
  bindFormSubmit: function (e) {
    var that = this;
    var textarea = e.detail.value.textarea;
    if (!textarea) {
      wx.showToast({
        title: '请先输入您的个人信息介绍！',
        duration: 2000
      });
      return false;
    }
    wx.request({
      url: app.d.ceshiUrl + '/Api/User/info',
      method: 'post',
      data: {
        uid: app.d.userId,
        content: textarea,
        adv1: that.data.img1,
        adv2: that.data.img2,
        adv3: that.data.img3,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var status = res.data.status;
        if (status == 1) {
          wx.showToast({
            title: '已成功提交审核！',
            duration: 2000
          });
          that.setData({
            hindd: true,
            a: 0
          })
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

  //搜索 事件
  bindSearch: function (e) {
    var that = this;
    that.setData({
      pageColor: 0,
      page:2,
    });
    //获取性别
    var sex = that.data.index0;
    //获取年龄1
    var nl = that.data.index1;
    var age1 = that.data.age;
    //获取年龄2
    var nl2 = that.data.index11;
    var age2 = that.data.age1;
    //获取城市ID
    var city = that.data.city;
    //获取婚史
    var hy = that.data.index2;
    wx.request({
      url: app.d.ceshiUrl + '/Api/user/loadmoredan',
      method: 'post',
      data: {
        uid: app.d.userId,
        sex: parseInt(sex) + 1,
        age1: age1[nl],
        age2: age2[nl2],
        city: city,
        hy: hy,
        page: 1,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var dan = res.data.dan;
        if (dan == '') {
          wx.showToast({
            title: '没有找到更多数据！',
            duration: 2000
          });
          return false;
        }
        that.setData({
          dan: dan,
          index0: 0,
          index1: 0,
          index11: 0,
          index2: 0,
          city: 0,
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 页面渲染完成
    wx.hideToast();
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
    var choose = that.data.pageColor;
    if(choose=='0') {
      that.loadDan();
    } else if(choose=='1') {
      that.loadYi();
    }else if(choose=='2') {
      that.loadList();
    }
  },

  /**
   *  加载更多 首页交友
   */
  loadDan: function () {
    var page = that.data.page;
    //获取性别
    var sex = that.data.index0;
    //获取年龄1
    var nl = that.data.index1;
    var age1 = that.data.age;
    //获取年龄2
    var nl2 = that.data.index11;
    var age2 = that.data.age1;
    //获取城市ID
    var city = that.data.city;
    //获取婚史
    var hy = that.data.index2;
    wx.request({
      url: app.d.ceshiUrl + '/Api/user/loadmoredan',
      method: 'post',
      data: {
        uid: app.d.userId,
        sex: parseInt(sex) + 1,
        age1: age1[nl],
        age2: age2[nl2],
        city: city,
        hy: hy,
        page: page,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var dan = res.data.dan;
        if (dan == '') {
          return false;
        }
        that.setData({
          dan: that.data.dan.concat(dan),
          page: parseInt(page) + 1,
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
   *  加载更多 同城异性
   */
  loadYi: function () {
    var page = that.data.page;
    wx.request({
      url: app.d.ceshiUrl + '/Api/user/loadmoreyi',
      method: 'post',
      data: {
        uid: app.d.userId,
        city: app.d.cityId,
        page: page,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var yi = res.data.yi;
        if (yi == '') {
          return false;
        }
        that.setData({
          yi: that.data.yi.concat(yi),
          page: parseInt(page) + 1,
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
   *  加载更多 心情日记
   */
  loadList: function () {
    var page = that.data.page;
    wx.request({
      url: app.d.ceshiUrl + '/Api/user/loadmorelist',
      method: 'post',
      data: {
        uid: app.d.userId,
        page: page,
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var List = res.data.list;
        if (List == '') {
          return false;
        }
        that.setData({
          List: that.data.List.concat(List),
          page: parseInt(page) + 1,
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
      title: '中国婚庆文化产业园 ' + title,
      path: '/pages/vip/vip',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  }
})

