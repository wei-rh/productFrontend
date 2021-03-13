// pages/take/baojia/baojia.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    number:0
  },

  /**
   * 生命周期函数--监听页面加载
   */

  bindNumber(event) {
    console.log(event)
    this.setData({number:event.detail.value})
  },
  onshw() {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.setData({
     number:this.data.number
    })
    wx.navigateBack({
      delta: 0,
    })
  }
})