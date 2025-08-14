// frontend/src/components/PostForm.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import "./PostForm.css";

const API = import.meta.env.VITE_API_URL;

const PostForm = () => {
    const [posts, setPosts] = useState([]);
    const [form, setForm] = useState({ title: "", content: "", author: "" });
    const [loading, setLoading] = useState(false);

    const fetchPosts = async () => {
        try {
            setLoading(true); // 새로고침에도 로딩 적용
            const res = await axios.get(`${API}/api/posts`, {
                // 캐시 무효화
                headers: { "Cache-Control": "no-cache" },
                params: { t: Date.now() }, // 쿼리스트링으로 강제 새 요청
                validateStatus: (s) => s >= 200 && s < 300 || s === 304,
            });
            const data = Array.isArray(res.data) ? res.data : res.data.posts ?? [];
            setPosts(data);
        } catch (e) {
            console.error("불러오기 실패", e);
        } finally {
            setLoading(false);
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
        <div className="post-wrap">
            <h2>게시글</h2>

            {/* 작성 폼 */}
            <form className="post-controls" onSubmit={onSubmit}>
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
                <div>
                    <button className="btn" type="submit" disabled={loading}>
                        {loading ? "등록 중..." : "등록"}
                    </button>
                    <button
                        className="btn refresh"
                        type="button"
                        onClick={fetchPosts}
                        disabled={loading}
                    >
                        {loading ? "불러오는 중..." : "새로고침"}
                    </button>
                </div>
            </form>

            {/* 목록 */}
            <ul className="post-list">
                {posts.map((post) => (
                    <li key={post._id}>
                        <h3>{post.title}</h3>
                        <small>
                            {post.author || "익명"} ·{" "}
                            {new Date(post.createdAt).toLocaleString()}
                        </small>
                        <p>{post.content}</p>
                        <div>
                            <button className="btn delete" onClick={() => onDelete(post._id)}>
                                삭제
                            </button>
                        </div>
                    </li>
                ))}
                {posts.length === 0 && <li>게시글이 없습니다.</li>}
            </ul>
        </div>
    );
};

export default PostForm;
