const express = require("express");
const cors = require("cors");
require("dotenv").config();
const bodyParser = require("body-parser");

const auth = require("./routes/auth.js");
const post = require("./routes/post.js");
const comment = require("./routes/comment.js");
const search = require("./routes/search.js");
const likes = require("./routes/likes.js");
const profile = require("./routes/profile.js");

const PORT = process.env.SERVER_PORT || 3000;
const app = express();
app.use(cors());

//middleware for parsing the body of request
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));

//routes
app.use("/api/auth", auth);
app.use("/api/post", post);
app.use("/api/comment", comment);
app.use("/api/search", search);
app.use("/api/likes", likes);
app.use("/api/profile", profile);

//listener
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
