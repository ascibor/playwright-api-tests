import { test, expect } from '@playwright/test';

interface Author {
  id: number;
  idBook: number;
  firstName: string;
  lastName: string;
}

test.describe('Authors API', () => {
  test.describe('GET', () => {
    test('authors list endpoint', async ({ request }) => {
      await test.step('GET /api/v1/Authors - should return list of authors with correct schema', async () => {
        // given
        const response = await request.get('/api/v1/Authors');
        const responseBody = await response.json() as Author[];

        // then
        expect(response.status()).toBe(200);
        expect(response.headers()['content-type']).toContain('application/json');
        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBeGreaterThan(0);

        // then
        responseBody.forEach((author: Author) => {
          expect(author).toHaveProperty('id', expect.any(Number));
          expect(author).toHaveProperty('idBook', expect.any(Number));
          expect(author).toHaveProperty('firstName', expect.any(String));
          expect(author).toHaveProperty('lastName', expect.any(String));
        });
      });

      await test.step('GET /api/v1/Authors - should handle query parameters correctly', async () => {
        // given
        const response = await request.get('/api/v1/Authors?idBook=1');
        const responseBody = await response.json();

        // then
        expect(response.status()).toBe(200);
        expect(Array.isArray(responseBody)).toBeTruthy();
      });

      await test.step('GET /api/v1/Authors - should handle invalid query parameters gracefully', async () => {
        // given
        const response = await request.get('/api/v1/Authors?invalid=true');
        const responseBody = await response.json();

        // then
        expect(response.status()).toBe(200);
        expect(Array.isArray(responseBody)).toBeTruthy();
      });

      await test.step('GET /api/v1/Authors - should verify performance constraints', async () => {
        // given
        const startTime = Date.now();
        const response = await request.get('/api/v1/Authors');
        const endTime = Date.now();

        // then
        expect(response.status()).toBe(200);
        expect(endTime - startTime).toBeLessThan(2000); // 2 second timeout
      });

      await test.step('GET /api/v1/Authors - should handle special characters in headers', async () => {
        // given
        const response = await request.get('/api/v1/Authors', {
          headers: {
            'Accept-Language': 'en-US',
            'X-Custom-Header': 'Test@123!',
          }
        });

        // then
        expect(response.status()).toBe(200);
        expect(response.headers()['content-type']).toContain('application/json');
      });

      await test.step('GET /api/v1/Authors - should handle concurrent requests', async () => {
        // given
        const requests = Array(3).fill(null).map(() => request.get('/api/v1/Authors'));
        
        // when
        const responses = await Promise.all(requests);

        // then
        responses.forEach(response => {
          expect(response.status()).toBe(200);
        });
      });
    });
  });

  test.describe('POST', () => {
    test('create author endpoint', async ({ request }) => {
      await test.step('POST /api/v1/Authors - should create new author with valid data', async () => {
        // given
        const newAuthor = {
          id: 0,
          idBook: 1,
          firstName: "John",
          lastName: "Doe"
        };

        // when
        const response = await request.post('/api/v1/Authors', {
          data: newAuthor,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const responseBody = await response.json() as Author;

        // then
        expect(response.status()).toBe(200);
        expect(responseBody).toHaveProperty('id', expect.any(Number));
        expect(responseBody.firstName).toBe(newAuthor.firstName);
        expect(responseBody.lastName).toBe(newAuthor.lastName);
        expect(responseBody.idBook).toBe(newAuthor.idBook);
      });

      await test.step('POST /api/v1/Authors - should handle missing required fields', async () => {
        // given
        const invalidAuthor = {
          id: 0,
          idBook: 1
        };

        // when
        const response = await request.post('/api/v1/Authors', {
          data: invalidAuthor,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const responseBody = await response.json();

        // then
        expect(response.status()).toBe(200);
        expect(responseBody).toHaveProperty('firstName', null);
        expect(responseBody).toHaveProperty('lastName', null);
      });

      await test.step('POST /api/v1/Authors - should reject invalid data types', async () => {
        // given
        const invalidAuthor = {
          id: "invalid",
          idBook: "not-a-number",
          firstName: 123,
          lastName: 456
        };

        // when
        const response = await request.post('/api/v1/Authors', {
          data: invalidAuthor,
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
    test('update author endpoint', async ({ request }) => {
      await test.step('PUT /api/v1/Authors/{id} - should update existing author', async () => {
        // given
        const authorId = 1;
        const updatedAuthor = {
          id: authorId,
          idBook: 2,
          firstName: "Jane",
          lastName: "Smith"
        };

        // when
        const response = await request.put(`/api/v1/Authors/${authorId}`, {
          data: updatedAuthor,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const responseBody = await response.json() as Author;

        // then
        expect(response.status()).toBe(200);
        expect(responseBody.id).toBe(authorId);
        expect(responseBody.firstName).toBe(updatedAuthor.firstName);
        expect(responseBody.lastName).toBe(updatedAuthor.lastName);
        expect(responseBody.idBook).toBe(updatedAuthor.idBook);
      });

      await test.step('PUT /api/v1/Authors/{id} - should handle non-existent ID', async () => {
        // given
        const nonExistentId = 999999;
        const updatedAuthor = {
          id: nonExistentId,
          idBook: 2,
          firstName: "Jane",
          lastName: "Smith"
        };

        // when
        const response = await request.put(`/api/v1/Authors/${nonExistentId}`, {
          data: updatedAuthor,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        // then
        expect(response.status()).toBe(200);
      });

      await test.step('PUT /api/v1/Authors/{id} - should handle invalid data types', async () => {
        // given
        const authorId = 1;
        const invalidAuthor = {
          id: "invalid",
          idBook: "not-a-number",
          firstName: 123,
          lastName: 456
        };

        // when
        const response = await request.put(`/api/v1/Authors/${authorId}`, {
          data: invalidAuthor,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        // then
        expect(response.status()).toBe(400);
      });
    });
  });

  test.describe('DELETE', () => {
    test('delete author endpoint', async ({ request }) => {
      await test.step('DELETE /api/v1/Authors/{id} - should delete existing author', async () => {
        // given
        const authorId = 1;

        // when
        const response = await request.delete(`/api/v1/Authors/${authorId}`);

        // then
        expect(response.status()).toBe(200);
      });

      await test.step('DELETE /api/v1/Authors/{id} - should handle non-existent ID', async () => {
        // given
        const nonExistentId = 999999;

        // when
        const response = await request.delete(`/api/v1/Authors/${nonExistentId}`);

        // then
        expect(response.status()).toBe(200);
      });

      await test.step('DELETE /api/v1/Authors/{id} - should handle invalid ID format', async () => {
        // given
        const invalidId = 'invalid-id';

        // when
        const response = await request.delete(`/api/v1/Authors/${invalidId}`);

        // then
        expect(response.status()).toBe(400);
      });
    });
  });
}); 