const { Pool } = require("pg");

const pool = new Pool({
	user: process.env.DB_USER,
	host: process.env.DB_HOST,
	database: process.env.DB_DATABASE,
	password: process.env.DB_PASSWORD,
	port: process.env.DB_PORT,
});

(async () => {
	try {
		const result = await pool.query(
			`
			CREATE TABLE public.users (
  id serial NOT NULL,
  username character varying(100) NOT NULL,
  firstname character varying(100) NOT NULL,
  lastname character varying(1000) NULL,
  email character varying(100) NOT NULL,
  password character varying(200) NOT NULL
);
ALTER TABLE
  public.users
ADD
  CONSTRAINT users_pkey PRIMARY KEY (id)
			`
		);
		console.log("users table crated");
	} catch (error) {}
})();

(async () => {
	try {
		const result = await pool.query(
			`
			CREATE TABLE public.posts (
  id serial NOT NULL,
  author_id integer NOT NULL,
  title character varying(200) NOT NULL,
  content character varying(1000) NOT NULL,
  published_timestamp timestamp without time zone NULL
);
ALTER TABLE
  public.posts
ADD
  CONSTRAINT posts_pkey PRIMARY KEY (id)
			`
		);

		console.log("post table crated");
	} catch (error) {}
})();

(async () => {
	try {
		const result = await pool.query(
			`
CREATE TABLE public.post_likes (user_id integer NOT NULL, post_id integer NOT NULL);
ALTER TABLE
  public.post_likes
ADD
  CONSTRAINT post_likes_pkey PRIMARY KEY (post_id)
			`
		);
		console.log("post likes table crated");
	} catch (error) {}
})();

(async () => {
	try {
		const result = await pool.query(
			`
CREATE TABLE public.comments (
  id serial NOT NULL,
  post_id integer NOT NULL,
  comment character varying(1000) NOT NULL,
  parent_id integer NULL,
  child_id integer NULL,
  user_id integer NULL,
  published_date date NULL,
  published_time time without time zone NULL
);
ALTER TABLE
  public.comments
ADD
  CONSTRAINT comments_pkey PRIMARY KEY (id)
			`
		);
		console.log("comments table crated");
	} catch (error) {}
})();

module.exports = pool;
