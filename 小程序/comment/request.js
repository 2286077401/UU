 const {
   baseUrl
 } = require('./config.js')
 module.exports = {
   request: function (url, data = {}, method) {
     wx.showLoading()
     return new Promise((resolve, reject) => {
       wx.request({
         url: baseUrl + url,
         data,
         method,
         header: {
           'token': wx.getStorageSync('TOKEN')
         },
         success: (res) => {
           wx.hideLoading()
           if (res.statusCode === 200 && res.data.code === 200) {
             resolve(res.data) 
           } else if (res.data.code === 401) {
              wx.clearStorage()
              wx.reLaunch({
                url: '/pages/my/my',
                success: (res) => {},
                fail: (res) => {},
                complete: (res) => {},
              })
           } else {
             wx.showToast({
               icon: 'error',
               title: res.data.msg,
             })
             reject(res.data.msg)
           }
         },
         fail: (err) => {
          wx.hideLoading()
           console.log(err)
           wx.showToast({
             icon: 'error',
             title: '接口无响应',
           })
           reject('接口无响应')
         }
       })
     })
   }
 }