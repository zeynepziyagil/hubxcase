const request = require('supertest');
const app = require('./server');
const Author = require('./author');
const Book = require('./book');

describe('API Tests', () => {
  beforeAll(async () => {
    await Author.deleteMany({});
    await Book.deleteMany({});
  });

  afterEach(async () => {
    await Author.deleteMany({});
    await Book.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  describe('POST /author', () => {
    it('should create a new author', async () => {
      const response = await request(app)
        .post('/author')
        .send({
          name: 'John Doe',
          country: 'USA',
          birthdate: '1990-01-01',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const authors = await Author.find({});
      expect(authors.length).toBe(1);
      expect(authors[0].name).toBe('John Doe');
    });

    it('should return 400 if missing required fields', async () => {
      const response = await request(app)
        .post('/author')
        .send({
          name: 'John Doe',
          // Missing country and birthdate
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing required fields');

      const authors = await Author.find({});
      expect(authors.length).toBe(0); // Verify that the author is not saved
    });
  });

  describe('GET /author', () => {
    it('should return all authors', async () => {
      await Author.create({
        name: 'John Doe',
        country: 'USA',
        birthdate: '1990-01-01',
      });

      await Author.create({
        name: 'Jane Smith',
        country: 'Canada',
        birthdate: '1995-02-02',
      });

      const response = await request(app).get('/author');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0].name).toBe('John Doe');
      expect(response.body[1].name).toBe('Jane Smith');
    });

    it('should return an empty array if no authors found', async () => {
      const response = await request(app).get('/author');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('POST /books', () => {
    it('should create a new book', async () => {
      const response = await request(app)
        .post('/books')
        .send({
          title: 'Sample Book',
          author: 'John Doe',
          price: 9.99,
          ISBN: '1234567890',
          language: 'English',
          numberofpages: 100,
          publisher: 'Sample Publisher',
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const books = await Book.find({});
      expect(books.length).toBe(1);
      expect(books[0].title).toBe('Sample Book');
    });

    it('should return 400 if missing required fields', async () => {
      const response = await request(app)
        .post('/books')
        .send({
          title: 'Sample Book',
          author: 'John Doe',
          price: 9.99,
          ISBN: '1234567890',
          // Missing language, numberofpages, and publisher
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing required fields');

      const books = await Book.find({});
      expect(books.length).toBe(0); // Verify that the book is not saved
    });
  });

  describe('GET /books', () => {
    it('should return all books', async () => {
      await Book.create({
        title: 'Sample Book 1',
        author: 'John Doe',
        price: 9.99,
        ISBN: '1234567890',
        language: 'English',
        numberofpages: 100,
        publisher: 'Sample Publisher',
      });

      await Book.create({
        title: 'Sample Book 2',
        author: 'Jane Smith',
        price: 14.99,
        ISBN: '0987654321',
        language: 'French',
        numberofpages: 200,
        publisher: 'Another Publisher',
      });

      const response = await request(app).get('/books');

      expect(response.status).toBe(200);
      expect(response.body.length).toBe(2);
      expect(response.body[0].title).toBe('Sample Book 1');
      expect(response.body[1].title).toBe('Sample Book 2');
    });

    it('should return an empty array if no books found', async () => {
      const response = await request(app).get('/books');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });
  });

  describe('GET /books/:id', () => {
    it('should return a specific book', async () => {
      const book = await Book.create({
        title: 'Sample Book',
        author: 'John Doe',
        price: 9.99,
        ISBN: '1234567890',
        language: 'English',
        numberofpages: 100,
        publisher: 'Sample Publisher',
      });

      const response = await request(app).get(`/books/${book._id}`);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Sample Book');
    });

    it('should return 404 if book ID is invalid', async () => {
      const response = await request(app).get('/books/invalid-id');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Book not found');
    });

    it('should return 404 if book does not exist', async () => {
      const nonExistentId = '60c1a8120cc063482cf4c722';
      const response = await request(app).get(`/books/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Book not found');
    });
  });

  describe('PUT /books/:id', () => {
    it('should update a specific book', async () => {
      const book = await Book.create({
        title: 'Sample Book',
        author: 'John Doe',
        price: 9.99,
        ISBN: '1234567890',
        language: 'English',
        numberofpages: 100,
        publisher: 'Sample Publisher',
      });

      const response = await request(app)
        .put(`/books/${book._id}`)
        .send({ title: 'Updated Book' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const updatedBook = await Book.findById(book._id);
      expect(updatedBook.title).toBe('Updated Book');
    });

    it('should return 404 if book ID is invalid', async () => {
      const response = await request(app).put('/books/invalid-id');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Book not found');
    });

    it('should return 404 if book does not exist', async () => {
      const nonExistentId = '60c1a8120cc063482cf4c722';
      const response = await request(app).put(`/books/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Book not found');
    });

    it('should return 400 if missing required fields', async () => {
      const book = await Book.create({
        title: 'Sample Book',
        author: 'John Doe',
        price: 9.99,
        ISBN: '1234567890',
        language: 'English',
        numberofpages: 100,
        publisher: 'Sample Publisher',
      });

      const response = await request(app)
        .put(`/books/${book._id}`)
        .send({ title: '' }); // Missing required fields

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Missing required fields');

      const updatedBook = await Book.findById(book._id);
      expect(updatedBook.title).toBe('Sample Book'); // Make sure the book is not updated
    });
  });

  describe('DELETE /books/:id', () => {
    it('should delete a specific book', async () => {
      const book = await Book.create({
        title: 'Sample Book',
        author: 'John Doe',
        price: 9.99,
        ISBN: '1234567890',
        language: 'English',
        numberofpages: 100,
        publisher: 'Sample Publisher',
      });

      const response = await request(app).delete(`/books/${book._id}`);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);

      const deletedBook = await Book.findById(book._id);
      expect(deletedBook).toBeNull();
    });

    it('should return 404 if book ID is invalid', async () => {
      const response = await request(app).delete('/books/invalid-id');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Book not found');
    });

    it('should return 404 if book does not exist', async () => {
      const nonExistentId = '60c1a8120cc063482cf4c722';
      const response = await request(app).delete(`/books/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Book not found');
    });
  });
});
