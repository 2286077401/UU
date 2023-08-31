const express = require("express");
const pool = require("../pool.js");
const r = express.Router();
const { verifyToken } = require("../auth.js");
//获取充值卡信息
r.get("/getCardInfo", verifyToken, (req, res, next) => {
  const userId = req.userId;
  if (!userId) return res.json({ code: 500, succcess: false, msg: "参数缺失" });
  pool.query(
    "SELECT * FROM card WHERE user_id = ?",
    [userId],
    (err, result) => {
      if (err) {
        next();
        return;
      }
      let cardList = result[0];
      res.json({
        code: 200,
        success: true,
        msg: "操作成功",
        cardList,
      });
    }
  );
});

module.exports = r;
