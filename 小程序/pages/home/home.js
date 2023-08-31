const app = getApp()
const axios = app.$AJAX
let timerId = null;
var dateTimePicker = require('../../utils/timePick.js');
const websocket = require('../../utils/socket.js');



Page({
  /**
   * 页面的初始数据
   */
  data: {
    orderStartTime: "",
    fromData: {
      userId: '',
      stationId: '',
      // cardId: '',
      status: '1',
      payMethed: "0",
      startTime: "",
      endTime: '',
      duration: '',
      cost: ''
    },
    chargeDetail: '',
    id: '',
    status: false,
    deviceNum: '',
    hours: '00',
    minutes: '00',
    seconds: '00',
    isRunning: false,
    time: 0,
    cardList: "",
    dateTimeArray1: null,
    dateTime1: null,
    startYear: null,
    endYear: null,
    orderId: '',
    choseTime: false,
    typeList: [{
      name: '一小时',
      id: '0',
      value: 60,
    }, {
      name: '四小时',
      id: '1',
      value: 240,
    }, {
      name: '六小时',
      id: '2',
      value: 360,
    }, {
      name: '八小时',
      id: '3',
      value: 480,
    }, {
      name: '十二小时',
      id: '4',
      value: 720,
    }, {
      name: '充满自停',
      id: '5',
      value: -1,
    }],
    choseIndex: '',
    chargList: [],
    colorList: [{
      color: 'var(--primary-color)',
      name: '空闲',
      id: '0',
    }, {
      color: 'var(--secondary-color)',
      name: '使用中',
      id: '1',
    }, {
      color: 'var(--error-color)',
      name: '占用中',
      id: '2',
    }, {
      color: 'var(--gray-color)',
      name: '故障维修',
      id: '3',
    }]
  },
  closepup() {
    this.setData({
      choseTime: false
    })
  },
  choseChaz(e) {
    console.log(e.currentTarget.dataset.item)
    if (e.currentTarget.dataset.item.status != 0) return false;
    this.setData({
      'fromData.stationId': e.currentTarget.dataset.item.id,
    })
    if (e.currentTarget.dataset.item.status != 0) return false;
    setTimeout(() => {
      this.setData({
        showList: false,
        chargeDetail: e.currentTarget.dataset.item
      })
    }, 1000);
  },


  chosTime(e) {
    console.log(e.currentTarget.dataset.item)
    this.setData({
      choseIndex: e.currentTarget.dataset.item.id,
      'fromData.duration': e.currentTarget.dataset.item.value,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    websocket.connectWebSocket();
    let that = this;
    that.setData({
      id: wx.getStorageSync('USER_INFO').id
    })
    that.getStatus()
    // 获取完整的年月日 时分秒，以及默认显示的数组

    var obj1 = dateTimePicker.dateTimePicker(that.data.startYear, that.data.endYear);
    // 精确到分的处理，将数组的秒去掉
    //var lastArray = obj1.dateTimeArray.pop();
    //var lastTime = obj1.dateTime.pop();
    that.setData({
      dateTimeArray1: obj1.dateTimeArray,
      dateTime1: obj1.dateTime
    });

    this.getCard()
  },
  // console.log(dateTimePicker.getTime(),dateTimePicker.timeDiffFn())
  // 选择日期时间
  changeDateTime(e) {
    let type = e.currentTarget.dataset.type
    let str = type == 1 ? 'dateTime1' : 'dateTime2'
    this.setData({
      [str]: e.detail.value
    });
  },
  getChargList() {
    this.setData({
      showList: true
    })
    axios.chargList().then((res) => {
      if (res.code == 200) {
        console.log(res.chargList)
        this.setData({
          chargList: res.chargList
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  getRecord(orderId) {
    axios.serchRecord({
      orderId: orderId,
      type:0
    }).then((res) => {
      if (res.code == 200) {
        this.setData({
          recordList: res.recordList,
        })
        if (dateTimePicker.getTime() > res.recordList.end_time) {
          this.resetTimer()
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
  changeDateTimeColumn1(e) {
    var arr = this.data.dateTime1,
      dateArr = this.data.dateTimeArray1;
    arr[e.detail.column] = e.detail.value;
    dateArr[2] = dateTimePicker.getMonthDay(dateArr[0][arr[0]], dateArr[1][arr[1]]);
    this.setData({
      dateTimeArray1: dateArr,
      dateTime1: arr
    });
  },

  getCard() {
    let that = this
    axios.getCardInfo({
      userId: wx.getStorageSync('USER_INFO').id
    }).then((res) => {
      if (res.code == 200) {
        console.log(res)
        that.setData({
          cardList: res.cardList
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
          that.getChargDetail(res.result)
        }, 2000)
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  getStatus() {
    let that = this
    axios.serchStatus({
      id: that.data.id
    }).then((res) => {
      if (res.code == 200) {
        that.setData({
          status: res.charging,
          orderId: res.orderList[0].id,
          orderStartTime: res.startTime,
          time: res.orderList[0].startTime,
        })
        const givenTimeStr = res.orderList[0].startTime;
        const givenTime = Date.parse(givenTimeStr);
        const currentTime = new Date();
        const timeDiffInSeconds = Math.floor((currentTime - givenTime) / 1000);


        that.setData({
          time: timeDiffInSeconds,
        })
        that.startTimer()
        that.getRecord(res.orderList[0].id)
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      } else {
        wx.showToast({
          title: '操作失败',
          icon: 'none'
        })
      }
    })
  },
  getChargDetail(num) {
    let that = this
    that.setData({
      deviceNum: num,
      choseTime: true
    })
    axios.chargDetail({
      'stationId': num
    }).then((res) => {
      if (res.code == 200) {
        that.setData({
          chargeDetail: res.chargDetail[0],
          'fromData.stationId': res.chargDetail[0].id
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  creatorder(num) {
    let that = this
    that.setData({
      deviceNum: num,
      choseTime: false,
      'fromData.startTime': dateTimePicker.getTime(),
    })
    axios.creatOrder(this.data.fromData).then((res) => {
      if (res.code == 200) {
        wx.showToast({
          title: '开始充电，充满自动断电',
          icon: 'none',
          duration: 2000
        })
        that.startTimer()
        that.setData({
          status: true,
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
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
    this.updata()
  },
  updata() {
    let that = this
    axios.updataStatus({
      id: that.data.id
    }).then((res) => {
      if (res.code == 200) {
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
    this.setData({
      'fromData.userId': wx.getStorageSync('USER_INFO').id
    })
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