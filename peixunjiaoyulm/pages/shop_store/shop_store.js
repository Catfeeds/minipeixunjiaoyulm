// pages/shop_store/shop_store.js
var app = getApp();
//引入这个插件，使html内容自动转换成wxml内容
var WxParse = require('../../wxParse/wxParse.js');
Page({
  data: {
    // shopInfo:{},
    proList:[],
    tjList:[],
    newList: [],
    tabArr: { 
      curHdIndex: 0, 
      curBdIndex: 0 
    }, 
    current: 0,
    shopInfo: {},
    sid:0,
  },
tabFun: function(e){ 
 //获取触发事件组件的dataset属性 
 var _datasetId=e.target.dataset.id; 
 var _obj={}; 
 _obj.curHdIndex=_datasetId; 
 _obj.curBdIndex=_datasetId; 
 this.setData({ 
  tabArr: _obj 
 }); 
}, 
  showModal: function () {
  // 显示遮罩层
  var animation = wx.createAnimation({
   duration: 200,
   timingFunction: "linear",
   delay: 0
  })
  this.animation = animation
  animation.translateY(300).step()
  this.setData({
   animationData: animation.export(),
   showModalStatus: true
  })
  setTimeout(function () {
   animation.translateY(0).step()
   this.setData({
    animationData: animation.export()
   })
  }.bind(this), 200)
 },
 hideModal: function () {
  // 隐藏遮罩层
  var animation = wx.createAnimation({
   duration: 200,
   timingFunction: "linear",
   delay: 0
  })
  this.animation = animation
  animation.translateY(300).step()
  this.setData({
   animationData: animation.export(),
  })
  setTimeout(function () {
   animation.translateY(0).step()
   this.setData({
    animationData: animation.export(),
    showModalStatus: false
   })
  }.bind(this), 200)
 },

 onLoad: function (options) {
   var sid = options.shopId;
   this.setData({
     sid: sid,
   });
  },

//窗体加载事件  
onShow: function () {
  wx.showToast({
    title: '加载中...',
    icon: 'loading',
  })
  var that = this;
  var sid = that.data.sid;
    wx.request({
      url: app.d.ceshiUrl + '/Api/Shangchang/shop_details',
      method:'post',
      data: {
        shop_id:sid
      },
      header: {
        'Content-Type':  'application/x-www-form-urlencoded'
      },
      success: function (res) {  
        var shop_info = res.data.shop_info;
        var content=res.data.shop_info.content;
        var pro = res.data.pro;
        var tj_list = res.data.tj_list;
        var list = res.data.list;
        var status = res.data.status;
        if(status==1){
          WxParse.wxParse('content', 'html', content, that, 3);
           that.setData({
            shopInfo:shop_info,
            proList:pro,
            tjList: tj_list,
            newList: list,
          });
        }else{
          wx.showToast({
            title: res.data.err,
            duration: 2000
          });
        }
      },
      error:function(e){
        wx.showToast({
          title: '网络异常！',
          duration: 2000
        });
      },
    })
},
     
  //详情页跳转
lookdetail: function (e) {
    console.log(e)
    var lookid = e.currentTarget.dataset;
    console.log(e.currentTarget.dataset);
    wx.navigateTo({
      url: "../index/detail?id=" + lookid.id
    })
  },
  switchSlider: function (e) {
    this.setData({
      current: e.target.dataset.index
    })
  },
  changeSlider: function (e) {
    this.setData({
      current: e.detail.current
    })
  },
  onReady: function () {
    // 页面渲染完成
    wx.hideToast();
  },

  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var sid = this.data.sid;
    return {
      title: '中国婚庆文化产业园 商铺',
      path: '/pages/shop_store/shop_store?shopId=' + sid,
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },
})
