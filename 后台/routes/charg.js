const express = require("express");
const axios = require("axios");
const pool = require("../pool.js");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../auth.js");
const r = express.Router();

r.get("/serchStatus", verifyToken, async (req, res, next) => {
  try {
    // 从请求中获取用户ID
    const userId = req.userId;
    if (!userId) {
      res.json({ code: 500, success: false, msg: "请求参数有误" });
      return;
    }
    pool.query(
      "select id,user_id,station_id,card_id,DATE_FORMAT(time,'%Y-%m-%d %H:%i:%s') as startTime,status,amount from orders WHERE user_id = ? AND status = 1",
      // "SELECT * FROM orders WHERE user_id = ? AND status = 1",
      [userId],
      (err, result) => {
        if (err) {
          next(err);
          return;
        }
        if (result.length > 0) {
          const orderList = result;
          res.json({
            code: 200,
            success: true,
            charging: true,
            msg: "当前正在充电",
            orderList,
          });
        } else {
          res.json({
            code: 200,
            success: true,
            charging: false,
            msg: "暂无充电信息",
          });
        }
      }
    );
  } catch (error) {
    console.error("Error checking charging status:", error);
    res
      .status(500)
      .json({ code: 500, success: false, msg: "充电状态查询失败" });
  }
});

r.get("/list", verifyToken, async (req, res, next) => {
  try {
    pool.query("SELECT * FROM charge ", [], (err, result) => {
      if (err) {
        next(err);
        return;
      }

      const chargList = result;
      chargList.forEach((item) => {
        item.station_name = item.station_name.replace("充电桩", "");
      });
      res.json({
        code: 200,
        success: true,
        msg: "操作成功",
        chargList,
      });
    });
  } catch (error) {
    console.error("Error checking charging status:", error);
    res.status(500).json({ code: 500, success: false, msg: "查询失败" });
  }
});
// 545848578545545

r.get("/chargDetail", verifyToken, async (req, res, next) => {
  try {
    
    let id = req.query.stationId; 
    pool.query("SELECT * FROM charge WHERE id = ?", [id], (err, result) => {
      if (err) {
        next(err);
        return;
      } 
      const chargDetail = result;
      chargDetail.forEach((item) => {
        item.station_name = item.station_name.replace("充电桩", "");
      });
      res.json({
        code: 200,
        success: true,
        msg: "操作成功",
        chargDetail,
      });
    });
  } catch (error) {
    console.error("Error checking charging status:", error);
    res.status(500).json({ code: 500, success: false, msg: "查询失败" });
  }
});

module.exports = r;
