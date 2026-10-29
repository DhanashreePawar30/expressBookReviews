# Express Book Review API

Course project: Express REST API for book lookup, registration/login, JWT-protected review management, and Axios async/await routes.

## Project layout

```text
expressBookReviews/
└── final_project/
    ├── index.js
    ├── package.json
    ├── README.md
    └── router/
        ├── booksdb.js
        ├── general.js
        └── auth_users.js
```

## Requirements

- Node.js 18 or later
- npm
- Git

## Install and run

From the `final_project` directory:

```bash
npm install
npm start
```

The API listens on `http://localhost:5000`.

## Public routes

```bash
curl -i http://localhost:5000/
curl -i http://localhost:5000/isbn/9780140328721
curl -i http://localhost:5000/author/Roald%20Dahl
curl -i http://localhost:5000/title/Matilda
curl -i http://localhost:5000/review/9780140328721
```

## Register and log in

```bash
curl -i -X POST http://localhost:5000/register \
  -H "Content-Type: application/json" \
  -d '{"username":"student1","password":"pass123"}'
```

```bash
curl -i -c cookies.txt -X POST http://localhost:5000/customer/login \
  -H "Content-Type: application/json" \
  -d '{"username":"student1","password":"pass123"}'
```

The login response contains `accessToken`. Copy it for the following protected requests:

```bash
curl -i -X PUT "http://localhost:5000/customer/auth/review/9780140328721?review=Excellent%20book" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

```bash
curl -i -X DELETE http://localhost:5000/customer/auth/review/9780140328721 \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Axios async/await routes (Tasks 10–13)

```bash
curl -i http://localhost:5000/async/books
curl -i http://localhost:5000/async/isbn/9780140328721
curl -i http://localhost:5000/async/author/Roald%20Dahl
curl -i http://localhost:5000/async/title/Matilda
```

The async routes use Axios to call the read-only `/api/books...` endpoints. The original Task 1–5 routes remain available.

## Notes

- The sample catalogue and users are in memory. Data resets when the server restarts.
- This is a learning project. For production, hash passwords, use a strong secret from environment variables, and use a persistent database and session store.
- For the course assessment, preserve the required file names and push the completed `final_project` folder to your fork of `ibm-developer-skills-network/expressBookReview`.
