import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchPosts } from "./reusableFunctions";
import styles from "./Posts.module.css";

const SoftwareDevelopment = () => {
  const { categoryName } = useParams();
  console.log("Category Name:", categoryName);
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [commentContent, setCommentContent] = useState("");
  const [commentmedia, setCommentMedia] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const searchForGif = async (mediaInput) => {
    const response = await fetch(
      `http://localhost:3000/search?query=${encodeURIComponent(mediaInput)}`
    );
    if (response.ok) {
      const data = await response.json();
      setSearchResults(data);
      return data;
    } else {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
  };

  const getPostsByCategory = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/get-posts-by-category/SoftwareDevelopment`
      );
      if (response.ok) {
        const postsData = await response.json();
        setPosts(postsData);
      } else {
        throw new Error("Failed to fetch posts by category");
      }
    } catch (error) {
      console.error("Error fetching posts by category:", error.message);
    }
  };

  useEffect(() => {
    getPostsByCategory();
  }, [categoryName]);
  console.log(posts);

  const submitComment = async (postid) => {
    try {
      const response = await fetch(`http://localhost:3000/add-comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postid: postid,
          commentusername: username,
          commenttextcontent: commentContent,
          commentmedia: commentmedia,
        }),
      });
      if (response.ok) {
        const commentData = await response.json();
        const updatedPosts = await fetchPosts();
        setPosts(updatedPosts);
        setUsername("");
        setCommentContent("");
        setCommentMedia("");
      }
    } catch (error) {
      console.error("Error submitting comment:", error.message);
    }
  };

  return (
    <div className={styles.postsContainer}>
      <h1>SoftwareDevelopment</h1>
      {posts.map((post) => (
        <div key={post.id} className={styles.post}>
          <p>{post.username}</p>
          <h2>{post.title}</h2>
          <p>{post.textcontent}</p>
          <img src={post.media} alt="Post media" className={styles.postMedia} />
          <h1>Comments</h1>
          <div>
            <form className={styles.commentForm}>
              <label htmlFor="commentusername">Username</label>
              <input
                type="text"
                name="commentusername"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <label htmlFor="commenttextcontent">Comment Content</label>
              <input
                type="text"
                name="commenttextcontent"
                placeholder="Comment Content"
                value={commentContent}
                onChange={(e) => setCommentContent(e.target.value)}
              />
              <label htmlFor="commentmedia">Comment Media</label>
              <input
                type="text"
                name="commentmedia"
                placeholder="Comment Media"
                value={commentmedia}
                onChange={(e) => {
                  setCommentMedia(e.target.value);
                  searchForGif(e.target.value);
                }}
              />
              <button
                type="button"
                onClick={() => submitComment(post.id)}
                className={styles.submitButton}
              >
                Submit
              </button>
              <div className={styles.searchResults}>
                {searchResults.map((result) => (
                  <div key={result.id} className={styles.gifResult}>
                    <img
                      src={result.images.original.url}
                      alt={result.title}
                      onClick={() => {
                        setCommentMedia(result.images.original.url);
                        setSearchResults([]);
                      }}
                    />
                  </div>
                ))}
              </div>
            </form>
          </div>

          <div className={styles.commentsContainer}>
            {post.comments &&
              post.comments.map((comment) => (
                <div key={comment.commentid} className={styles.comment}>
                  <p>{comment.commentusername}</p>
                  <p>{comment.commenttextcontent}</p>
                  <img
                    src={comment.commentmedia}
                    alt="Comment media"
                    className={styles.commentMedia}
                  />
                </div>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SoftwareDevelopment;
