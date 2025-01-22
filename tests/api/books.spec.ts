import { test, expect } from '@playwright/test';

interface Book {
  id: number;
  title: string;
  description: string;
  pageCount: number;
  excerpt: string;
  publishDate: string;
}

test.describe('Books API', () => {
  test.describe('GET', () => {
    test('books list endpoint', async ({ request }) => {
      await test.step('GET /api/v1/Books - should return list of books', async () => {
        // given
        const response = await request.get('/api/v1/Books');
        const responseBody = await response.json() as Book[];

        // then
        expect(response.status()).toBe(200);
        expect(response.headers()['content-type']).toContain('application/json');
        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBeGreaterThan(0);

        // then
        responseBody.forEach((book: Book) => {
          expect(book).toHaveProperty('id', expect.any(Number));
          expect(book).toHaveProperty('title', expect.any(String));
          expect(book).toHaveProperty('description', expect.any(String));
          expect(book).toHaveProperty('pageCount', expect.any(Number));
          expect(book).toHaveProperty('excerpt', expect.any(String));
          expect(book).toHaveProperty('publishDate', expect.any(String));
        });
      });
    });

    test('single book endpoint', async ({ request }) => {
      await test.step('GET /api/v1/Books/{id} - should return single book', async () => {
        // given
        const bookId = 1;
        const response = await request.get(`/api/v1/Books/${bookId}`);
        const responseBody = await response.json() as Book;

        // then
        expect(response.status()).toBe(200);
        expect(responseBody.id).toBe(bookId);
        expect(responseBody).toHaveProperty('title');
        expect(responseBody).toHaveProperty('description');
        expect(responseBody).toHaveProperty('pageCount');
        expect(responseBody).toHaveProperty('excerpt');
        expect(responseBody).toHaveProperty('publishDate');
      });
    });
  });

  test.describe('POST', () => {
    test('create book endpoint', async ({ request }) => {
      await test.step('POST /api/v1/Books - should create new book with valid data', async () => {
        // given
        const newBook = {
          id: 0,
          title: "New Test Book",
          description: "Test Description",
          pageCount: 100,
          excerpt: "Test Excerpt",
          publishDate: new Date().toISOString()
        };

        // when
        const response = await request.post('/api/v1/Books', {
          data: newBook,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const responseBody = await response.json() as Book;

        // then
        expect(response.status()).toBe(200);
        expect(responseBody).toHaveProperty('id', expect.any(Number));
        expect(responseBody.title).toBe(newBook.title);
        expect(responseBody.description).toBe(newBook.description);
        expect(responseBody.pageCount).toBe(newBook.pageCount);
      });

      await test.step('POST /api/v1/Books - should handle missing required fields', async () => {
        // given
        const invalidBook = {
          id: 0,
          pageCount: 100
        };

        // when
        const response = await request.post('/api/v1/Books', {
          data: invalidBook,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const responseBody = await response.json();

        // then
        expect(response.status()).toBe(200);
        expect(responseBody).toHaveProperty('title', null);
        expect(responseBody).toHaveProperty('description', null);
      });

      await test.step('POST /api/v1/Books - should reject invalid data types', async () => {
        // given
        const invalidBook = {
          id: "invalid",
          title: 123,
          description: 456,
          pageCount: "not-a-number",
          excerpt: 789,
          publishDate: "invalid-date"
        };

        // when
        const response = await request.post('/api/v1/Books', {
          data: invalidBook,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        // then
        expect(response.status()).toBe(400);
      });
    });
  });

  test.describe('PUT', () => {
    test('update book endpoint', async ({ request }) => {
      await test.step('PUT /api/v1/Books/{id} - should update existing book', async () => {
        // given
        const bookId = 1;
        const updatedBook = {
          id: bookId,
          title: "Updated Book",
          description: "Updated Description",
          pageCount: 200,
          excerpt: "Updated Excerpt",
          publishDate: new Date().toISOString()
        };

        // when
        const response = await request.put(`/api/v1/Books/${bookId}`, {
          data: updatedBook,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const responseBody = await response.json() as Book;

        // then
        expect(response.status()).toBe(200);
        expect(responseBody.id).toBe(bookId);
        expect(responseBody.title).toBe(updatedBook.title);
        expect(responseBody.description).toBe(updatedBook.description);
        expect(responseBody.pageCount).toBe(updatedBook.pageCount);
      });

      await test.step('PUT /api/v1/Books/{id} - should handle non-existent ID', async () => {
        // given
        const nonExistentId = 999999;
        const updatedBook = {
          id: nonExistentId,
          title: "Updated Book",
          description: "Updated Description",
          pageCount: 200,
          excerpt: "Updated Excerpt",
          publishDate: new Date().toISOString()
        };

        // when
        const response = await request.put(`/api/v1/Books/${nonExistentId}`, {
          data: updatedBook,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        // then
        expect(response.status()).toBe(200);
      });
    });
  });

  test.describe('DELETE', () => {
    test('delete book endpoint', async ({ request }) => {
      await test.step('DELETE /api/v1/Books/{id} - should delete existing book', async () => {
        // given
        const bookId = 1;

        // when
        const response = await request.delete(`/api/v1/Books/${bookId}`);

        // then
        expect(response.status()).toBe(200);
      });

      await test.step('DELETE /api/v1/Books/{id} - should handle invalid ID format', async () => {
        // given
        const invalidId = 'invalid-id';

        // when
        const response = await request.delete(`/api/v1/Books/${invalidId}`);

        // then
        expect(response.status()).toBe(400);
      });
    });
  });
}); 