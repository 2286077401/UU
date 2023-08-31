const express = require("express");
const userRouter = require("./routes/user.js");
const menuRouter = require("./routes/menu.js");
const chargRouter = require("./routes/charg.js");
const orderRouter = require("./routes/order.js");
const recordRouter = require("./routes/record.js");
const cardRouter = require("./routes/card.js");
const WebSocket = require("ws");
const app = express();
const port = 8888;
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorization");
  next();
});
//socket
const wss = new WebSocket.Server({ noServer: true });
wss.on("connection", (ws) => {
  console.log("新的 WebSocket 连接已建立");
  ws.on("message", (message) => {
    console.log("接收到消息:", message);
    // 发送消息给客户端
    ws.send("服务器收到了您的消息：" + message);
  });
  ws.on("close", () => {
    console.log("WebSocket 连接已关闭");
  });
});
const server = app.listen(port, () => {
  console.log(`服务器正在运行于端口 ${port}`);
});
server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use("/v1/users", userRouter);
app.use("/v1/", menuRouter);
app.use("/v1/charg", chargRouter);
app.use("/v1/order", orderRouter);
app.use("/v1/record", recordRouter);
app.use("/v1/card", cardRouter);
app.use((err, req, res, next) => {
  console.log(err);
  res.json({ code: 500, msg: "服务器端错误" });
});
