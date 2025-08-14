// backend/models/Post.js
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        content: { type: String, default: "" },
        author: { type: String, default: "익명" },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
