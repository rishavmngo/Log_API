const express = require("express");
const { route } = require("express/lib/application");
const router = express.Router();
const sql = require("../connection.js");

router.post("/:logged_id", async (req, res) => {
	const logged_id = req.params.logged_id;
	const { username } = req.body;
	console.log(logged_id, username);

	if (logged_id === "null") {
		const query = `
select
  A.id,
  A.username,
  B.email,
  B.bio,
  B.user_full_name as full_name,
  B.followers,
  A.posts
from
  (
    select
      users.id,
      users.username,
      count(posts.id) as posts
    from
      users
      left join posts on users.id = posts.author_id
    where
      username = $1
    group by
      users.id
  ) A
  join (
    select
      users.id,
      users.username,
      users.email,
      users.bio,
      users.firstname || ' ' || users.lastname as user_full_name,
      count(user_followers.user_id) as followers
    from
      users
      left join user_followers on users.id = user_followers.user_id
    where
      username = $1
    group by
      users.id
  ) B on A.username = B.username;
    `;

		try {
			const result = await sql.query(query, [username]);
			console.log(result.rows);
			res.send(result.rows[0]);
		} catch (error) {
			console.log(error);
		}
	} else {
		const query = `
select
  A.id,
  A.username,
  B.user_full_name as full_name,
  B.followers,
  B.email,
  B.bio,
  A.posts,
  B.followed_by
from
  (
    select
      users.id,
      users.username,
      count(posts.id) as posts
    from
      users
      left join posts on users.id = posts.author_id
    where
      username = $1
    group by
      users.id
  ) A
  join (
    select
      users.id,
      users.username,
      users.email,
      users.bio,
      users.firstname || ' ' || users.lastname as user_full_name,
      count(user_followers.user_id) as followers,
      exists (
        select
          *
        from
          user_followers
          join users on users.id = user_followers.user_id
        where
          users.username = $1
          and follower_id = $2
      ) as followed_by
    from
      users
      left join user_followers on users.id = user_followers.user_id
    where
      username = $1
    group by
      users.id
  ) B on A.username = B.username
    `;

		try {
			const result = await sql.query(query, [username, logged_id]);
			console.log(result.rows);
			res.send(result.rows[0]);
		} catch (error) {
			console.log(error);
		}
	}
});

router.post("/follow/:profileId/:followerId", async (req, res) => {
	const profileId = req.params.profileId;
	const followerId = req.params.followerId;
	const username = req.body.username;

	const query = `
  INSERT INTO user_followers values($1,$2,current_timestamp)
  `;

	const query1 = `
select
  A.id,
  A.username,
  B.user_full_name as full_name,
  B.followers,
  B.email,
  B.bio,
  A.posts,
  B.followed_by
from
  (
    select
      users.id,
      users.username,
      count(posts.id) as posts
    from
      users
      left join posts on users.id = posts.author_id
    where
      username = $1
    group by
      users.id
  ) A
  join (
    select
      users.id,
      users.username,
      users.email,
      users.bio,
      users.firstname || ' ' || users.lastname as user_full_name,
      count(user_followers.user_id) as followers,
      exists (
        select
          *
        from
          user_followers
          join users on users.id = user_followers.user_id
        where
          users.username = $1
          and follower_id = $2
      ) as followed_by
    from
      users
      left join user_followers on users.id = user_followers.user_id
    where
      username = $1
    group by
      users.id
  ) B on A.username = B.username
    `;
	try {
		let result = await sql.query(query, [profileId, followerId]);
		result = await sql.query(query1, [username, followerId]);
		res.send(result.rows[0]);
	} catch (error) {
		res.send(error);
	}
});

router.post("/unfollow/:profileId/:followerId", async (req, res) => {
	const profileId = req.params.profileId;
	const followerId = req.params.followerId;

	const username = req.body.username;

	const query = `
  DELETE FROM user_followers WHERE user_id = $1 and follower_id = $2`;

	const query1 = `
select
  A.id,
  A.username,
  B.user_full_name as full_name,
  B.followers,
  B.email,
  B.bio,
  A.posts,
  B.followed_by
from
  (
    select
      users.id,
      users.username,
      count(posts.id) as posts
    from
      users
      left join posts on users.id = posts.author_id
    where
      username = $1
    group by
      users.id
  ) A
  join (
    select
      users.id,
      users.email,
      users.username,
      users.bio,
      users.firstname || ' ' || users.lastname as user_full_name,
      count(user_followers.user_id) as followers,
      exists (
        select
          *
        from
          user_followers
          join users on users.id = user_followers.user_id
        where
          users.username = $1
          and follower_id = $2
      ) as followed_by
    from
      users
      left join user_followers on users.id = user_followers.user_id
    where
      username = $1
    group by
      users.id
  ) B on A.username = B.username
    `;

	try {
		let result = await sql.query(query, [profileId, followerId]);
		result = await sql.query(query1, [username, followerId]);
		res.send(result.rows[0]);
	} catch (error) {
		res.send(error);
	}
});

router.post("/posts/:loggedId", async (req, res) => {
	const logged_id = req.params.loggedId;
	const { username } = req.body;

	const query = `
  select
	K.id,
 	K.author_id,
    users.username,
    K.title,
    k.content,
    k.user_liked,
    k.author_full_name,
    k.likes_count,
    k.comments_count,
    X.count as followers_count,
    K.timestamp
  from 
  (select
  posts.id,
  posts.author_id,
  posts.title,
  posts.content,
  users.username,
  users.firstname || ' ' || users.lastname as author_full_name,
  posts.published_timestamp as timestamp,
  A.likes_count,
  B.comments_count,
    case
    when C.user_id is not null then true
    else false
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
  ) C on A.post_id = C.id) K
  
  join users on users.id = K.author_id
  join (select users.id,users.username,count(user_id) from users join user_followers on users.id = user_followers.follower_id
group by users.id) X
on users.id = X.id
 where users.username = $2

  `;

	try {
		const result = await sql.query(query, [logged_id, username]);
		res.send(result.rows);
	} catch (error) {
		console.log(error);
	}
});

router.post("/followers_list/:loggedId", async (req, res) => {
	const logged_id = req.params.loggedId;
	const { username } = req.body;

	if (logged_id !== "null") {
		const query = `
  select X.card_user_id,X.card_full_name,X.card_username,X.card_bio,X.id,X.profile_username,X.followed_on,Y.followed from (select
  user_followers.user_id as card_user_id,
  card_user.firstname || ' ' || card_user.lastname as card_full_name,
  card_user.username as card_username,
  card_user.bio as card_bio,
  profile_user.id,
  profile_user.username as profile_username,
  user_followers.followed_on
from
  user_followers
  join users profile_user on profile_user.id = user_followers.follower_id
  join users card_user on user_followers.user_id = card_user.id
where
  profile_user.username = $1)
              X join
(
select A.id, case when K.followed = true then true else false end as followed from users A left join 
(select user_id, followed from (select *, case when follower_id = $2 then true else false end as followed
from user_followers) B 
where B.followed = true) K on A.id = K.user_id
order by id) Y on X.card_user_id = Y.id
  `;
		try {
			const result = await sql.query(query, [username, logged_id]);
			res.send(result.rows);
		} catch (error) {
			res.send(error);
		}
	} else {
		const query = `
    select
  user_followers.user_id as card_user_id,
  card_user.firstname || ' ' || card_user.lastname as card_full_name,
  card_user.username as card_username,
  card_user.bio as card_bio,
  profile_user.id,
  profile_user.username as profile_username,
  user_followers.followed_on
from
  user_followers
  join users profile_user on profile_user.id = user_followers.follower_id
  join users card_user on user_followers.user_id = card_user.id
where
  profile_user.username = $1 
    `;

		try {
			const result = await sql.query(query, [username]);
			res.send(result.rows);
		} catch (error) {
			res.send(error);
		}
	}
});
module.exports = router;
