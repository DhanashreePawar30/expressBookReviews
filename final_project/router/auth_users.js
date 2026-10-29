const express = require('express');
const jwt = require('jsonwebtoken');
const books = require('./booksdb.js');

const authenticated = express.Router();
const users = [];
const JWT_SECRET = process.env.JWT_SECRET || 'replace_this_development_secret';

const findUser = (username) =>
  users.find((user) => user.username === username);

// Task 7: Login and issue a JWT.
authenticated.post('/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required.' });
  }

  const user = findUser(username);
  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid username or password.' });
  }

  const accessToken = jwt.sign(
    { username: user.username },
    JWT_SECRET,
    { expiresIn: '2h' }
  );

  req.session.authorization = {
    accessToken,
    username: user.username
  };

  return res.status(200).json({
    message: 'Login successful.',
    username: user.username,
    accessToken
  });
});

// Task 8: Add a review or update the logged-in user's existing review.
// Accepts ?review=... or a JSON body { "review": "..." }.
authenticated.put('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) return res.status(404).json({ error: 'Book not found.' });

  const review = req.query.review ?? (req.body && req.body.review);
  if (typeof review !== 'string' || !review.trim()) {
    return res.status(400).json({ error: 'Please provide a review.' });
  }

  if (!book.reviews) book.reviews = {};
  book.reviews[req.user.username] = review.trim();

  return res.status(200).json({
    message: 'Review added or updated successfully.',
    isbn,
    reviews: book.reviews
  });
});

// Task 9: A user may delete only their own review.
authenticated.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book) return res.status(404).json({ error: 'Book not found.' });

  if (!book.reviews || !Object.prototype.hasOwnProperty.call(book.reviews, req.user.username)) {
    return res.status(404).json({ error: 'No review by this user exists for this book.' });
  }

  delete book.reviews[req.user.username];
  return res.status(200).json({
    message: 'Your review was deleted successfully.',
    isbn,
    reviews: book.reviews
  });
});

module.exports.authenticated = authenticated;
module.exports.users = users;
