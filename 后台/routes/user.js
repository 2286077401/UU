const express = require("express");
const axios = require("axios");
const pool = require("../pool.js");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../auth.js");
const r = express.Router();
const APP_ID = "wx025d94a908519b4e";
const APP_SECRET = "06b5a05926a8a207948358bf982ccb43";

// areCode  appid wx025d94a908519b4e 秘钥 06b5a05926a8a207948358bf982ccb43
// 公众开发者appid    wxa5da497c2c13a1ae  秘钥 57fe8b675eaf4c1758cee0676373ec40
//微信登录
r.post("/wxlogin", async (req, res, next) => { 
  const { code, userInfo } = req.body;
  if (!code) {
    res.json({ code: 400, success: false, msg: "缺少code参数" });
    return;
  }
  if (!userInfo) {
    res.json({ code: 400, success: false, msg: "缺少userInfo参数" });
    return;
  }
  try {
    const accessTokenUrl = `https://api.weixin.qq.com/sns/jscode2session?appid=${APP_ID}&secret=${APP_SECRET}&js_code=${code}&grant_type=authorization_code`;
    const response = await axios.get(accessTokenUrl); 
    const { session_key, openid } = response.data;
    const { nickName, avatarUrl, gender } = userInfo;
    // Check if the user already exists in the database
    pool.query(
      "SELECT * FROM user WHERE openid = ?",
      [openid],
      (err, result) => {
        if (err) {
          next(err);
          return;
        }

        if (result.length > 0) {
          // User already exists, generate a token and log them in
          const user = result[0];
          const token = jwt.sign({ userId: user.id }, "token", {
            expiresIn: "1h",
          });
          res.json({ code: 200, success: true, msg: "登录成功", token, user });
        } else {
          // User doesn't exist, register them in the database
          const token = jwt.sign({ openid }, "token", { expiresIn: "1h" });
          const insertUserValues = [
            nickName,
            "",
            "",
            avatarUrl,
            openid,
            gender,
          ];
          pool.query(
            "INSERT INTO user (name, pwd, mobile, avatar,openid,gender) VALUES ( ?, ?, ?, ?, ?, ?)",
            insertUserValues,
            (err, result) => {
              if (err) {
                next(err);
                return;
              }
              res.json({
                code: 200,
                success: true,
                msg: "微信登录成功",
                token,
              });
            }
          );
        }
      }
    );
  } catch (error) {
    console.error("微信登录失败:", error);
    res.json({ code: 500, success: false, msg: "微信登录失败" });
  }
});

//用户注册接口
//v1/users/reg
r.post("/reg", (req, res, next) => {
  var obj = req.body;
  if (!obj.name) {
    res.json({ code: 500, success: false, msg: "用户名称不能为空" });
    return;
  }
  if (!obj.pwd) {
    res.json({ code: 500, success: false, msg: "密码不能为空" });
    return;
  }
  if (!obj.mobile) {
    res.json({ code: 500, success: false, msg: "手机号不能为空" });
    return;
  }
  if (!/^1[3-9]\d{9}$/.test(obj.mobile)) {
    res.json({ code: 500, success: false, msg: "手机号码格式错误" });
    return;
  }
  pool.query("insert into user set?", [obj], (err, result) => {
    if (err) {
      next(err);
      return;
    }
    res.json({ code: 200, success: true, msg: "注册成功" });
  });
});
//用户登录
//接口地址：v1/users/login
r.post("/login", (req, res, next) => {
  var obj = req.body;
  if (!obj.mobile) {
    res.json({ code: 500, success: false, msg: "手机号不能为空" });
    return;
  }
  if (!obj.pwd) {
    res.json({ code: 500, success: false, msg: "密码不能为空" });
    return;
  }
  pool.query(
    "select * from user where mobile=? and pwd=?",
    [obj.mobile, obj.pwd],
    (err, result) => {
      if (err) {
        next(err);
        return;
      }
      if (result.length === 0) {
        res.json({ code: 500, success: false, msg: "用户未注册" });
      } else {
        const user = result[0]; 
        const token = jwt.sign({ userId: user.id }, "token", {
          expiresIn: "1h",
        });
        res.json({ code: 200, success: true, msg: "登录成功", token });
      }
    }
  );
});
//查询用户信息
r.get("/info", verifyToken, (req, res, next) => {
  const userId = req.userId;
  pool.query("SELECT * FROM user WHERE id = ?", [userId], (err, result) => {
    if (err) {
      next(err);
      return;
    }
    if (result.length > 0) {
      const user = result[0];
      res.json({ code: 200, success: true, msg: "查询用户信息成功", user });
    } else {
      res.json({ code: 500, success: false, msg: "用户不存在" });
    }
  });
});
// 获取当前用户的 token
r.get("/getToken", verifyToken, (req, res) => {
  const userId = req.userId;
  const token = jwt.sign({ userId: userId }, "token", { expiresIn: "1h" });
  res.json({ code: 200, success: true, msg: "操作成功", token: token });
});
// 退出登录
r.post("/logout", (req, res) => {
  req.headers.authorization = null;
  res.json({ code: "200", success: true, msg: "成功退出登录" });
});
module.exports = r;
