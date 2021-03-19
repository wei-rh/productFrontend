// pages/orderDetail/orderDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status:['待支付','待接单','进行中','已完成','已取消'],
    orderserver:[],
    server:"",
    text:{"onetakeorder":"帮我取","onebuyorder":"帮我买","onedeliverorder":"帮我送"},
    order: ""
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      id: options.id
    })
    this.setData({
      type: options.type
    })

    var that = this

    wx.getStorage({
      key: 'token',
      success(res) {
        var token = res.data
        wx.request({
          url: app.globalData.url + "/" + options.type,
          data: {
            id: options.id
          },
          header: {
            Authorization: "Bearer " + token
          },
          success(res) {
            console.log(res)
            that.setData({order:res.data.order})
            var s = res.data.order[0]
            var se = s.TakeServer?s.TakeServer:(s.BuyServer?s.BuyServer:s.DeliverServer)
            that.setData({orderserver:se})
            if(se.Serverid!=0){
              wx.request({
                url: app.globalData.url + "/getserver",
                data:{
                  id:se.Serverid
                },
                header: {
                  Authorization: "Bearer " + token
                },
                success(res){
                  that.setData({server:res.data.server})
                }
              })
            }

          }
        })
      }
    })
  },
  makePhone(){
    wx.makePhoneCall({
      phoneNumber: this.data.server.Tel //仅为示例，并非真实的电话号码
    })
  },
})