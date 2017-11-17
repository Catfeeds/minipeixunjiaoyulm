var app = getApp();
// 引入SDK核心类
var QQMapWX = require('../../resources/map/qqmap-wx-jssdk.js');
Page({
  data: {
    imgUrls: [],
    ggMiddle: [],
    imgs:'',
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    circular: true,
    productData: [],
    proCat:[],
    proLastCat: [],
    ex:[],
    page: 2,
    index: 2,
    brand:[],
    // 滑动
    imgUrl: [],
    kbs:[],
    lastcat:[],
    course:[],
    ak: "AXMRrsEZ0CGfogyRENeexOTkHxauhZtz",   //填写申请到的ak 
    address: '定位中',
    cityId: 2152
  },
//跳转商品列表页   
listdetail:function(e){
    console.log(e.currentTarget.dataset.title)
    wx.navigateTo({
      url: '../listdetail/listdetail?title='+e.currentTarget.dataset.title,
    })
  },
//跳转商品搜索页  
suo:function(e){
    wx.navigateTo({
      url: '../search/search',
    })
  },
//前5个分类跳转
other: function(e){
  var ptype =e.currentTarget.dataset.ptype;
  var title =e.currentTarget.dataset.text;
  if(ptype=='news'){
    wx.navigateTo({
      url: '../inf/inf?title=' + title
    });
  }else if(ptype=='shop'){
    wx.navigateTo({
      url: '../strengths/strengths?title=' + title
    });
  }else if(ptype=='join'){
    wx.navigateTo({
      url: '../personal/personal?title=' + title
    });
  }else if(ptype=='gywm'){
    wx.navigateTo({
      url: '../synopsis/synopsis?title=' + title+'&wedId=1'
    });
  } else if (ptype == 'vip') {
    wx.navigateTo({
      url: '../vip/vip?title=' + title
    });
  } else if (ptype == 'life') {
    wx.navigateTo({
      url: '../lifezone/lifezone?title=' + title
    });
  } else if (ptype == 'vou') {
    wx.navigateTo({
      url: '../ritual/ritual?title=' + title
    });
  } else if (ptype == 'jyrz') {
    wx.navigateTo({
      url: '../jyrz/jyrz?title=' + title
    });
  }
},
//后四个分类跳转
list: function (e) {
    var ptype = e.currentTarget.dataset.ptype;
    var title = e.currentTarget.dataset.text;
    wx.navigateTo({
      url: '../lifezone/lifezone?title=' + title + '&cid=' + ptype
    });
},

//更多推荐活动
kecheng:function(){
    wx.navigateTo({
      url: '../kecheng/kecheng',
    })
},

//更多展会
zhanhui: function () {
  wx.navigateTo({
    url: '../zhanhui/zhanhui',
  })
},

//品牌街跳转
jj:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../listdetail/listdetail?brandId='+id,
    })
  },

//在线报名
tian: function (e) {
  var id = e.currentTarget.dataset.id;
  wx.navigateTo({
    url: '../works/works',
  })
},
//点击加载更多
getMore:function(e){
  var that = this;
  var page = that.data.page;
  wx.request({
      url: app.d.ceshiUrl + '/Api/Index/getlist',
      method:'post',
      data: {page:page},
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {  
        var prolist = res.data.prolist;
        if(prolist==''){
          wx.showToast({
            title: '没有更多数据！',
            duration: 2000
          });
          return false;
        }
        //that.initProductData(data);
        that.setData({
          page: page+1,
          productData:that.data.productData.concat(prolist)
        });
        //endInitData
      },
      fail:function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      }
    })
},

  changeIndicatorDots: function (e) {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },
  changeAutoplay: function (e) {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },
  intervalChange: function (e) {
    this.setData({
      interval: e.detail.value
    })
  },
  durationChange: function (e) {
    this.setData({
      duration: e.detail.value
    })
  },

  onLoad: function (options) {
    wx.showToast({
      title: '加载中...',
      icon: 'loading'
    });
    var that = this;
    // 地图
    var qqmapsdk = new QQMapWX({
      key: '3F4BZ-6RBR6-Q3HSQ-ML5JH-KF22H-YTBRQ'
    });
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        that.setData({
          longitude: res.longitude,
          latitude: res.latitude,
        });
        console.log(res.longitude + " " + res.latitude);

        qqmapsdk.reverseGeocoder({
          location: {
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: function (res) {
            //result.city
            that.setData({
              address: res.result.ad_info.city
            });
            that.getcityId();
          },
          fail: function (res) {
            console.log(res);
          },
          complete: function (res) {
            console.log(res);
          },
        });
      }
    })
  },

  //获取当前城市ID
  getcityId: function () {
    var that = this;
    var address = that.data.address;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Index/getcityid',
      method: 'post',
      data: { addr: address },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var cityid = res.data.cityid;
        that.setData({
          cityId: cityid,
        });
        app.d.cityId = cityid;
        //endInitData
      },
    });
  },

  onShow: function () {
    // 生命周期函数--监听页面显示
    var that = this;
    var cityid = app.d.cityId;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Index/index',
      method: 'post',
      data: {
        cityid: app.d.cityId
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        var ggtop = res.data.ggtop;
        var ggmiddle = res.data.ggmiddle;
        var procat = res.data.procat;
        var prolastcat = res.data.prolastcat;
        var prolist = res.data.prolist;
        var brand = res.data.brand;
        var course = res.data.course;
        var ex = res.data.ex;
        var imgs = res.data.imgs;
        that.setData({
          imgUrls: ggtop,
          ggMiddle: ggmiddle,
          proCat: procat,
          proLastCat: prolastcat,
          productData: prolist,
          brand: brand,
          course: course,
          ex: ex,
          imgs: imgs,
        });
        //endInitData
      },
      fail: function (e) {
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    });
  },

  //广告图点击事件
  advtap: function (e) {
    var that = this;
    var tztype = e.currentTarget.dataset.type;
    var action = e.currentTarget.dataset.action;
    var title = e.currentTarget.dataset.text;
    if (tztype == 'procat') {
      //分类商品列表页
      wx.navigateTo({
        url: '../listdetail/listdetail?cat_id=' + parseInt(action),
      });
    } else if (tztype == 'prolist') {
      //商品列表页
      wx.navigateTo({
        url: '../listdetail/listdetail?title=' + title,
      });
    } else if (tztype == 'pro') {
      //商品详情页
      wx.navigateTo({
        url: '../product/detail?productId=' + parseInt(action),
      });
    } else if (tztype == 'newslist') {
      //新闻资讯列表页
      wx.navigateTo({
        url: '../inf/inf?title=' + title,
      });
    } else if (tztype == 'news') {
      //新闻资讯详情页
      wx.navigateTo({
        url: '../news/news?newsId=' + parseInt(action),
      });
    } else if (tztype == 'shoplist') {
      //商铺列表页
      wx.navigateTo({
        url: '../strengths/strengths?title=' + title,
      });
    } else if (tztype == 'shop') {
      //商铺详情页
      wx.navigateTo({
        url: '../shop_store/shop_store?shopId=' + parseInt(action),
      });
    } else if (tztype == 'join') {
      //加盟合作页
      wx.navigateTo({
        url: '../personal/personal?title=' + title,
      });
    } else if (tztype == 'life') {
      //生活专区页
      wx.navigateTo({
        url: '../lifezone/lifezone?title=' + title,
      });
    } else if (tztype == 'vou') {
      //优惠券列表页
      wx.navigateTo({
        url: '../ritual/ritual?title=' + title,
      });
    } else if (tztype == 'courselist') {
      //活动列表页
      wx.navigateTo({
        url: '../kecheng/kecheng?title=' + title,
      });
    } else if (tztype == 'course') {
      //活动详情页
      wx.navigateTo({
        url: '../class/class?courseId=' + parseInt(action) + '&title=' + title,
      });
    } else {
      
    }
  },

  onShareAppMessage: function () {
    return {
      title: '中国婚庆文化产业园',
      path: '/pages/index/index',
      success: function(res) {
        // 分享成功
      },
      fail: function(res) {
        // 分享失败
      }
    }
  },
  // 定位点击事件
  getLocation: function (e) {
    console.log(e)
    var that = this;
    var tie = that.data.address;
    wx.navigateTo({
      url: '../location/location?tiele=' + tie,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  onReady: function () {
    // 页面渲染完成
    wx.hideToast();
  },
});