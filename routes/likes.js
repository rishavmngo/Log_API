const express = require("express");

const router = express.Router();

const sql = require("../connection.js");

router.get("/:user_id/:post_id", async (req, res) => {
	const user_id = req.params.user_id;
	const post_id = req.params.post_id;
	console.log(user_id, post_id);
	const query = `
		INSERT
		into
		post_likes
		values($1,$2)`;
	try {
		const result = await sql.query(query, [user_id, post_id]);
		res.send({ message: "liked successfully" });
	} catch (error) {
		console.log(error);
	}
});

router.delete("/:user_id/:post_id", async (req, res) => {
	const user_id = req.params.user_id;
	const post_id = req.params.post_id;
	console.log(user_id, post_id);

	const query = `
DELETE FROM post_likes
where user_id = $1 and post_id = $2`;
	try {
		const result = await sql.query(query, [user_id, post_id]);
		res.send({ message: "unliked successfully" });
	} catch (error) {
		console.log(error);
	}
});

module.exports = router;
