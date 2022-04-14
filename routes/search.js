const express = require("express");
const router = express.Router();
const sql = require("../connection.js");

router.post("/", async (req, res) => {
	const { search_query } = req.body;
	const searchQuery = search_query.split(" ").join("|");

	const query = `
    select
  author_id,
  S.id as post_id,
  u.firstname || ' ' || u.lastname as author_full_name,
  s.title,
  s.content,
  s.total_comment
from
  users U
  join (
    SELECT
      posts.title,
      posts.content,
      posts.id,
      count(comments.comment) as total_comment,
      posts.author_id
    FROM
      posts
      LEFT JOIN comments ON posts.id = comments.post_id
    WHERE
      comments.parent_id is null
    group by
      posts.id
  ) S on U.id = S.author_id
where
  to_tsvector(
    s.title || ' ' || s.content || ' ' || u.firstname || ' ' || u.lastname
  ) @@ to_tsquery($1)`;

	try {
		const result = await sql.query(query, [searchQuery]);
		console.log("rishav");
		res.send(result.rows);
	} catch (error) {
		res.send(error);
	}
});

module.exports = router;
