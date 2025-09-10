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

## Test Accounts

-   Admin: `login=admin`, `password=password123`, email verified.
-   Users: `alice`, `bob`, `carol`, `dave` (same password: `password123`).

## Auth Flow

-   `POST /api/auth/register` → returns `verify_token` (for local dev)
-   `POST /api/auth/confirm-email/:token`
-   `POST /api/auth/login` with `{ login or email, password }` → `{ token }`

Use header `Authorization: Bearer <token>` for protected endpoints.

## Key Endpoints (subset)

-   Users: `GET /api/users` (admin), `GET /api/users/:user_id`, `PATCH /api/users/:user_id`, `PATCH /api/users/avatar`, `DELETE /api/users/:user_id`
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
