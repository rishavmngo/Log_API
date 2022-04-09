const jwt = require("jsonwebtoken")


function createAccessToken(userId) {

	return jwt.sign({ id: userId }, process.env.USER_PRIVATE_KEY, { expiresIn: '15m' })
}


function createRefreshToken(userId) {

	return jwt.sign({ id: userId }, process.env.USER_PRIVATE_KEY, { expiresIn: '7d' })

}

function sendAccessToken(res, req, accessToken) {

	res.send({
		accessToken,
		username: req.body.username
	})
}

function sendRefreshToken(res, refreshToken) {
	res.cookie('refreshToken', refreshToken, {
		httponly: true,
		path: '/refresh_token'
	})
}



module.exports = {
	createAccessToken,
	createRefreshToken,
	sendAccessToken,
	sendRefreshToken
}
