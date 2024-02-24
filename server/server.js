import express from "express";
import cors from "cors";
import pg from "pg";
import dotenv from "dotenv";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

const port = 3000;
const db = new pg.Pool({
  connectionString: process.env.PG_CONNECTION_STRING,
});

app.get("/get-all-posts", async (req, res) => {
  try {
    const result = await db.query(`
      SELECT
        posts.id, posts.username, posts.title, posts.textcontent, posts.media, posts.categoryid, 
        comments.commentid, comments.commentusername, comments.commenttextcontent, comments.commentmedia
      FROM
        posts
      LEFT JOIN comments ON posts.id = comments.postid
    `);

    const postsWithComments = result.rows.reduce((accumulator, row) => {
      const postId = row.id;
      if (!accumulator[postId]) {
        accumulator[postId] = {
          id: postId,
          username: row.username,
          title: row.title,
          textcontent: row.textcontent,
          media: row.media,
          categoryid: row.categoryid,
          comments: [],
        };
      }

      if (row.commentid) {
        accumulator[postId].comments.push({
          commentid: row.commentid,
          commentusername: row.commentusername,
          commenttextcontent: row.commenttextcontent,
          commentmedia: row.commentmedia,
        });
      }

      return accumulator;
    }, {});

    const postsData = Object.values(postsWithComments);
    res.json(postsData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

app.get("/get-posts-by-category/:categoryName", async (req, res) => {
  const { categoryName } = req.params;
  try {
    const result = await db.query(
      `
      SELECT
        posts.id,
        posts.username,
        posts.title,
        posts.textcontent,
        posts.media,
        posts.categoryid,
        comments.commentid,
        comments.commentusername,
        comments.commenttextcontent,
        comments.commentmedia
      FROM
        posts
      LEFT JOIN categories ON posts.categoryid = categories.catid
      LEFT JOIN comments ON posts.id = comments.postid
      WHERE
        categories.categoryname = $1
    `,
      [categoryName]
    );

    const postsWithComments = result.rows.reduce((accumulator, row) => {
      const postId = row.id;
      if (!accumulator[postId]) {
        accumulator[postId] = {
          id: postId,
          username: row.username,
          title: row.title,
          textcontent: row.textcontent,
          media: row.media,
          categoryid: row.categoryid,
          comments: [],
        };
      }

      if (row.commentid) {
        accumulator[postId].comments.push({
          commentid: row.commentid,
          commentusername: row.commentusername,
          commenttextcontent: row.commenttextcontent,
          commentmedia: row.commentmedia,
        });
      }

      return accumulator;
    }, {});

    const postsData = Object.values(postsWithComments);
    res.json(postsData);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

app.get("/get-one-post/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await db.query(`SELECT * FROM posts WHERE id = $1`, [id]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

app.post("/add", async (req, res) => {
  try {
    const result = await db.query(
      `INSERT INTO posts (username, title, textcontent, media, categoryid) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [
        req.body.username,
        req.body.title,
        req.body.textcontent,
        req.body.media,
        req.body.categoryid,
      ]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

app.patch("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const username = req.body.username;
    const title = req.body.title;
    const textcontent = req.body.textcontent;
    const media = req.body.media;
    const categoryid = req.body.categoryid;
    const result = await db.query(
      `UPDATE posts SET (username, title, textcontent, media, categoryidid) = ($1, $2, $3, $4, $5) WHERE id = $6 RETURNING *`,
      [username, title, textcontent, media, categoryid, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

app.delete("/delete", async (req, res) => {
  try {
    const result = await db.query(`DELETE FROM posts WHERE id = $1`, [
      req.body.id,
    ]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

app.get("/search", async (req, res) => {
  const { query } = req.query;
  console.log(query);
  console.log(req);

  try {
    const response = await fetch(
      `https://api.giphy.com/v1/gifs/search?api_key=${
        process.env.GIF_APIKEY
      }&q=${encodeURIComponent(query)}`
    );
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
    const data = await response.json();

    res.json(data.data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/get-all-comments", async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM comments`);
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting data:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

app.post("/add-comment", async (req, res) => {
  try {
    const { commentusername, commenttextcontent, commentmedia, postid } =
      req.body;
    const result = await db.query(
      `INSERT INTO comments (commentusername, commenttextcontent, commentmedia, postid) VALUES ($1, $2, $3, $4) RETURNING *`,
      [commentusername, commenttextcontent, commentmedia, postid]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error inserting data:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

app.patch("/edit-comment/:id", async (req, res) => {
  try {
    const id = req.params.commentid;
    const username = req.body.username;
    const textcontent = req.body.textcontent;
    const media = req.body.media;
    const result = await db.query(
      `UPDATE comments SET (username, textcontent, media) = ($1, $2, $3) WHERE commentid = $4 RETURNING *`,
      [username, textcontent, media, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

app.delete("/delete-comment", async (req, res) => {
  try {
    const result = await db.query(`DELETE FROM comments WHERE commentid = $1`, [
      req.body.commentid,
    ]);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error deleting data:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

app.get("/get-all-categories", async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM categories`);
    res.json(result.rows);
  } catch (error) {
    console.error("Error getting data:", error);
    res.status(500).json({
      error: error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
