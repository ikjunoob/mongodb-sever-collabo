// backend/routes/postRoutes.js
const express = require("express");
const router = express.Router();
const Post = require("../models/Post");

// CREATE
router.post("/", async (req, res) => {
    try {
        const newPost = new Post(req.body);
        const saved = await newPost.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ message: "작성 실패", error: String(error) });
    }
});

// READ - 전체
router.get("/", async (_req, res) => {
    try {
        const posts = await Post.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: "목록 불러오기 실패", error: String(error) });
    }
});

// READ - 단건
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: "글을 찾을 수 없음" });
        res.status(200).json(post);
    } catch (error) {
        res.status(400).json({ message: "단건 조회 실패", error: String(error) });
    }
});

// UPDATE
router.put("/:id", async (req, res) => {
    try {
        const updated = await Post.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updated) return res.status(404).json({ message: "수정할 글 없음" });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ message: "수정 실패", error: String(error) });
    }
});

// DELETE
router.delete("/:id", async (req, res) => {
    try {
        const deleted = await Post.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "삭제할 글 없음" });
        res.status(200).json({ message: "삭제 완료", post: deleted });
    } catch (error) {
        res.status(400).json({ message: "삭제 실패", error: String(error) });
    }
});

module.exports = router;
