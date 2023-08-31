const app = getApp()
const axios = app.$AJAX
Page({
  data: {
    menuList: [],
    wxLogin: {
      code: '',
      userInfo: {
        avatar: "",
        gender: "",
        name: "",
      }
    },
    fromData: {
      mobile: "",
      pwd: "",
    },
  },

  onShow() {
    let user = wx.getStorageSync('USER_INFO')
    this.setData({
      'wxLogin.userInfo': user
    }) 
  },
  onLoad() {
    this.getNav()
  },
  gotuAuther(e) {
    console.log(e.currentTarget.dataset.path)
    if (!e.currentTarget.dataset.path) return;
    wx.navigateTo({
      url: `/pages${e.currentTarget.dataset.path}${e.currentTarget.dataset.path}`,
    })
  },
  getUserInfo() {
    let that = this
    wx.getUserProfile({
      desc: '展示用户信息',
      success: (res) => {
        that.login(res.rawData)
      }
    })
  },
  login(list) {
    let info = JSON.parse(list)
    console.log(info)
    let that = this
    wx.login({
      success(res) {
        if (res.code) {
          that.setData({
            'wxLogin.code': res.code
          })
          that.setData({
            'wxLogin.userInfo.avatar': info.avatarUrl,
            'wxLogin.userInfo.gender': info.gender,
            'wxLogin.userInfo.name': info.nickName,
          })
          axios.getCode(that.data.wxLogin).then((res) => {
            if (res.code == 200) {
              wx.setStorageSync('TOKEN', res.token)
              wx.setStorageSync('USER_INFO', res.user)
              wx.showToast({
                title: res.msg,
                icon: 'none'
              })
              that.getNav()
            } else {
              that.setData({
                'wxLogin.userInfo': []
              })
              wx.showToast({
                title: res.msg,
                icon: 'none'
              })
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
          wx.showToast({
            title: '接口请求失败！',
            icon: 'none'
          })
        }
      }
    })
  },
  // 手机号输入事件
  phoneInput(e) {
    const value = e.detail.value;
    this.setData({
      'fromData.mobile': value
    });
  },

  // 密码输入事件
  pwdInput(e) {
    const value = e.detail.value;
    this.setData({
      'fromData.pwd': value
    });
  },
  getNav() {
    axios.getMenu().then((res) => {
      if (res.code == 200) {
        console.log(res)
        this.setData({
          menuList: res.menu
        })
      } else {
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
      }
    })
  },
  submit() {
    axios.userLogin(this.data.fromData).then((res) => {
      if (res.code == 200) {
        wx.setStorageSync('TOKEN', res.token)
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
  }
})