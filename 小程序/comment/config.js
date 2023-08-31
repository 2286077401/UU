const Hosts = {
  mock: 'http://127.0.0.1:8080',
  dev: 'http://127.0.0.1:8888', //开发环境 
  hidden: "https://hidden.qq.com", //预发布环境
  prod: 'https://prod.qq.com', //线上环境
  qa: 'https://qa.qq.com',
  devScoket: 'ws://127.0.0.1:8888'
};
const {
  envVersion
} = wx.getAccountInfoSync().miniProgram;
let baseUrl = "";
let scoketURL = "";
switch (envVersion) {
  case 'develop':
    baseUrl = `${Hosts.dev}`;
    scoketURL = `${Hosts.devScoket}`;
    break;
  case 'trial':
    baseUrl = `${Hosts.hidden}`;
    scoketURL = `${Hosts.devScoket}`;
    break;
  case 'release':
    baseUrl = `${Hosts.prod}`;
    scoketURL = `${Hosts.devScoket}`;
    break;
  default:
    baseUrl = `${Hosts.prod}`;
    scoketURL = `${Hosts.devScoket}`;
    break;
}
export {
  baseUrl,
  scoketURL
}