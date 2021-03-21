// pages/myData/myData.js

const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    server: "",
    pattern:"",
  },
  Pattern(){
    this.setData({pattern:!this.data.pattern}) 
    app.globalData.pattern = this.data.pattern
  },
  //导航栏
  switchSlider: function (e) {
    this.setData({
      current: e.target.dataset.index
    })
    this.onShow()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    var that = this
    wx.getStorage({
      key: 'token',
      success(res) {
        //获取骑手账号
        wx.request({
          url: app.globalData.url+'/serverexist',
          header: {
            Authorization: "Bearer " + res.data
          },
          success(res) {
            console.log(res)
            that.setData({
              server:res.data.server
            })
          }
        })
      }
    })

    this.getInfo()
    if (this.data.userInfo == null) {
      wx.navigateTo({
        url: '../login/index',
      })
    }

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({pattern:app.globalData.pattern}) 

  },

  /**
   * 获取用户的信息
   */
  getInfo() {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
          })
        }
      })
    }
  }



})