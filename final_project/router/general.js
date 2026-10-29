const express = require('express');
const axios = require('axios');
const books = require('./booksdb.js');
const { users } = require('./auth_users.js');

const publicUsers = express.Router();
const BASE_URL = process.env.INTERNAL_API_URL || 'http://127.0.0.1:5000';

// Task 1: Get all books.
publicUsers.get('/', (req, res) => {
  return res.status(200).type('json').send(JSON.stringify(books, null, 4));
});

// Task 2: Get a book by ISBN.
publicUsers.get('/isbn/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ error: 'Book not found.' });
  return res.status(200).json(book);
});

// Task 3: Search books by author (case-insensitive partial match).
publicUsers.get('/author/:author', (req, res) => {
  const author = req.params.author.toLowerCase();
  const result = Object.values(books).filter((book) =>
    String(book.author).toLowerCase().includes(author)
  );
  return res.status(200).json(result);
});

// Task 4: Search books by title (case-insensitive partial match).
publicUsers.get('/title/:title', (req, res) => {
  const title = req.params.title.toLowerCase();
  const result = Object.values(books).filter((book) =>
    String(book.title).toLowerCase().includes(title)
  );
  return res.status(200).json(result);
});

// Task 5: Get all reviews for an ISBN.
publicUsers.get('/review/:isbn', (req, res) => {
  const book = books[req.params.isbn];
  if (!book) return res.status(404).json({ error: 'Book not found.' });
  return res.status(200).json(book.reviews || {});
});

// Task 6: Register a user. Passwords are hashed in a production app;
// this coursework example keeps the expected simple in-memory structure.
publicUsers.post('/register', (req, res) => {
  const { username, password } = req.body || {};

  if (typeof username !== 'string' || !username.trim() ||
      typeof password !== 'string' || !password) {
    return res.status(400).json({
      error: 'Both username and password are required.'
    });
  }

  if (users.some((user) => user.username === username.trim())) {
    return res.status(409).json({
      error: 'Username already exists. Please choose another username.'
    });
  }

  users.push({ username: username.trim(), password });
  return res.status(201).json({
    message: 'User successfully registered. You can now log in.'
  });
});

// Tasks 10-13: Axios + async/await versions of the book lookup operations.
// They use separate /async routes so the original Task 1-4 endpoints remain available.
// Axios calls the read-only internal API endpoints defined in index.js.
publicUsers.get('/async/books', async (req, res) => {
  try {
    const response = await axios.get(`${BASE_URL}/api/books`);
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(502).json({ error: 'Unable to retrieve books via Axios.' });
  }
});

publicUsers.get('/async/isbn/:isbn', async (req, res) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/books/isbn/${encodeURIComponent(req.params.isbn)}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    const status = error.response ? error.response.status : 502;
    return res.status(status).json(
      error.response?.data || { error: 'Unable to retrieve book via Axios.' }
    );
  }
});

publicUsers.get('/async/author/:author', async (req, res) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/books/author/${encodeURIComponent(req.params.author)}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(502).json({ error: 'Unable to search author via Axios.' });
  }
});

publicUsers.get('/async/title/:title', async (req, res) => {
  try {
    const response = await axios.get(
      `${BASE_URL}/api/books/title/${encodeURIComponent(req.params.title)}`
    );
    return res.status(200).json(response.data);
  } catch (error) {
    return res.status(502).json({ error: 'Unable to search title via Axios.' });
  }
});

module.exports.general = publicUsers;
