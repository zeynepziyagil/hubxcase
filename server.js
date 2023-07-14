const express = require('express');
const connectDB = require('./db');
const Book = require('./book');
const Author = require('./author');

const app = express();
app.use(express.json());

connectDB();

app.post('/author', async (req, res) => {
  try {
    const { name, country, birthdate } = req.body;
    if (!name || !country || !birthdate) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const author = new Author({ name, country, birthdate });
    await author.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/author', async (req, res) => {
  try {
    const authors = await Author.find();
    res.json(authors);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.post('/books', async (req, res) => {
  try {
    const {
      title,
      author,
      price,
      ISBN,
      language,
      numberofpages,
      publisher,
    } = req.body;
    if (!title || !author || !price || !ISBN || !language || !numberofpages || !publisher) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const book = new Book({
      title,
      author,
      price,
      ISBN,
      language,
      numberofpages,
      publisher,
    });
    await book.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/books', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.put('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

app.delete('/books/:id', async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

const port = 5001;

app.listen(port, () => {
  console.log('API server started on port 5001');
});

module.exports = app;
