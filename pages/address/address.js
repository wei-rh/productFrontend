// pages/address/address.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    dizhi: "",
    name: "",
    tel: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.id)
    this.setData({
      id: options.id
    })
  },
  onDizhi(event) {
    this.setData({
      dizhi: event.detail.value
    })
  },
  onName(event) {
    this.setData({
      name: event.detail.value
    })

  },
  onPhone(event) {
    this.setData({
      tel: event.detail.value
    })
  },
  onshw() {
    var res = this.data
    if (res.dizhi == "" || res.name == "" || res.tel == "") {
      wx.showToast({
        title: '请填写完整！',
        duration: 2000
      })
    } else {
      var pages = getCurrentPages();
      var prevPage = pages[pages.length - 2]; //上一个页面
      if (res.id == "1") {
        prevPage.setData({
          fadata: {
            dizhi: res.dizhi,
            name: res.name,
            tel: res.tel
          }
        })
      } else {
        prevPage.setData({
          songdata: {
            dizhi: res.dizhi,
            name: res.name,
            tel: res.tel
          }
        })
      }

      wx.navigateBack({
        delta: 1,
      })
    }


  }
})