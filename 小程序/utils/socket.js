const {
  scoketURL
} = require('../comment/config.js')
let socketOpen = false;
let socketMsgQueue = [];

function connectWebSocket() {
  wx.connectSocket({
    url: scoketURL, // 替换为您的后端 WebSocket URL,
    success: function () {
      console.log('WebSocket :连接 ' + scoketURL + ' socket server');
    },
    fail: function (error) {
      console.log(error)
      console.error('WebSocket ' + scoketURL + ' 连接建立失败:', error);
    }
  });

  wx.onSocketOpen(function () {
    console.log('WebSocket 连接已打开');
    socketOpen = true;
    // 可以在这里发送初始消息给后端
    sendSocketMessage('Hello, server!');
  });

  wx.onSocketMessage(function (res) {
    console.log('收到服务器消息:', res.data);

    // 处理从后端接收到的消息
  });

  wx.onSocketClose(function () {
    console.log('WebSocket 连接已关闭');
    socketOpen = false;

    // 可以在这里处理连接关闭的逻辑
    // 可以在这里重新连接 WebSocket
    connectWebSocket();
  });

  wx.onSocketError(function (error) {
    console.error('WebSocket 错误:', error);

    // 可以在这里处理连接错误的逻辑
  });
}

function sendSocketMessage(message) {
  if (socketOpen) {
    wx.sendSocketMessage({
      data: message
    });
  } else {
    socketMsgQueue.push(message);
  }
}

module.exports = {
  connectWebSocket: connectWebSocket,
  sendSocketMessage: sendSocketMessage
};