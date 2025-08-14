// frontend/src/components/PostForm.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API = import.meta.env.VITE_API_URL;

const PostForm = () => {
    const [posts, setPosts] = useState([]);
    const [form, setForm] = useState({ title: "", content: "", author: "" });
    const [loading, setLoading] = useState(false);

    const fetchPosts = async () => {
        try {
            const res = await axios.get(`${API}/api/posts`);
            const data = Array.isArray(res.data) ? res.data : res.data.posts ?? [];
            setPosts(data);
        } catch (e) {
            console.error("불러오기 실패", e);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const onChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const onSubmit = async (e) => {
        e.preventDefault();
        if (!form.title.trim()) return alert("제목은 필수입니다.");
        setLoading(true);
        try {
            await axios.post(`${API}/api/posts`, form);
            setForm({ title: "", content: "", author: "" });
            fetchPosts();
        } catch (e) {
            console.error("작성 실패", e);
        } finally {
            setLoading(false);
        }
    };

    const onDelete = async (id) => {
        if (!confirm("정말 삭제할까요?")) return;
        try {
            await axios.delete(`${API}/api/posts/${id}`);
            setPosts((prev) => prev.filter((p) => p._id !== id));
        } catch (e) {
            console.error("삭제 실패", e);
        }
    };

    return (
        <div>
            {/* 작성 폼 */}
            <form onSubmit={onSubmit} style={{ display: "grid", gap: 8, marginBottom: 24 }}>
                <input
                    name="title"
                    placeholder="제목"
                    value={form.title}
                    onChange={onChange}
                />
                <input
                    name="author"
                    placeholder="작성자"
                    value={form.author}
                    onChange={onChange}
                />
                <textarea
                    name="content"
                    placeholder="내용"
                    rows={4}
                    value={form.content}
                    onChange={onChange}
                />
                <button type="submit" disabled={loading}>
                    {loading ? "등록 중..." : "등록"}
                </button>
            </form>

            {/* 목록 */}
            <div style={{ display: "grid", gap: 12 }}>
                {posts.map((post) => (
                    <div key={post._id} style={{ padding: 12, border: "1px solid #ddd", borderRadius: 8 }}>
                        <div style={{ fontWeight: 700 }}>{post.title}</div>
                        <div style={{ color: "#666", fontSize: 14 }}>
                            {post.author || "익명"} · {new Date(post.createdAt).toLocaleString()}
                        </div>
                        <div style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{post.content}</div>
                        <div style={{ marginTop: 8 }}>
                            <button onClick={() => onDelete(post._id)}>삭제</button>
                        </div>
                    </div>
                ))}
                {posts.length === 0 && <div>게시글이 없습니다.</div>}
            </div>
        </div>
    );
};

export default PostForm;
