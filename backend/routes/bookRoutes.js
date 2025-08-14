// backend/routes/bookRoutes.js
const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

router.post("/", async (req, res) => {
    try {
        const saved = await new Book(req.body).save();
        res.status(201).json(saved);
    } catch (e) {
        res.status(400).json({ message: "책 등록 실패", error: String(e) });
    }
});

router.get("/", async (_req, res) => {
    try {
        const list = await Book.find().sort({ createdAt: -1 });
        res.status(200).json(list);
    } catch (e) {
        res.status(500).json({ message: "책 목록 실패", error: String(e) });
    }
});

module.exports = router;
