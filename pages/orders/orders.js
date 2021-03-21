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
    status2: ['接单', '确认', '已完成'],
    pattern: "",
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


  },
  onShow() {
    this.setData({
      pattern: app.globalData.pattern
    })
    var pattern = this.data.pattern
    var current2 = this.data.current2
    var that = this
    var arrary = ['/allstatusone', "/allstatustwo", "/allstatusthree"]
    if (!pattern) {
      wx.request({
        url: app.globalData.url + arrary[current2],
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


    }
  },
  // 长按删除订单
  longPress: function (e) {
    if(this.data.current==3||this.data.current2==2){
      wx.showToast({
        title: '不能删除',
        icon: 'none',
        duration: 2000
      })
      return
    }


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
  },

  //点击接单或者点击确定
  OrderReceiving(e) {
    var that = this
    var current2 = this.data.current2
    var ordertype = e.currentTarget.dataset.type
    var orderid = e.currentTarget.dataset.id
    console.log(current2)
    console.log(ordertype)
    console.log(orderid)

    wx.request({
      url: app.globalData.url + "/orderreceiving",
      header: {
        Authorization: "Bearer " + this.data.token
      },
      data: {
        id: orderid,
        type: ordertype,
        current2: current2
      },
      success(res) {
        console.log(res)
        if (res.data.error == "") {
          if (current2 == 0) {
            wx.showToast({
              title: '接单成功',
              icon: 'none',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '确认成功',
              icon: 'none',
              duration: 2000
            })
          }
          that.onShow()
        }
      }
    })




  }



})