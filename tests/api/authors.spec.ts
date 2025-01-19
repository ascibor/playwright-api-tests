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
}); 