const app = getApp()
const axios = app.$AJAX
let timerId = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    deviceNum: '',
    status: false,
    socket: "",
    status: false,
    hours: '00',
    minutes: '00',
    seconds: '00',
    isRunning: false,
    time: 0,
  },
  getStatus() {
    let that = this
    axios.serchStatus({
      id: that.data.id
    }).then((res) => {
      if (res.code == 200) {
        that.setData({
          status: res.charging
        })
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  bigScan() {
    let that = this
    wx.scanCode({
      success(res) {
        wx.showLoading({
          title: '设备链接中...'
        })
        setTimeout(() => {
          wx.hideLoading()
          wx.showToast({
            title: '开始充电，充满自动断电',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            deviceNum: res.result,
            status: true
          })
          that.startTimer()
        }, 2000)
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  formatTime(time) {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    const formattedHours = hours < 10 ? '0' + hours : hours;
    const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;
    this.setData({
      hours: formattedHours,
      minutes: formattedMinutes,
      seconds: formattedSeconds
    });
  },

  startTimer() {
    let that = this
    if (that.data.isRunning) {
      return;
    }
    timerId = setInterval(() => {
      that.formatTime(that.data.time + 1);
      that.setData({
        time: that.data.time + 1
      });
    }, 1000);
    that.setData({
      isRunning: true
    });
  },

  stopTimer() {
    clearInterval(timerId);
    this.setData({
      isRunning: false,
      status: false
    });
  },

  resetTimer() {
    let that = this
    wx.showLoading()
    clearInterval(timerId);
    setTimeout(() => {
      wx.hideLoading()
      that.setData({
        hours: '00',
        minutes: '00',
        seconds: '00',
        time: 0,
        isRunning: false,
        status: false
      });
    }, 2000);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.setData({
      id: wx.getStorageSync('USER_INFO').id
    })
    this.getStatus()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})