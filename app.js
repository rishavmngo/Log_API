const express = require("express");
const cors = require("cors");
require("dotenv").config();

const auth = require("./routes/auth.js");
const post = require("./routes/post.js");
const comment = require("./routes/comment.js");

const PORT = process.env.SERVER_PORT || 3000;
const app = express();
app.use(cors());

//middleware for parsing the body of request
app.use(express.json());

//routes
app.use("/api/auth", auth);
app.use("/api/post", post);
app.use("/api/comment", comment);

//listener
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
