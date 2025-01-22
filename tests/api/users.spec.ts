import { test, expect } from '@playwright/test';

interface User {
  id: number;
  userName: string;
  password: string;
}

test.describe('Users API', () => {
  test.describe('GET', () => {
    test('users list endpoint', async ({ request }) => {
      await test.step('GET /api/v1/Users - should return list of users', async () => {
        // given
        const response = await request.get('/api/v1/Users');
        const responseBody = await response.json() as User[];

        // then
        expect(response.status()).toBe(200);
        expect(response.headers()['content-type']).toContain('application/json');
        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBeGreaterThan(0);

        // then
        responseBody.forEach((user: User) => {
          expect(user).toHaveProperty('id', expect.any(Number));
          expect(user).toHaveProperty('userName', expect.any(String));
          expect(user).toHaveProperty('password', expect.any(String));
        });
      });
    });

    test('single user endpoint', async ({ request }) => {
      await test.step('GET /api/v1/Users/{id} - should return single user', async () => {
        // given
        const userId = 1;
        const response = await request.get(`/api/v1/Users/${userId}`);
        const responseBody = await response.json() as User;

        // then
        expect(response.status()).toBe(200);
        expect(responseBody.id).toBe(userId);
        expect(responseBody).toHaveProperty('userName');
        expect(responseBody).toHaveProperty('password');
      });

      await test.step('GET /api/v1/Users/{id} - should handle non-existent ID', async () => {
        // given
        const nonExistentId = 999999;

        // when
        const response = await request.get(`/api/v1/Users/${nonExistentId}`);

        // then
        expect(response.status()).toBe(404);
      });
    });
  });

  test.describe('POST', () => {
    test('create user endpoint', async ({ request }) => {
      await test.step('POST /api/v1/Users - should create new user with valid data', async () => {
        // given
        const newUser = {
          id: 0,
          userName: "testuser",
          password: "testpass123"
        };

        // when
        const response = await request.post('/api/v1/Users', {
          data: newUser,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const responseBody = await response.json() as User;

        // then
        expect(response.status()).toBe(200);
        expect(responseBody).toHaveProperty('id', expect.any(Number));
        expect(responseBody.userName).toBe(newUser.userName);
        expect(responseBody.password).toBe(newUser.password);
      });

      await test.step('POST /api/v1/Users - should handle missing required fields', async () => {
        // given
        const invalidUser = {
          id: 0
        };

        // when
        const response = await request.post('/api/v1/Users', {
          data: invalidUser,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const responseBody = await response.json();

        // then
        expect(response.status()).toBe(200);
        expect(responseBody).toHaveProperty('userName', null);
        expect(responseBody).toHaveProperty('password', null);
      });

      await test.step('POST /api/v1/Users - should handle password complexity', async () => {
        // given
        const userWithSimplePassword = {
          id: 0,
          userName: "testuser",
          password: "123"
        };

        // when
        const response = await request.post('/api/v1/Users', {
          data: userWithSimplePassword,
          headers: {
            'Content-Type': 'application/json'
          }
        });

        // then
        expect(response.status()).toBe(200);
      });
    });
  });

  test.describe('PUT', () => {
    test('update user endpoint', async ({ request }) => {
      await test.step('PUT /api/v1/Users/{id} - should update existing user', async () => {
        // given
        const userId = 1;
        const updatedUser = {
          id: userId,
          userName: "updateduser",
          password: "updatedpass123"
        };

        // when
        const response = await request.put(`/api/v1/Users/${userId}`, {
          data: updatedUser,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const responseBody = await response.json() as User;

        // then
        expect(response.status()).toBe(200);
        expect(responseBody.id).toBe(userId);
        expect(responseBody.userName).toBe(updatedUser.userName);
        expect(responseBody.password).toBe(updatedUser.password);
      });
    });
  });

  test.describe('DELETE', () => {
    test('delete user endpoint', async ({ request }) => {
      await test.step('DELETE /api/v1/Users/{id} - should delete existing user', async () => {
        // given
        const userId = 1;

        // when
        const response = await request.delete(`/api/v1/Users/${userId}`);

        // then
        expect(response.status()).toBe(200);
      });

      await test.step('DELETE /api/v1/Users/{id} - should handle invalid ID format', async () => {
        // given
        const invalidId = 'invalid-id';

        // when
        const response = await request.delete(`/api/v1/Users/${invalidId}`);

        // then
        expect(response.status()).toBe(400);
      });
    });
  });
}); 