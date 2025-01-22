import { test, expect } from '@playwright/test';

interface CoverPhoto {
  id: number;
  idBook: number;
  url: string;
}

test.describe('CoverPhotos API', () => {
  test.describe('GET', () => {
    test('cover photos list endpoint', async ({ request }) => {
      await test.step('GET /api/v1/CoverPhotos - should return list of cover photos', async () => {
        // given
        const response = await request.get('/api/v1/CoverPhotos');
        const responseBody = await response.json() as CoverPhoto[];

        // then
        expect(response.status()).toBe(200);
        expect(response.headers()['content-type']).toContain('application/json');
        expect(Array.isArray(responseBody)).toBeTruthy();
        expect(responseBody.length).toBeGreaterThan(0);

        // then
        responseBody.forEach((photo: CoverPhoto) => {
          expect(photo).toHaveProperty('id', expect.any(Number));
          expect(photo).toHaveProperty('idBook', expect.any(Number));
          expect(photo).toHaveProperty('url', expect.any(String));
        });
      });
    });

    test('single cover photo endpoint', async ({ request }) => {
      await test.step('GET /api/v1/CoverPhotos/{id} - should return single cover photo', async () => {
        // given
        const photoId = 1;
        const response = await request.get(`/api/v1/CoverPhotos/${photoId}`);
        const responseBody = await response.json() as CoverPhoto;

        // then
        expect(response.status()).toBe(200);
        expect(responseBody.id).toBe(photoId);
        expect(responseBody).toHaveProperty('idBook');
        expect(responseBody).toHaveProperty('url');
      });
    });
  });

  test.describe('POST', () => {
    test('create cover photo endpoint', async ({ request }) => {
      await test.step('POST /api/v1/CoverPhotos - should create new cover photo with valid data', async () => {
        // given
        const newPhoto = {
          id: 0,
          idBook: 1,
          url: "https://example.com/cover.jpg"
        };

        // when
        const response = await request.post('/api/v1/CoverPhotos', {
          data: newPhoto,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const responseBody = await response.json() as CoverPhoto;

        // then
        expect(response.status()).toBe(200);
        expect(responseBody).toHaveProperty('id', expect.any(Number));
        expect(responseBody.idBook).toBe(newPhoto.idBook);
        expect(responseBody.url).toBe(newPhoto.url);
      });

      await test.step('POST /api/v1/CoverPhotos - should handle invalid URL format', async () => {
        // given
        const invalidPhoto = {
          id: 0,
          idBook: 1,
          url: "invalid-url"
        };

        // when
        const response = await request.post('/api/v1/CoverPhotos', {
          data: invalidPhoto,
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
    test('update cover photo endpoint', async ({ request }) => {
      await test.step('PUT /api/v1/CoverPhotos/{id} - should update existing cover photo', async () => {
        // given
        const photoId = 1;
        const updatedPhoto = {
          id: photoId,
          idBook: 2,
          url: "https://example.com/updated-cover.jpg"
        };

        // when
        const response = await request.put(`/api/v1/CoverPhotos/${photoId}`, {
          data: updatedPhoto,
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const responseBody = await response.json() as CoverPhoto;

        // then
        expect(response.status()).toBe(200);
        expect(responseBody.id).toBe(photoId);
        expect(responseBody.idBook).toBe(updatedPhoto.idBook);
        expect(responseBody.url).toBe(updatedPhoto.url);
      });
    });
  });

  test.describe('DELETE', () => {
    test('delete cover photo endpoint', async ({ request }) => {
      await test.step('DELETE /api/v1/CoverPhotos/{id} - should delete existing cover photo', async () => {
        // given
        const photoId = 1;

        // when
        const response = await request.delete(`/api/v1/CoverPhotos/${photoId}`);

        // then
        expect(response.status()).toBe(200);
      });

      await test.step('DELETE /api/v1/CoverPhotos/{id} - should handle invalid ID format', async () => {
        // given
        const invalidId = 'invalid-id';

        // when
        const response = await request.delete(`/api/v1/CoverPhotos/${invalidId}`);

        // then
        expect(response.status()).toBe(400);
      });
    });
  });
}); 