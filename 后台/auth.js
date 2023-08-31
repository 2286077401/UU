const jwt = require('jsonwebtoken');

// 中间件函数，用于校验 token
function verifyToken(req, res, next) {
  const token = req.headers.token; // 从请求头中获取 token
  if (!token) {
    res.status(401).json({ code: 401,success: false, msg: "未登录或登录过期！" });
    return;
  }
  jwt.verify(token, 'token', (err, decoded) => {
    if (err) {
      res.status(401).json({ code: 401,success: false, msg: "登录过期，请重新登录！" });
      return;
    }
    req.userId = decoded.userId; // 将解码后的用户信息存储在请求对象中，以便后续接口使用
    next();
  });
}

module.exports = { verifyToken };
