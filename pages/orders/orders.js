// pages/order/orders.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
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
          }
        })
      }
    })
  },


})