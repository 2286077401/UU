const {
  request
} = require('./request.js')
//restful类型接口
module.exports = {
  userLogin: (data) => request('/v1/users/login', data, 'POST'),
  getCode: (data) => request('/v1/users/wxlogin', data, 'POST'),
  getMenu: () => request('/v1/menu', '', 'GET'),
  serchStatus: (data) => request('/v1/charg/serchStatus', data, 'GET'),
  creatOrder: (data) => request('/v1/order/creatOrder', data, 'POST'),
  //查询充电记录表
  serchRecord: (data) => request('/v1/record/serchRecord', data, 'GET'),
  //充电桩列表
  chargList: () => request('/v1/charg/list', 'GET'),
  //充电桩详情
  chargDetail: (data) => request('/v1/charg/chargDetail', data, 'GET'),
  //获取充值卡信息
  getCardInfo: (data) => request('/v1/card/getCardInfo', data, 'GET'),
  updataStatus: (data) => request('/v1/order/updataStatus/' + data.id, '', 'PUT'),
  // GetUsers: (data) => request('/v1/users/reg', {}, 'POST'),
  // PostUsers: (data) => request('/api/identity/users/{id}', data, 'POST'),
  // PutUsers: (data) => request('/api/identity/users/{id}', data, 'PUT'),
  // DeleteUsers: (data) => request('/api/identity/users/{id}', {}, 'DELETE'),
}

//调用示例
// GetUsers(id,{}).then((res)=>{
//   this.setData({
//       list: res.data
//   })
// })
// PostUsers(id,data).then((res)=>{
//   wx.showToast({
//       icon:'none',
//       title: res.Msg,
//   })
// })
// PutUsers(id,data).then((res)=>{
//   wx.showToast({
//       icon:'none',
//       title: res.Msg,
//   })
// })
// DeleteUsers(id,{}).then((res)=>{
//   wx.showToast({
//       icon:'none',
//       title: res.Msg,
//   })
// }) 