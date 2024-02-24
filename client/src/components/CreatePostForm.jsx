import { useState, useEffect } from "react";
import styles from "./CretaPostForm.module.css";

const CreatePostForm = ({ updatePosts }) => {
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [textcontent, setTextcontent] = useState("");
  const [media, setMedia] = useState("");
  const [categoryid, setCategoryid] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const searchForGif = async (mediaInput) => {
    const response = await fetch(
      `https://social-media-app-server-1iwz.onrender.com/search?query=${encodeURIComponent(
        mediaInput
      )}`
    );
    if (response.ok) {
      const data = await response.json();
      setSearchResults(data);
      return data;
    } else {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
  };

  const submitPost = async () => {
    try {
      const response = await fetch(
        `https://social-media-app-server-1iwz.onrender.com/add`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: username,
            title: title,
            textcontent: textcontent,
            media: media,
            categoryid: categoryid,
          }),
        }
      );
      if (response.ok) {
        const commentData = await response.json();
        setUsername("");
        setTitle("");
        setTextcontent("");
        setMedia("");
        setCategoryid("");
        updatePosts();
      }
    } catch (error) {
      console.error("Error submitting comment:", error.message);
    }
  };

  useEffect(() => {
    updatePosts();
  }, []);

  return (
    <div className={styles.formContainer}>
      <h2>Create Post</h2>
      <form className={styles.form}>
        <label htmlFor="username" className={styles.label}>
          Username
        </label>
        <input
          type="text"
          id="username"
          className={styles.input}
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <label htmlFor="title" className={styles.label}>
          Title
        </label>
        <input
          type="text"
          id="title"
          className={styles.input}
          placeholder="Enter title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <label htmlFor="textcontent" className={styles.label}>
          Text Content
        </label>
        <input
          type="text"
          id="textcontent"
          className={styles.input}
          placeholder="Enter text content"
          value={textcontent}
          onChange={(e) => setTextcontent(e.target.value)}
        />
        <label htmlFor="media" className={styles.label}>
          Media
        </label>
        <input
          type="text"
          id="media"
          className={styles.input}
          placeholder="Enter media"
          value={media}
          onChange={(e) => {
            setMedia(e.target.value);
            searchForGif(e.target.value);
          }}
        />

        <label htmlFor="categoryid" className={styles.label}>
          Category
        </label>
        <select
          id="categoryid"
          className={styles.select}
          value={categoryid}
          onChange={(e) => setCategoryid(e.target.value)}
        >
          <option value="">Select a category</option>
          <option value="2">Sports</option>
          <option value="3">Fitness</option>
          <option value="5">Tech</option>
          <option value="1">Gaming</option>
          <option value="4">SoftwareDevelopment</option>
          <option value="6">AnythingElse</option>
        </select>
        <button
          type="button"
          onClick={() => submitPost()}
          className={styles.button}
        >
          Submit
        </button>
        <div className={styles.searchResults}>
          {searchResults.map((result) => (
            <div key={result.id}>
              <img
                src={result.images.original.url}
                alt={result.title}
                onClick={() => {
                  setMedia(result.images.original.url);
                  setSearchResults([]);
                }}
              />
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default CreatePostForm;
