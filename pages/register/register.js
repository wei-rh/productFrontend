// pages/register/register.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    phone:"",
    number:"1234"

  },
  onLoad(e){
    var that = this
    wx.getStorage({
      key: 'token',
      success(res) {
        that.setData({
          token: res.data
        })
      }
    })
  },

  onName(event){
    this.setData({
      name: event.detail.value
    })
  },
  onPhone(event){
    this.setData({
      phone: event.detail.value
    })
  },
  onNumber(event){
    this.setData({
      number: event.detail.value
    })
  },
  submit(){


    if(this.data.name==""||this.data.number==""||this.data.phone==""){
      wx.showToast({
        title: '请填写完整',
        icon: 'none',
        duration: 2000
      })
      return
    }



    var that = this
    wx.request({
      url:  app.globalData.url+"/register",
      data:{
        phone:that.data.phone,
        name:that.data.name,
        number:that.data.number
      },
      header: {
        Authorization: "Bearer " + that.data.token
      },
      success(res){
        console.log(res)
        if(res.data.error!=""){
          wx.showToast({
            title: '邀请码错误',
            icon: 'none',
            duration: 2000
          })
        }else{
          wx.navigateBack({
            delta: 0,
          })
          wx.showToast({
            title: '注册成功',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
    



  }
})