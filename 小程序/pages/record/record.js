const app = getApp()
const axios = app.$AJAX
Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '2023-08-25',
    recordList: '',

  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      date: e.detail.value
    })
    this.getRecord()
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getRecord()
  },
  getRecord() {
    axios.serchRecord({
      userId: wx.getStorageSync('USER_INFO').id,
      type: 1,
      time: this.data.date
    }).then((res) => {
      if (res.code == 200) {
        this.setData({
          recordList: res.recordList,
        })
        if (dateTimePicker.getTime() > res.recordList.end_time) {
         
          // this.setData({
          //   status: false
          // })
        }
        // console.log(dateTimePicker.getTime(),dateTimePicker.getTime() < '2023-08-26 16:16:29')
        // console.log(dateTimePicker.timeDiffFn(res.recordList.end_time, res.recordList.start_time))
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
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