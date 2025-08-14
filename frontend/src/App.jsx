// frontend/src/App.jsx
import PostForm from "./components/PostForm";

function App() {
  return (
    <div style={{ maxWidth: 720, margin: "40px auto", padding: 16 }}>
      <h1>"Posts"</h1>
      <PostForm />
    </div>
  );
}

export default App;
