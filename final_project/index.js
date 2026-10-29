const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');

const customerRoutes = require('./router/auth_users.js').authenticated;
const generalRoutes = require('./router/general.js').general;
const books = require('./router/booksdb.js');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_development_secret';

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  '/customer',
  session({
    secret: process.env.SESSION_SECRET || 'fingerprint_customer',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production'
    }
  })
);

// Verify a JWT for protected customer review routes.
// The token may be supplied as a Bearer token or retained in the session.
app.use('/customer/auth/*', (req, res, next) => {
  const header = req.headers.authorization || '';
  const bearerToken = header.startsWith('Bearer ')
    ? header.slice(7)
    : null;
  const sessionToken = req.session.authorization
    ? req.session.authorization.accessToken
    : null;
  const token = bearerToken || sessionToken;

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized. Please log in first.' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid or expired access token.' });
    }

    req.user = { username: decoded.username };
    req.session.authorization = {
      accessToken: token,
      username: decoded.username
    };
    next();
  });
});

// Internal read-only endpoints used by the Axios async/await routes in general.js.
app.get('/api/books', (req, res) => res.json(books));
app.get('/api/books/isbn/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  return book
    ? res.json(book)
    : res.status(404).json({ error: 'Book not found.' });
});
app.get('/api/books/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();
  const result = Object.values(books).filter((book) =>
    String(book.author).toLowerCase().includes(author)
  );
  return res.json(result);
});
app.get('/api/books/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();
  const result = Object.values(books).filter((book) =>
    String(book.title).toLowerCase().includes(title)
  );
  return res.json(result);
});

app.use('/customer', customerRoutes);
app.use('/', generalRoutes);

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, () => {
  console.log(`Book Review API is running at http://localhost:${PORT}`);
});
