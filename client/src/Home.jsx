import { useState } from "react";
import Posts from "./components/Posts";
import { fetchPosts } from "./components/reusableFunctions";
import CreatePostForm from "./components/CreatePostForm";

function App() {
  const [posts, setPosts] = useState([]);

  const updatePosts = async () => {
    try {
      const response = await fetchPosts();
      setPosts(response);
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    }
  };

  return (
    <div>
      <CreatePostForm updatePosts={updatePosts} />
      <Posts posts={posts} setPosts={setPosts} />
    </div>
  );
}

export default App;
