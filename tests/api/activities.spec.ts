import { test, expect } from '@playwright/test';

interface Activity {
  id: number;
  title: string;
  completed: boolean;
}

test.describe('Activities API', () => {
  test.describe('GET', () => {
    test('activities endpoint', async ({ request }) => {
      await test.step('GET /api/v1/Activities - should return activities list', async () => {
        // given
        const response = await request.get('/api/v1/Activities');
        const responseBody = await response.json() as Activity[];

        // then
        expect(response.status()).toBe(200);
        expect(response.headers()['content-type']).toContain('application/json');
        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBeGreaterThan(0);

        // then
        responseBody.forEach((activity: Activity) => {
          expect(activity).toHaveProperty('id', expect.any(Number));
          expect(activity).toHaveProperty('title', expect.any(String));
          expect(activity).toHaveProperty('completed', expect.any(Boolean));
        });
      });
    });

    test('single activity endpoint', async ({ request }) => {
      await test.step('GET /api/v1/Activities/{id} - should return single activity', async () => {
        // given
        const activityId = 1;
        const response = await request.get(`/api/v1/Activities/${activityId}`);
        const responseBody = await response.json() as Activity;

        // then
        expect(response.status()).toBe(200);
        expect(response.headers()['content-type']).toContain('application/json');
        expect(responseBody.id).toBe(activityId);
        expect(responseBody).toHaveProperty('title');
        expect(responseBody).toHaveProperty('completed');
      });
    });
  });

  test.describe('POST', () => {
    test('create activity endpoint', async ({ request }) => {
      await test.step('POST /api/v1/Activities - should create new activity with valid data', async () => {
        // given
        const newActivity = {
          id: 0,
          title: "New Test Activity",
          completed: false
        };

        // when
        const response = await request.post('/api/v1/Activities', {
          data: newActivity,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const responseBody = await response.json() as Activity;

        // then
        expect(response.status()).toBe(200);
        expect(response.headers()['content-type']).toContain('application/json');
        expect(responseBody).toHaveProperty('id', expect.any(Number));
        expect(responseBody.title).toBe(newActivity.title);
        expect(responseBody.completed).toBe(newActivity.completed);
      });

      await test.step('POST /api/v1/Activities - should handle missing required fields', async () => {
        // given
        const invalidActivity = {
          id: 0,
          completed: false
        };

        // when
        const response = await request.post('/api/v1/Activities', {
          data: invalidActivity,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const responseBody = await response.json();

        // then
        expect(response.status()).toBe(200);
        expect(responseBody).toHaveProperty('title', null);
      });

      await test.step('POST /api/v1/Activities - should reject invalid data types', async () => {
        // given
        const invalidActivity = {
          id: "invalid",
          title: 123,
          completed: "not-boolean"
        };

        // when
        const response = await request.post('/api/v1/Activities', {
          data: invalidActivity,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        // then
        expect(response.status()).toBe(400);
      });

      await test.step('POST /api/v1/Activities - should reject empty request body', async () => {
        // when
        const response = await request.post('/api/v1/Activities', {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        // then
        expect(response.status()).toBe(400);
      });

      await test.step('POST /api/v1/Activities - should handle large payload', async () => {
        // given
        const largeActivity = {
          id: 0,
          title: "A".repeat(1000),
          completed: false
        };

        // when
        const response = await request.post('/api/v1/Activities', {
          data: largeActivity,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const responseBody = await response.json() as Activity;

        // then
        expect(response.status()).toBe(200);
        expect(responseBody.title).toBe(largeActivity.title);
      });
    });
  });
}); 