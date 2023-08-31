const express = require("express");
const axios = require("axios");
const pool = require("../pool.js");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../auth.js");
const moment = require("moment");
const r = express.Router();

const util = require("util");
const query = util.promisify(pool.query).bind(pool);

r.post("/creatOrder", verifyToken, async (req, res, next) => {
  try {
    const {
      userId,
      stationId,
      cardId,
      status,
      startTime,
      payMethed,
      duration,
    } = req.body;
    const cost = duration;
    const endTime = moment(startTime)
      .add(duration, "minutes")
      .format("YYYY-MM-DD HH:mm:ss");

    // 事务处理
    await query("START TRANSACTION");

    try {
      // 查询当前余额
      const balanceResult = await query(
        "SELECT balance FROM card WHERE user_id = ?",
        [userId]
      );
      const currentBalance = balanceResult[0].balance;

      if (currentBalance < cost) {
        res
          .status(500)
          .json({ code: 500, success: false, msg: "当前余额不足" });
        return;
      }

      // 创建订单
      const orderResult = await query(
        "INSERT INTO orders (user_id, station_id, card_id, status, amount) VALUES (?, ?, ?, ?, ?)",
        [userId, stationId, cardId, status, cost]
      );
      const orderId = orderResult.insertId;

      // 创建支付记录
      await query(
        "INSERT INTO payrecord (order_id, user_id, pay_methed, amount) VALUES (?, ?, ?, ?)",
        [orderId, userId, payMethed, cost]
      );

      // 创建记录
      await query(
        "INSERT INTO record (user_id, station_id, order_id, start_time, end_time, duration, cost) VALUES (?, ?, ?, ?, ?, ?, ?)",
        [userId, stationId, orderId, startTime, endTime, duration, cost]
      );

      // 更新余额
      await query("UPDATE card SET balance = balance - ? WHERE user_id = ?", [
        cost,
        userId,
      ]);

      // 更新充电桩状态
      await query("UPDATE charge SET status = 1 WHERE id = ?", [stationId]);

      // 延迟更新订单状态
      setTimeout(async () => {
        console.log(duration);
        await query(
          "UPDATE orders SET status = 2 WHERE user_id = ? AND id = ?",
          [userId, orderId]
        );
        await query("UPDATE charge SET status = 0 WHERE id = ?", [stationId]);
      }, duration * 60 * 1000);

      // 提交
      await query("COMMIT");
      res.json({ code: 200, success: true, msg: "操作成功" });
    } catch (error) {
      // 回滚
      await query("ROLLBACK");
      res.status(500).json({ code: 500, success: false, msg: "操作失败" });
      throw error;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, success: false, msg: "创建订单失败" });
  }
});

r.put("/updataStatus/:id", verifyToken, async (req, res, next) => {
  try {
    const user_id = req.userId;
    pool.query(
      "UPDATE orders SET  status = 2 WHERE user_id = ?",
      [user_id],
      (err, result) => {
        if (err) {
          next(err);
          return;
        }
        res.status(200).json({ code: 200, success: true, msg: "已停止充电" });
      }
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 500, success: false, msg: "修改失败" });
  }
});
module.exports = r;
