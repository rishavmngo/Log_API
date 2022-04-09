const express = require("express");
const router = express.Router();
const sql = require("../connection.js");

router.get("/", async (req, res) => {
	const query =
		"select author_id, S.id as post_id, u.firstname || ' ' || u.lastname as author_full_name ,s.title, s.content, s.total_comment from users U join (SELECT  posts.title,posts.content,posts.id ,count(comments.comment) as total_comment,posts.author_id  FROM posts LEFT JOIN comments ON posts.id =comments.post_id WHERE comments.parent_id is null group by posts.id) S on U.id = S.author_id";

	try {
		const result = await sql.query(query);
		console.log(result.rows);
		res.send(result.rows);
	} catch (error) {
		res.send(error);
	}
});

router.get("/:postId", async (req, res) => {
	const id = req.params.postId;
	console.log(id);
	const query =
		"SELECT users.id as userId, posts.id as postId, posts.title, posts.content, users.firstname || ' ' || users.lastname as full_name FROM posts INNER JOIN users ON posts.author_id = users.id WHERE posts.id = $1";

	try {
		const result = await sql.query(query, [id]);
		res.send(result.rows[0]);
	} catch (error) {
		res.send(error);
	}
});

router.post("/", async (req, res) => {
	console.log(req.body);
	const { authorId, title, content } = req.body;

	const query = "INSERT INTO posts values(default,$1,$2,$3) returning *";

	try {
		const result = await sql.query(query, [authorId, title, content]);

		res.send(result.rows[0]);
	} catch (error) {
		res.send(error);
	}
});

module.exports = router;
