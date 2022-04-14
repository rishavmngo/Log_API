const express = require("express");
const router = express.Router();
const sql = require("../connection.js");

router.get("/feed/:id", async (req, res) => {
	const user_id = req.params.id;
	// 	const query = `
	// select
	//   posts.id,
	//   posts.author_id,
	//   posts.title,
	//   posts.content,
	//   users.firstname || ' ' || users.lastname as author_full_name,
	//   posts.published_timestamp as timestamp,
	//   A.likes_count,
	//   B.comments_count
	// from
	//   (
	//     select
	//       posts.id as post_id,
	//       count(post_likes.post_id) as likes_count
	//     from
	//       posts
	//       left join post_likes on posts.id = post_likes.post_id
	//     group by
	//       posts.id
	//     order by
	//       posts.id
	//   ) A
	//   join (
	//     select
	//       posts.id as post_id,
	//       count(comments.id) as comments_count
	//     from
	//       posts
	//       left join comments on comments.post_id = posts.id
	//     group by
	//       posts.id
	//     order by
	//       posts.id
	//   ) B on A.post_id = B.post_id
	//   inner join posts on A.post_id = posts.id
	//   inner join users on posts.author_id = users.id

	// 	`;

	const query = `
  select
  posts.id,
  posts.author_id,
  posts.title,
  posts.content,
  users.firstname || ' ' || users.lastname as author_full_name,
  posts.published_timestamp as timestamp,
  A.likes_count,
  B.comments_count,
    case
    when C.user_id is not null then 'true'
    else 'false'
  end as User_liked
from
  (
    select
      posts.id as post_id,
      count(post_likes.post_id) as likes_count
    from
      posts
      left join post_likes on posts.id = post_likes.post_id
    group by
      posts.id
    order by
      posts.id
  ) A
  join (
    select
      posts.id as post_id,
      count(comments.id) as comments_count
    from
      posts
      left join comments on comments.post_id = posts.id
    group by
      posts.id
    order by
      posts.id
  ) B on A.post_id = B.post_id
  inner join posts on A.post_id = posts.id
  inner join users on posts.author_id = users.id
  left join (
    select
      posts.id,
      post_likes.user_id
    from
      posts
      left join post_likes on post_likes.post_id = posts.id
    where
      user_id = $1
    order by
      posts.id
  ) C on A.post_id = C.id
  `;
	try {
		const result = await sql.query(query, [user_id]);
		res.send(result.rows);
	} catch (error) {
		res.send(error);
	}
});

router.get("/:postId", async (req, res) => {
	const id = req.params.postId;
	console.log(id);
	// const query =
	// 	"SELECT users.id as userId, posts.id as postId, posts.title, posts.content, users.firstname || ' ' || users.lastname as full_name FROM posts INNER JOIN users ON posts.author_id = users.id WHERE posts.id = $1";

	const query = `
select
  posts.id,
  posts.author_id,
  posts.title,
  posts.content,
  users.firstname || ' ' || users.lastname as author_full_name,
  posts.published_timestamp as timestamp,
  A.likes_count,
  B.comments_count
from
  (
    select
      posts.id as post_id,
      count(post_likes.post_id) as likes_count
    from
      posts
      left join post_likes on posts.id = post_likes.post_id
    group by
      posts.id
    order by
      posts.id
  ) A
  join (
    select
      posts.id as post_id,
      count(comments.id) as comments_count
    from
      posts
      left join comments on comments.post_id = posts.id
    group by
      posts.id
    order by
      posts.id
  ) B on A.post_id = B.post_id
  inner join posts on A.post_id = posts.id
  inner join users on posts.author_id = users.id
  where posts.id = $1
	`;

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
