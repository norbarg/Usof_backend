USE usof_db;

-- Users (idempotent)
INSERT INTO users (login, password_hash, full_name, email, email_verified, role) VALUES
  ('admin', '$2a$10$Qv63E3c4L0Yv9n1a2sX/KehA2aSlj5tF1IxF6e0oZgMyV8U9gqZwy', 'Admin User', 'admin@example.com', 1, 'admin'),
  ('alice', '$2a$10$Qv63E3c4L0Yv9n1a2sX/KehA2aSlj5tF1IxF6e0oZgMyV8U9gqZwy', 'Alice Johnson', 'alice@example.com', 1, 'user'),
  ('bob',   '$2a$10$Qv63E3c4L0Yv9n1a2sX/KehA2aSlj5tF1IxF6e0oZgMyV8U9gqZwy', 'Bob Smith',    'bob@example.com',   1, 'user'),
  ('carol', '$2a$10$Qv63E3c4L0Yv9n1a2sX/KehA2aSlj5tF1IxF6e0oZgMyV8U9gqZwy', 'Carol White',  'carol@example.com', 1, 'user'),
  ('dave',  '$2a$10$Qv63E3c4L0Yv9n1a2sX/KehA2aSlj5tF1IxF6e0oZgMyV8U9gqZwy', 'Dave Lee',     'dave@example.com',  1, 'user')
ON DUPLICATE KEY UPDATE login = VALUES(login);

-- above hash is for password: "password123"

-- Seed categories
INSERT INTO categories (title, description) VALUES
  ('JavaScript', 'Questions about JS'),
  ('Databases',  'SQL, NoSQL and more'),
  ('Node.js',    'Backend with Node'),
  ('CSS',        'Styling and layouts'),
  ('Algorithms', 'CS fundamentals')
ON DUPLICATE KEY UPDATE title = VALUES(title);


-- Seed posts
-- Привяжем фиксированные id, чтобы ссылки дальше совпадали
INSERT IGNORE INTO posts (id, author_id, title, content, status, publish_date)
VALUES
  (1, 2, 'How to debounce input in React?',
     JSON_ARRAY(JSON_OBJECT('type','text','value','I need to debounce search...')), 'active', NOW()),
  (2, 3, 'Optimize MySQL query with JOINs',
     JSON_ARRAY(JSON_OBJECT('type','text','value','Query is too slow...')), 'active', NOW()),
  (3, 4, 'Node.js best practices',
     JSON_ARRAY(JSON_OBJECT('type','text','value','What are must-know patterns?')), 'active', NOW()),
  (4, 5, 'CSS Grid vs Flexbox',
     JSON_ARRAY(JSON_OBJECT('type','text','value','When to use each?')), 'inactive', NOW()),
  (5, 2, 'Binary search edge cases',
     JSON_ARRAY(JSON_OBJECT('type','text','value','Confused about indices')), 'active', NOW());



-- Link posts to categories
INSERT IGNORE INTO post_categories (post_id, category_id) VALUES
  (1, 1), (1, 3),
  (2, 2),
  (3, 3),
  (4, 4),
  (5, 5);


-- Seed comments
INSERT IGNORE INTO comments (id, post_id, author_id, content, publish_date, status) VALUES
  (1, 1, 3, 'Use lodash debounce or custom hook.', NOW(), 'active'),
  (2, 1, 4, 'Also consider useDeferredValue.',     NOW(), 'active'),
  (3, 2, 2, 'Create proper indexes and EXPLAIN.',  NOW(), 'active'),
  (4, 3, 5, 'Check nodebestpractices repo.',       NOW(), 'active'),
  (5, 5, 3, 'Edge case: when low > high.',         NOW(), 'inactive');


-- Seed likes
INSERT IGNORE INTO likes (author_id, post_id, type) VALUES
  (3, 1, 'like'),
  (4, 1, 'like'),
  (5, 1, 'dislike'),
  (2, 2, 'like'),
  (2, 3, 'like');


