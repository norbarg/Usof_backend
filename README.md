# UsOf Backend (API)

Node.js + Express + MySQL API for a Q&A-like forum (StackOverflow-inspired), built with MVC, OOP, SOLID principles and raw SQL.

## Stack

-   Node.js, Express
-   MySQL (mysql2/promise, raw SQL)
-   JWT authentication
-   Multer for file uploads (avatars, post images)

## Quick Start

1. Copy env and install deps
    ```bash
    cp .env.example .env
    npm i
    ```
2. Set your MySQL creds in `.env` and then initialize DB (creates schema and seeds test data)
    ```bash
    npm run db:init
    ```
3. Start dev server
    ```bash
    npm run dev
    ```
4. Health check:
    - GET `http://localhost:3000/api/health` → `{ ok: true }`

## Key Endpoints (subset)

-   Authentication:

`POST /api/auth/register`,

`POST /api/auth/login`,

`POST /api/auth/logout`,

`POST /api/auth/password-reset`,

`POST /api/auth/password-reset/:confirm_token`,

-   Users:

`GET /api/users` (admin),

`GET /api/users/:user_id`,

`POST /api/users` (admin),

`PATCH /api/users/:user_id`,

`PATCH /api/users/avatar`,

`DELETE /api/users/:user_id`

-   Posts: `GET /api/posts?sortBy=likes|date&category_id=&date_from=&date_to=&page=&limit=`, `GET /api/posts/:post_id`,
    `POST /api/posts`, `PATCH /api/posts/:post_id`, `DELETE /api/posts/:post_id`
    `GET /api/posts/:post_id/comments`, `POST /api/posts/:post_id/comments`,
    `GET /api/posts/:post_id/like`, `POST /api/posts/:post_id/like`, `DELETE /api/posts/:post_id/like`
-   Categories: `GET /api/categories`, `GET /api/categories/:category_id`, `GET /api/categories/:category_id/posts`,
    `POST /api/categories` (admin), `PATCH /api/categories/:category_id` (admin), `DELETE /api/categories/:category_id` (admin)
-   Comments: `GET /api/comments/:comment_id`, `PATCH /api/comments/:comment_id`, `DELETE /api/comments/:comment_id`,
    `GET /api/comments/:comment_id/like`, `POST /api/comments/:comment_id/like`, `DELETE /api/comments/:comment_id/like`

## How to check Endpoints

**Authentication module:**

-   `POST - /api/auth/register` - command:

        curl -X POST http://localhost:3000/api/auth/register ^
        -H "Content-Type: application/json" ^
        -d "{\"login\":\"alice3\",\"full_name\":\"Alice Three\",\"email\":\"use_real_gmail@gmail.com\",\"password\":\"password123\",\"password_confirmation\":\"password123\"}"

    answer:

        {"message":"Registered successfully. Check your email to confirm."}

-   `POST - /api/auth/login` - command:

        curl -X POST http://localhost:3000/api/auth/login ^
         -H "Content-Type: application/json" ^
         -d "{\"login\":\"alic3\",\"password\":\"password123\"}"

    answer:

        {"token":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NDQsInJvbGUiOiJ1c2VyIiwibG9naW4iOiJhbGljMyIsImlhdCI6MTc1NzUxMjUyMCwiZXhwIjoxNzU4MTE3MzIwfQ.rPkHmKl0MxBNoO3Tpaxx9SVh3Ea2OO9T6huS_r7KtWc"}

**then to make it easier to enter commands, enter**

      set TOKEN=Bearer <your_token>

-   `POST - /api/auth/logout` - command:

    ```
    curl -X POST http://localhost:3000/api/auth/logout ^
    -H "Authorization: %TOKEN%"
    ```

    answer:

    ```
    {"message":"Logged out (client should discard the token)"}
    ```

-   `POST - /api/auth/password-reset` - command:

    ```
    curl -X POST http://localhost:3000/api/auth/password-reset ^
    -H "Content-Type: application/json" ^
    -d "{\"email\":\"use_real_gmail@gmail.com\"}"
    ```

    answer:

    ```
    {"message":"Password reset token generated","reset_token":"<token>"}
    ```

-   `POST - /api/auth/password-reset/:token` - command:

    ```
    curl -X POST http://localhost:3000/api/auth/password-reset/<reset_token> ^
    -H "Content-Type: application/json" ^
    -d "{\"new_password\":\"newpass123\"}"
    ```

    answer:

    ```
    {"message":"Password updated"}
    ```

    **then you must give yourself admin rol in DB**

        USE usof_db;
        UPDATE users SET role='admin' WHERE login='alic3';

    **and login again and copy the token**

    then go to postman and import the file. Open Variables in the collection:

         *   baseUrl is already http://localhost:3000/api

         *   in token insert raw JWT (without Bearer) from /auth/login

         *   in rand put big number

         *   in createdUserId put big number

         *   For Upload Avatar: in Body → form-data → click on the empty value opposite avatar → select the file image.

    **or you can continue with terminal**

**User module:**

-   `GET - /api/users/:user_id ` - command:

    ```
    curl -X GET http://localhost:3000/api/users/36 ^
    -H "Authorization: %TOKEN%"
    ```

    answer:

    ```
    {"id":36,"login":"alice2","full_name":"Alice Two","email":"alice2@example.com", ...}
    ```

-   `GET - /api/users/:user_id` - command:

    ```
    curl -X GET http://localhost:3000/api/users/36 ^
    -H "Authorization: %TOKEN%"
    ```

    answer:

    ```
    {"id":36,"login":"alice2","full_name":"Alice Two","email":"alice2@example.com", ...}
    ```

-   `POST - /api/users ` - command:

    ```
    curl -X POST http://localhost:3000/api/users ^
    -H "Authorization: %TOKEN%" ^
    -H "Content-Type: application/json" ^
    -d "{\"login\":\"user123\",\"password\":\"password123\",\"password_confirmation\":\"password123\",\"full_name\":\"User 123\",\"email\":\"user123@example.com\",\"role\":\"user\"}"
    ```

    answer:

    ```
    {"id":65,"login":"user123","full_name":"User 123","email":"user123@example.com","role":"user"}
    ```

-   `PATCH - /api/users/:user_id` - command:

    ```
    curl -X PATCH http://localhost:3000/api/users/36 ^
    -H "Authorization: %TOKEN%" ^
    -H "Content-Type: application/json" ^
    -d "{\"full_name\":\"Alice Two Updated\"}"
    ```

    answer:

    ```
    {"id":36,"login":"alice2","full_name":"Alice Two Updated","email":"alice2@example.com", ...}
    ```

-   `PATCH - /api/users/avatar` - command:

    ```
    curl -X PATCH http://localhost:3000/api/users/avatar ^
    -H "Authorization: %TOKEN%" ^
    -F "avatar=@\"C:\Users\My Asus\OneDrive\Рабочий стол\Usof_backend\Frame 24.png\""
    ```

    answer:

    ```
    {"message":"Avatar updated","profile_picture":"/uploads\\avatars\\1757786380181-996550321.png"}
    ```

-   `DELETE - /api/users/:user_id` - command:

    ```
    curl -X DELETE http://localhost:3000/api/users/36 ^
    -H "Authorization: %TOKEN%"
    ```

    answer:

    ```
    {"message":"User deleted"}
    ```

**Post module:**

-   `POST - /api/posts` - command:

    ```
    curl -X POST http://localhost:3000/api/posts ^
      -H "Authorization: %TOKEN%" ^
      -H "Content-Type: application/json" ^
      -d "{\"title\":\"Post\",\"content\":[{\"type\":\"text\",\"text\":\"texttexttext\"},{\"type\":\"image\",\"url\":\"https://picsum.photos/800/400\",\"alt\":\"rand pic\",\"caption\":\"example\"}],\"categories\":[1,2]}"

    ```

    answer:

    ```
    {"id":19,"author_id":59,"title\":\"Post\",\"content\":[{\"type\":\"text\",\"text\":\"texttexttext\"},{\"type\":\"image\",\"url\":\"https://picsum.photos/800/400\",\"alt\":\"rand pic\",\"caption\":\"example\"}],\"categories\":[1,2],"publish_date":"2025-09-13T18:09:26.000Z","status":"active","updated_at":"2025-09-13T18:09:26.000Z"}
    ```

-   `GET - /api/posts` - command:

    ```
    curl -X GET "http://localhost:3000/api/posts"
    ```

    answer:
    all posts

-   `GET - /api/posts/:post_id` - command:

    ```
    curl -X GET http://localhost:3000/api/posts/19
    ```

    answer:

    ```
    {"id":19,"author_id":59,"title":"MY POST","content":[{"text":"HELLO PODR!","type":"text"}],"publish_date":"2025-09-13T18:09:26.000Z","status":"active","updated_at":"2025-09-13T18:09:26.000Z"}
    ```

-   `PATCH - /api/posts/:post_id` - command:

    ```
    curl -X PATCH http://localhost:3000/api/posts/19 ^
      -H "Authorization: %TOKEN%" ^
      -H "Content-Type: application/json" ^
      -d "{\"content\":[{\"type\":\"text\",\"text\":\"New text1\"},{\"type\":\"image\",\"url\":\"/uploads/banner.png\",\"alt\":\"banner\"},{\"type\":\"text\",\"text\":\"New second text\"}]}"

    ```

    ```
      curl -X PATCH http://localhost:3000/api/posts/19^
      -H "Authorization: %TOKEN%" ^
      -H "Content-Type: application/json" ^
      -d "{\"title\":\"New title\",\"content\":[{\"type\":\"text\",\"text\":\"New new new text\"}],\"categories\":[2,3]}"

    ```

    answer: new data in post

-   `PATCH /api/posts/:post_id` (change status and cat, only admin) - command:

    ```
    curl -X PATCH http://localhost:3000/api/posts/19 ^
    -H "Authorization: %TOKEN%" ^
    -H "Content-Type: application/json" ^
    -d "{\"status\":\"inactive\",\"categories\":[2,4]}"
    ```

    answer:

    ```
    {"id":19,"author_id":59,"title":"Обновлённый заголовок","content":[{"text":"Привет, мир!","type":"text"}],"publish_date":"2025-09-13T18:09:26.000Z","status":"inactive","updated_at":"2025-09-13T18:28:05.000Z"}
    ```

-   `GET - /api/posts/:post_id/comments` - command:

    ```
    curl -X GET http://localhost:3000/api/posts/1/comments
    ```

    answer:

    ```
    [{"id":1,"post_id":1,"author_id":3,"content":"Use lodash debounce or custom hook.","publish_date":"2025-09-08T19:10:01.000Z","status":"active"}]
    ```

-   `POST - /api/posts/:post_id/comments` - command:

    ```
    curl -X POST http://localhost:3000/api/posts/19/comments ^
    -H "Authorization: %TOKEN%" ^
    -H "Content-Type: application/json" ^
    -d "{\"content\":\"First comm\"}"
    ```

    answer:

    ```
    {"id":13,"post_id":19,"author_id":59,"content":"First comm","publish_date":"2025-09-13T20:02:50.000Z","status":"active"}
    ```

-   `GET - /api/posts/:post_id/categories`- command:

    ```
    curl -X GET http://localhost:3000/api/posts/19/categories
    ```

    answer:

    ```
    [{"id":2,"title":"Databases","description":"SQL, NoSQL and more"},{"id":4,"title":"CSS","description":"Styling and layouts"}]
    ```

-   `GET - /api/posts/:post_id/like` - command:

    ```
    curl -X GET http://localhost:3000/api/posts/19/like
    ```

    answer:

    ```
    [{"id":38,"author_id":59,"post_id":19,"comment_id":null,"type":"like"}]
    ```

-   `POST - /api/posts/:post_id/like` - command:

    ```
      curl -X POST http://localhost:3000/api/posts/19/like ^
      -H "Authorization: %TOKEN%" ^
      -H "Content-Type: application/json" ^
      -d "{\"type\":\"like\"}"

    ```

    answer:

    ```
    {"message":"Reaction unchanged","post_id":19,"type":"like"}
    ```

-   `DELETE - /api/posts/:post_id` - command:

    ```
    curl -X DELETE http://localhost:3000/api/posts/22 ^
    -H "Authorization: %TOKEN%"
    ```

    answer:

    ```
    {"message":"Post deleted"}
    ```

-   `DELETE - /api/posts/:post_id/like` - command:
    ```
    curl -X DELETE http://localhost:3000/api/posts/19/like ^
    -H "Authorization: %TOKEN%"
    ```
    answer:
    ```
    {"message":"Like removed"}
    ```

## Notes

-   Admin can toggle post/comment status and reassign categories, but **cannot edit post content**.
-   Ordinary users see only **active** posts from others; they can also see their own inactive posts.
-   One like/dislike per user per target (post or comment).
-   Ratings of users are recalculated from likes on their posts and comments.
-   File uploads are stored under `/uploads` and served statically at `/uploads/*`.

## Next Steps / TODO

-   Favorites & Subscriptions endpoints (data models already present)
-   Pagination metadata in list endpoints
-   Swagger/OpenAPI docs
-   Email delivery integration for verification and notifications (currently token is returned in responses for local testing)
