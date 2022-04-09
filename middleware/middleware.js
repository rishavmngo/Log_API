const jwt = require("jsonwebtoken");

function createAccessToken(user) {
	return jwt.sign(
		{
			id: user.id,
			username: user.username,
			fullname: `${user.firstname} ${user.lastname}`,
		},
		process.env.USER_PRIVATE_KEY
	);
}

function validateToken(req, res, next) {
	const authHeader = req.headers.authorization;

	if (!authHeader) return res.status(401).send("you are not authenticated");

	const token = authHeader.split(" ")[1];
	if (!token)
		return res.status(400).json({ error: "user not authenticated" });

	try {
		const validateToken = jwt.verify(token, process.env.USER_PRIVATE_KEY);
		console.log(validateToken);
		if (validateToken) {
			req.authenticated = true;
			return next();
		}
	} catch (err) {
		console.log("reached");
		return res.status(400).json({ error: err });
	}
}

module.exports = { createAccessToken, validateToken };
