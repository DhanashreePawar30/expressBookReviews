// Sample in-memory book catalogue. Reviews are intentionally mutable during runtime.
const books = {
  '9780140328721': {
    isbn: '9780140328721',
    title: 'Matilda',
    author: 'Roald Dahl',
    year: '1988',
    reviews: {
      'booklover': 'A funny and imaginative classic.'
    }
  },
  '9780451524935': {
    isbn: '9780451524935',
    title: '1984',
    author: 'George Orwell',
    year: '1949',
    reviews: {
      'reader1': 'Thought-provoking and memorable.'
    }
  },
  '9780743273565': {
    isbn: '9780743273565',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    year: '1925',
    reviews: {}
  },
  '9780061120084': {
    isbn: '9780061120084',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    year: '1960',
    reviews: {}
  },
  '9780747532699': {
    isbn: '9780747532699',
    title: "Harry Potter and the Philosopher's Stone",
    author: 'J. K. Rowling',
    year: '1997',
    reviews: {}
  },
  '9780316769488': {
    isbn: '9780316769488',
    title: 'The Catcher in the Rye',
    author: 'J. D. Salinger',
    year: '1951',
    reviews: {}
  },
  '9780060850524': {
    isbn: '9780060850524',
    title: 'Brave New World',
    author: 'Aldous Huxley',
    year: '1932',
    reviews: {}
  },
  '9781503280786': {
    isbn: '9781503280786',
    title: 'Moby-Dick',
    author: 'Herman Melville',
    year: '1851',
    reviews: {}
  },
  '9780486280615': {
    isbn: '9780486280615',
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    year: '1813',
    reviews: {}
  },
  '9780547928227': {
    isbn: '9780547928227',
    title: 'The Hobbit',
    author: 'J. R. R. Tolkien',
    year: '1937',
    reviews: {}
  }
};

module.exports = books;
