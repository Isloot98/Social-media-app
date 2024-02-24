export const fetchPosts = async () => {
  try {
    const response = await fetch(
      "https://social-media-app-server-1iwz.onrender.com/get-all-posts"
    );
    const postsData = await response.json();
    return postsData;
  } catch (err) {
    console.log(err);
  }
};

export const fetchPostsByCategory = async (categoryName) => {
  try {
    const response = await fetch(
      `https://social-media-app-server-1iwz.onrender.com/get-posts-by-category/${categoryName}`
    );
    const postsData = await response.json();
    return postsData;
  } catch (err) {
    console.log(err);
  }
};
