const express = require("express");
const router = express.Router();
const sql = require("../connection.js");

router.post("/:id", async (req, res) => {
	const post_id = req.params.id;
	const query = `
select
  count(*) as like_count
from
  post_likes
where
  post_id = $1;
  `;
	try {
		const result = sql.query(query, [post_id]);
		res.send(result.rows);
	} catch (error) {}
});

router.post("/addPostLikes", async (req, res) => {
	const { user_id, post_id } = req.body;
	const query = `
INSERT
into
post_lies
values($1,$2)`;
	try {
		const result = await sql.query(query, [user_id, post_id]);
		res.send(result);
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
