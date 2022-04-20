const express = require("express");
const router = express.Router();
const sql = require("../connection.js");
const date = require("date-and-time");

router.get("/:id", async (req, res) => {
	const { id } = req.params;

	// 	const query =
	// 		"select c1.id as id, c1.post_id, c1.user_id, c1.comment as comment, c2.id as reply_id, c2.comment as reply  from comments c1 \
	// join comments c2 on c1.id = c2.parent_id where c1.post_id = $1";
	// const query =
	// 	"select * from comments where parent_id is null and post_id = $1";
	// 	const query = `select
	//   c.id,
	//   c.post_id,
	//   u.id as user_id,
	//   c.comment,
	//   u.firstname || ' ' || u.lastname as full_name,
	//   c.published_date,
	//   c.published_time
	// from
	//   comments c
	//   inner join users u on c.user_id = u.id
	// where
	//   parent_Id is null
	//   and post_id = $1
	// order by
	// 	published_date,
	// 	published_time
	// desc`;

	const query = `
select
  c.id,
  c.post_id,
  u.id as user_id,
  c.comment,
  u.firstname || ' ' || u.lastname as full_name,
  c.published_date,
  c.published_time,
  c.parent_id
from
  comments c
  inner join users u on c.user_id = u.id
where
  post_id = $1
order by
  published_date,
  published_time desc
`;

	try {
		const result = await sql.query(query, [id]);
		res.send(result.rows);
	} catch (error) {
		res.send(error);
	}
});

router.get("/reply/:id", async (req, res) => {
	const { id } = req.params;

	const query = `
select
  c.id,
  c.post_id,
  u.id as user_id,
  c.comment,
  u.firstname || ' ' || u.lastname as full_name
from
  comments c
  inner join users u on c.user_id = u.id
where
  parent_id = $1`;

	try {
		const result = await sql.query(query, [id]);
		res.send(result.rows);
	} catch (error) {
		res.send(error);
	}
});

router.post("/", async (req, res) => {
	const { userId, postId, comment, parentId } = req.body;
	console.log(req.body);
	const now = new Date();
	const comment_date = date.format(now, "YYYY/MM/DD");
	const comment_time = date.format(now, "HH:mm:ss");

	const query = `
	Insert into
  	comments(id,post_id,comment,parent_id,child_id,user_id,published_date,published_time)
	values
	(default, $1, $2, $3,null, $4,$5,$6) returning *`;

	try {
		const result = await sql.query(query, [
			postId,
			comment,
			parentId,
			userId,
			comment_date,
			comment_time,
		]);
		res.send(result.rows);
	} catch (error) {
		res.send(error);
	}
});
module.exports = router;
