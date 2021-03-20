// pages/order/orders.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 2,
    token: "",
    orders: [],
    orders2: [],
    status: ['待支付', '待接单', '进行中', '已完成', '已取消'],
    status2:['接单','已接单','已完成'],
    pattern: true,
    current2: 0,

  },
  //导航栏
  switchSlider: function (e) {
    this.setData({
      current: e.target.dataset.index
    })
  },
  //导航栏2,骑手页面
  switchSlider2: function (e) {
    this.setData({
      current2: e.target.dataset.index
    })
    this.onShow()
  },
  onLoad() {
    this.setData({
      pattern: app.globalData.pattern
    })
    if (this.data.pattern) {
      var that = this
      wx.getStorage({
        key: 'token',
        success(res) {
          var token = res.data
          that.setData({
            token: res.data
          })
          wx.request({
            url: 'http://localhost:8080/allorder',
            header: {
              Authorization: "Bearer " + token
            },
            success(res) {
              console.log(res)
              var arrary = []
              arrary.push(res.data.buyorder, res.data.takeorder, res.data.deliverorder)
              that.setData({
                orders: arrary
              })
            }
          })
        }
      })
    }


  },
  onShow() {

    var pattern = this.data.pattern
    var current2 = this.data.current2
    var that = this
    if (!pattern) {
      switch (current2) {
        case 0:
          console.log("0")
          wx.request({
            url: app.globalData.url + "/allstatusone",
            header: {
              Authorization: "Bearer " + this.data.token
            },
            success(res) {
              console.log(res)
              var arrary = []
              arrary.push(res.data.buy, res.data.take, res.data.deliver)
              that.setData({
                orders2: arrary
              })
            }
          })
          break
        case 1:
          console.log("1")
          break
        case 2:
          console.log("2")
          break
      }


    }




  },
  // 长按删除订单
  longPress: function (e) {
    var event = e.currentTarget.dataset
    console.log(event)
    var that = this
    wx.showModal({
      title: "提示",
      content: "确定删除",
      success(res) {
        if (res.confirm) {
          if (event.status == 2) {
            wx.showToast({
              title: '删除失败',
              icon: 'none',
              duration: 2000
            })
            return
          }
          wx.request({
            url: app.globalData.url + "/deleteorder",
            data: {
              id: event.id,
              type: event.type
            },
            header: {
              Authorization: "Bearer " + that.data.token
            },
            success(res) {
              console.log(res)
              if (res.data.error == "成功") {
                that.onLoad()
                wx.showToast({
                  title: '删除成功',
                  icon: 'none',
                  duration: 2000
                })
              }
            }
          })
        }
      }
    })
  }


})