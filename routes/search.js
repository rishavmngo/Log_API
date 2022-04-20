const express = require("express");
const router = express.Router();
const sql = require("../connection.js");

router.post("/", async (req, res) => {
	const { search_query } = req.body;
	const searchQuery = search_query.split(" ").join("|");

	const query = `
	    select
	  author_id,
	  S.id as id,
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

	// 	const query = `
	//     select
	//   posts.id,
	//   posts.author_id,
	//   posts.title,
	//   posts.content,
	//   users.firstname || ' ' || users.lastname as author_full_name,
	//   posts.published_timestamp as timestamp,
	//   A.likes_count,
	//   B.comments_count,
	//     case
	//     when C.user_id is not null then true
	//     else false
	//   end as User_liked
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
	//   left join (
	//     select
	//       posts.id,
	//       post_likes.user_id
	//     from
	//       posts
	//       left join post_likes on post_likes.post_id = posts.id
	//     where
	//       user_id = $2
	//     order by
	//       posts.id
	//   ) C on A.post_id = C.id
	// 	where
	//   to_tsvector(
	//     posts.title || ' ' || posts.content || ' ' || users.firstname || ' ' || users.lastname
	//   ) @@ to_tsquery($1)
	//   `;

	try {
		const result = await sql.query(query, [searchQuery]);
		res.send(result.rows);
	} catch (error) {
		res.send(error);
	}
});

module.exports = router;
