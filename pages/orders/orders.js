// pages/order/orders.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 2,
    orders:[],
    status:['待支付','待接单','进行中','已完成','已取消'],
  },
  //导航栏
  switchSlider: function (e) {
    this.setData({
      current: e.target.dataset.index
    })
  },
  // onShow(){
  //   
  // }
  onShow() {
    var that = this
    wx.getStorage({
      key: 'token',
      success(res) {
        var token=res.data
        wx.request({
          url: 'http://localhost:8080/allorder',
          header: {
            Authorization: "Bearer " + token
          },
          success(res) {
            console.log(res)
            var arrary = []
            arrary.push(res.data.buyorder,res.data.takeorder,res.data.deliverorder)
            that.setData({
              orders:arrary
            })
          }
        })
      }
    })
  },


})