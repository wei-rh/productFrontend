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
    order: "",
    token:""
    
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
        that.setData({token:res.data})
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
  //取消订单
  Cancel(e){
    var that = this
    var type= this.data.type=="onetakeorder"?'take':(this.data.type=='onebuyorder'?'buy':'deliver')
    console.log(type)
    wx.showModal({
      title:"提示",
      content:"确定取消",
      success(res){
        if(res.confirm){
          if(that.data.orderserver.Status>=2){
            wx.showToast({
              title: '取消失败',
              icon: 'none',
              duration: 2000
            })
            return
          }
          wx.request({
            url: app.globalData.url+"/cancelorder",
            data:{
              id: that.data.orderserver.ID,
              type: type
            },
            header: {
              Authorization: "Bearer " + that.data.token
            },
            success(res){
              console.log(res)
              if(res.data.error=="成功"){
                that.onShow()
                wx.showToast({
                  title: '取消成功',
                  icon: 'none',
                  duration: 2000
                })
                wx.navigateBack({
                  delta: 0,
                })
              }
            }
          })
        }
      }
    })
  }


})