export const fetchPosts = async () => {
  try {
    const response = await fetch("http://localhost:3000/get-all-posts");
    const postsData = await response.json();
    return postsData;
  } catch (err) {
    console.log(err);
  }
};

export const fetchPostsByCategory = async (categoryName) => {
  try {
    const response = await fetch(
      `http://localhost:3000/get-posts-by-category/${categoryName}`
    );
    const postsData = await response.json();
    return postsData;
  } catch (err) {
    console.log(err);
  }
};
