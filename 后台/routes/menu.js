const express = require("express");
const axios = require("axios");
const pool = require("../pool.js");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../auth.js");
const r = express.Router();
r.post("/menu", verifyToken, async (req, res,next) => {
  try { 
    const { name, description, parentId, link, icon, sortOrder } = req.body; 
    const query =
      "INSERT INTO menu (name, description, parentId, link, icon, sortOrder) VALUES (?, ?, ?, ?, ?, ?)";
    await pool.query(query, [
      name,
      description,
      parentId,
      link,
      icon,
      sortOrder,
    ]);
    if (err) {
      next(err);
      return;
    }
    res.status(200).json({  code: 200, success: true, msg: "菜单项添加成功" });
  } catch (error) {
    console.error(error);
    res.status(500).json({  code: 200, success: true, msg: "添加菜单项时出错" });
  }
});

r.get("/menu", async (req, res,next) => {
  try {
    pool.query("SELECT * FROM menu", [], (err, result) => {
      if (err) {
        next(err);
        return;
      }
      if (result.length > 0) {
        const menu = result;
        res.json({ code: 200, success: true, msg: "查询息成功", menu });
      } else {
        res.json({ code: 500, success: false, msg: "暂无菜单信息" });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({  code: 500, success: false, msg: "获取菜单出错" });
  }
  //   try {
  //     // 从数据库中获取所有菜单项
  //     const query = "SELECT * FROM menu";
  //     const result = await pool.query(query);
  //     console.log(result);
  //     res.status(200).json(result);
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).json({ message: "获取菜单出错" });
  //   }
});

r.put("/menu/:id", verifyToken, async (req, res,next) => {
  try {
    const { id } = req.params;
    const { name, description, parentId, link, icon, sortOrder } = req.body;
    // 更新数据库中指定ID的菜单项
    const query =
      "UPDATE menu SET name = ?, description = ?, parentId = ?, link = ?, icon = ?, sortOrder = ? WHERE id = ?";
    await pool.query(query, [
      name,
      description,
      parentId,
      link,
      icon,
      sortOrder,
      id,
    ]);
    if (err) {
      next(err);
      return;
    }
    res.status(200).json({ message: "菜单项更新成功" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "修改失败" });
  }
});

r.delete("/menu/:id", verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    // 从数据库中删除指定ID的菜单项
    const query = "DELETE FROM menu WHERE id = ?";
    await pool.query(query, [id]);

    res.status(200).json({ message: "菜单项删除成功" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "删除菜单失败" });
  }
});

module.exports = r;
