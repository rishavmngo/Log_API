const express = require("express");
const router = express.Router();

const sql = require("../connection.js");
const {
	createAccessToken,
	validateToken,
} = require("../middleware/middleware.js");

//register a user
router.post("/register", async (req, res) => {
	console.log(req.body);
	const { firstName, lastName, userName, email, password } = req.body;

	const query =
		"INSERT INTO users (id, firstName, lastName, userName, email, password) values(default, $1, $2, $3,$4,$5) returning id,firstName,lastName,username,email";

	try {
		const result = await sql.query(query, [
			firstName,
			lastName,
			userName,
			email,
			password,
		]);
		const user = result.rows[0];
		res.json({ message: "Register successful" });
	} catch (err) {
		res.status(409).send({ error: "username already exist" });
		// throw error;
	}
});

router.post("/login", async (req, res) => {
	console.log(req.body);
	const { email, password } = req.body;

	const query = "SELECT * FROM users WHERE email=$1";
	try {
		const result = await sql.query(query, [email]);
		const user = result.rows[0];
		const { password: pass, ...withoutPassword } = user;

		if (user.password !== password)
			return res.status(401).send("password is wrong");

		const token = createAccessToken(user);
		// res.cookie("access-token", token).send({ ...withoutPassword });
		res.send({ token, ...withoutPassword });
	} catch (err) {
		res.status(401).send("Username Doesn't Exist");
	}
});

router.post("/userInfo", async (req, res) => {
	console.log("accessed");
	const { id } = req.body;
	const query = "select * from users where id=$1";
	try {
		const result = await sql.query(query, [id]);
		const { password, ...withoutPassword } = result.rows[0];
		res.send(withoutPassword);
	} catch (error) {
		res.send("error");
	}
});

router.post("/profile", validateToken, (req, res) => {
	res.send(req.authenticated);
});

module.exports = router;
