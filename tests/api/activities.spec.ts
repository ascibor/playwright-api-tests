import { test, expect } from '@playwright/test';

interface Activity {
  id: number;
  title: string;
  completed: boolean;
}

test.describe('Activities API', () => {
  test('GET /api/v1/Activities - should return activities list', async ({ request }) => {
    // given - prepare request
    const response = await request.get('/api/v1/Activities');
    const responseBody = await response.json() as Activity[];

    // then - verify response
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    expect(Array.isArray(responseBody)).toBeTruthy();
    expect(responseBody.length).toBeGreaterThan(0);

    // verify schema for each activity
    responseBody.forEach((activity: Activity) => {
      expect(activity).toHaveProperty('id', expect.any(Number));
      expect(activity).toHaveProperty('title', expect.any(String));
      expect(activity).toHaveProperty('completed', expect.any(Boolean));
    });
  });

  test('GET /api/v1/Activities/{id} - should return single activity', async ({ request }) => {
    // given - prepare request
    const activityId = 1;
    const response = await request.get(`/api/v1/Activities/${activityId}`);
    const responseBody = await response.json() as Activity;

    // then - verify response
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');
    expect(responseBody.id).toBe(activityId);
    expect(responseBody).toHaveProperty('title');
    expect(responseBody).toHaveProperty('completed');
  });
}); 