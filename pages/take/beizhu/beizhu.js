// pages/take/dizhi/dizhi.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    beizhu: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */

  bindTextAreaBlur(event) {
    this.setData({beizhu:event.detail.value})
  },
  onshw() {
    var pages = getCurrentPages();
    var prevPage = pages[pages.length - 2]; //上一个页面
    prevPage.setData({
     beizhu:this.data.beizhu
    })
    wx.navigateBack({
      delta: 0,
    })
  }
})