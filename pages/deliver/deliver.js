// pages/take/take.js
var util = require('../../utils/util.js');
const date = new Date();
const year = ['今天', '明天', '后天'];
const hours = [];
const minutes = [];
const app  = getApp()
//获取小时
for (let i = 0; i < 24; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  hours.push("" + i);
}
//获取分钟
for (let i = 0; i < 60; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  minutes.push("" + i);
}
Page({
  data: {
    fadata:"",
    token:"",
    songdata:"",
    beizhu:"",
    number:0,
    show: false,
    goodText: "",
    goodid: 0,
    goods: ['其他', '美食', '文件', '快递', '鲜花', '钥匙', '手机'],
    weightid: 0,
    weight: ['10公斤以内', '10-15公斤', '15-20公斤', '20-25公斤'],
    time: '',
    multiArray: [year, hours, minutes],
    multiIndex: ['', '', ''],
    choose_year: '',  //修改的下单时间
  },
  onBaojia(event) {
    wx.navigateTo({
      url: '/pages/take/baojia/baojia',
    })
  },
  onLoad: function (options) {
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
  onClose() {
    this.setData({
      show: false
    });
  },
  onChoice() {
    this.setData({
      show: true
    })
  },
  onSure() {
    var res = this.data
    var test = this.data.goods[res.goodid] + "/" + this.data.weight[res.weightid]
    this.setData({
      goodText: test
    })
    this.setData({
      show: false
    })
  },
  radioButtonTap(e) {
    console.log(e)
    this.setData({
      goodid: e.currentTarget.dataset.id
    })
  },
  radioButtonTap2(e) {
    this.setData({
      weightid: e.currentTarget.dataset.id
    })
  },
  //设置当前默认的时间
  onSetTime() {
    var hours = date.getHours()
    var minute = date.getMinutes()
    var index = ['今天', hours, minute]
    this.setData({
      multiIndex: index
    })
    this.setData({
      time: util.formatTime(new Date())
    })
  },
  // 获取时间，今天，明天，后天
  getTime(num) {
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp + (num * 24 * 60 * 60 * 1000));
    //获取年份  
    var Y = date.getFullYear();
    //获取月份  
    var M = date.getMonth() + 1;
    //获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    var str = Y + "/" + M + "/" + D
    return str
  },
  //获取时间日期
  bindMultiPickerChange: function (e) {
    var res = e.detail.value
    if (res[1] < 10) {
      res[1] = "0" + res[1]
    }
    if (res[2] < 10) {
      res[2] = "0" + res[2]
    }
    var year = this.getTime(res[0])
    var time = year + " " + res[1] + ":" + res[2]
    this.setData({
      choose_year: time
    })
  },
  onBeizhu(){
    wx.navigateTo({
      url: '/pages/take/beizhu/beizhu',
    })
  },
  onShow() {
    this.onSetTime()
    console.log("onshow")
  
  },
  onshw() {
    var res = this.data
    if (res.fadata == "" || res.songdata == "" || res.goodText == "") {
      wx.showToast({
        title: '请填写完整！',
        duration: 2000
      })
      return
    }

    var sendAddress = res.fadata.dizhi + " " + res.fadata.name + " " + res.fadata.tel;
    var getAddress = res.songdata.dizhi + " " + res.songdata.name + " " + res.songdata.tel;
    if (res.choose_year == "") {
      var time = res.time
    } else {
      var time = res.choose_year
    }
    wx.request({
      url: 'http://localhost:8080/deliverorder',
      method: "POST",
      header: {
        Authorization: "Bearer " + res.token
      },
      data: {
        sendAddress: sendAddress,
        getAddress: getAddress,
        time: time,
        goods: res.goods[this.data.goodid],
        weight: res.weight[this.data.weightid],
        remarks: res.beizhu,
        baojia: res.baojia
      },
      success(res) {
        console.log(res)
        if(res.data.error==""){
          var ordertype = res.data.deliverserverbyuser
          wx.showModal({
            title: '提示',
            content: '是否立即支付',
            success(res) {
              if (res.confirm) {
                wx.request({
                  url:  app.globalData.url+"/statusone",
                  data:{
                    id:ordertype.ID,
                    type:"deliver"
                  },
                  header: {
                    Authorization: "Bearer " + res.token
                  },
                  success(res){
                    console.log(res)
                  }
                })
                wx.showToast({
                  title: '支付成功',
                  icon: 'none',
                  duration: 2000
                })
                wx.navigateBack({
                  delta: 0,
                })
                wx.showToast({
                  title: '下单成功',
                  icon: 'none',
                  duration: 2000
                })
              } else if (res.cancel) {
                wx.showToast({
                  title: '下单成功',
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


});