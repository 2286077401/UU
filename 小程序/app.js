// app.js
const request = require('./comment/requestApi');
App({
  onLaunch() { 
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    //  wx.checkSession({
    //   success() {
    //     // session_key 未过期，并且在本生命周期一直有效
    //     console.log('session_key 未过期，并且在本生命周期一直有效')
    //   },
    //   fail() { 
    //     // session_key 已经失效，需要重新执行登录流程 
    // this.login() // 重新登录 
    //   }
    // }) 
  },
  globalData: {
    userInfo: null, 
  },
  $AJAX: request,  
})
