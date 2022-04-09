> Features

1. user
   1. get all users
   2. register a user
   3. log in user
   4. get a user details by id
   5. delete a user by id
   6. update a user
   7. logout a user
2. post
   1. get all posts of user by id
   2. create a post
   3. delete a post
   4. update a post
3. Comment and likes
   1. comment on post
   2. like a post
   3. like a comment on a post

> GET

| Method |                ROUTE                 | ACTION                     |
| ------ | :----------------------------------: | -------------------------- |
|        |                                      |                            |
|        |                 USER                 |                            |
|        |                                      |                            |
| GET    |            `/api/users/`             | get all users              |
| POST   |         `/api/users/:userId`         | get user by id             |
| POST   |        `/api/users/register`         | register user              |
| POST   |         `/api/users/refresh`         | refresh token              |
| POST   |          `/api/users/login`          | login user                 |
| POST   |         `/api/users/logout`          | logout user                |
| PUT    |         `/api/users/:userId`         | update user                |
| DELETE |         `/api/users/:userId`         | delte user                 |
|        |                                      |                            |
|        |                 POST                 |                            |
|        |                                      |                            |
| GET    |         `/api/posts/:userId`         | get all post               |
| POST   |            `/api/posts/`             | create a post              |
| POST   |         `/api/posts/:postId`         | get a single post          |
| PUT    |         `/api/posts/:postId`         | update a single post       |
| DELETE |         `/api/posts/:postId`         | delte a single post        |
|        |                                      |                            |
|        |          COMMENT AND LIKES           |                            |
|        |                                      |                            |
| GET    |   `/api/response/comment/:postId`    | get all comments on a post |
| GET    |    `/api/response/likes/:postId`     | get all likes on a post    |
| GET    | `/api/response/likes/toggle/:postId` | get all likes on a post    |
