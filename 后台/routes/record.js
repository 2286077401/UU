const express = require("express");
const axios = require("axios");
const pool = require("../pool.js");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../auth.js");
const r = express.Router();

//查询充电记录
r.get("/serchRecord", verifyToken, async (req, res, next) => {
  try {
    // 从请求中获取用户ID
    const type = req.query.type;
    const time = req.query.time + " 00:00:00";
    if (type == "0") {
      const orderId = req.query.orderId;
      if (!orderId) {
        res.json({ code: 500, success: false, msg: "请求参数有误" });
        return;
      }
      pool.query(
        "SELECT * FROM record WHERE order_id = ?",
        [orderId],
        (err, result) => {
          if (err) {
            next(err);
            return;
          }
          if (result.length > 0) {
            var recordList;
            recordList = result[0];
            res.json({
              code: 200,
              success: true,
              recordList,
            });
          } else {
            res.json({
              code: 200,
              success: false,
              msg: "未查询到订单信息",
            });
          }
        }
      );
    } else {
      const userId = req.query.userId;
      if (!userId) {
        res.json({ code: 500, success: false, msg: "请求参数有误" });
        return;
      }
      pool.query(
        "SELECT id,user_id,station_id,order_id,DATE_FORMAT(start_time,'%Y-%m-%d %H:%i:%s') as startTime,DATE_FORMAT(end_time,'%Y-%m-%d %H:%i:%s') as endTime,duration,status_tytpe,cost FROM record WHERE user_id = ? and start_time >= ?",
        [userId, time],
        (err, result) => {
          if (err) {
            next(err);
            return;
          }
          if (result.length > 0) {
            var recordList;
            recordList = result;
            res.json({
              code: 200,
              success: true,
              recordList,
            });
          } else {
            res.json({
              code: 200,
              success: false,
              recordList: [],
              msg: "未查询到订单信息",
            });
          }
        }
      );
    }
  } catch (error) {
    console.error("Error checking charging status:", error);
    res
      .status(500)
      .json({ code: 500, success: false, msg: "充电状态查询失败" });
  }
});
// r.get("/getRecord", verifyToken, async (req, res, next) => {
//   try {
//     let id = req.query.userId;
//     pool.query(
//       "SELECT * FROM record WHERE user_id = ?",
//       [orderId],
//       (err, result) => {
//         if (err) {
//           next(err);
//           return;
//         }
//         if (result.length > 0) {
//           const recordList = result;
//           res.json({
//             code: 200,
//             success: true,
//             recordList,
//           });
//         } else {
//           res.json({
//             code: 200,
//             success: false,
//             msg: "未查询到充电记录",
//           });
//         }
//       }
//     );
//   } catch (error) {
//     console.error("Error checking charging status:", error);
//     res.status(500).json({ code: 500, success: false, msg: "查询失败" });
//   }
// });
module.exports = r;
