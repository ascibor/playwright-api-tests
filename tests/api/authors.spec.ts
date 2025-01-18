import { test, expect } from '@playwright/test';

interface Author {
  id: number;
  idBook: number;
  firstName: string;
  lastName: string;
}

test.describe('Authors API', () => {
  test('GET /api/v1/Authors - should return list of authors with correct schema', async ({ request }) => {
    // given - prepare request
    const response = await request.get('/api/v1/Authors');
    const responseBody = await response.json() as Author[];

    // then - verify response
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    expect(Array.isArray(responseBody)).toBeTruthy();
    expect(responseBody.length).toBeGreaterThan(0);

    // verify schema for each author
    responseBody.forEach((author: Author) => {
      expect(author).toHaveProperty('id', expect.any(Number));
      expect(author).toHaveProperty('idBook', expect.any(Number));
      expect(author).toHaveProperty('firstName', expect.any(String));
      expect(author).toHaveProperty('lastName', expect.any(String));
    });
  });

  test('GET /api/v1/Authors - should handle query parameters correctly', async ({ request }) => {
    // given - prepare request with query parameters
    const response = await request.get('/api/v1/Authors?idBook=1');
    const responseBody = await response.json();

    // then - verify response
    expect(response.status()).toBe(200);
    expect(Array.isArray(responseBody)).toBeTruthy();
  });

  test('GET /api/v1/Authors - should handle invalid query parameters gracefully', async ({ request }) => {
    // given - prepare request with invalid query
    const response = await request.get('/api/v1/Authors?invalid=true');
    const responseBody = await response.json();

    // then - verify response
    expect(response.status()).toBe(200);
    expect(Array.isArray(responseBody)).toBeTruthy();
  });

  test('GET /api/v1/Authors - should verify performance constraints', async ({ request }) => {
    // given - prepare request with timing
    const startTime = Date.now();
    const response = await request.get('/api/v1/Authors');
    const endTime = Date.now();

    // then - verify response time
    expect(response.status()).toBe(200);
    expect(endTime - startTime).toBeLessThan(2000); // 2 second timeout
  });

  test('GET /api/v1/Authors - should handle special characters in headers', async ({ request }) => {
    // given - prepare request with special headers
    const response = await request.get('/api/v1/Authors', {
      headers: {
        'Accept-Language': 'en-US',
        'X-Custom-Header': 'Test@123!',
      }
    });

    // then - verify response
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
  });

  test('GET /api/v1/Authors - should handle concurrent requests', async ({ request }) => {
    // given - prepare multiple concurrent requests
    const requests = Array(3).fill(null).map(() => request.get('/api/v1/Authors'));
    
    // when - execute requests concurrently
    const responses = await Promise.all(requests);

    // then - verify all responses
    responses.forEach(response => {
      expect(response.status()).toBe(200);
    });
  });
}); 