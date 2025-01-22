# Playwright API Tests

This project contains automated API tests for the Fake REST API (https://fakerestapi.azurewebsites.net/) using Playwright.

## Features

- Modern TypeScript syntax
- Gherkin-style test descriptions (Given/When/Then)
- Comprehensive test coverage for all endpoints
- Performance testing
- Concurrent request handling
- Type safety with interfaces

## Project Structure

```
tests/
  └── api/
      ├── activities.spec.ts  # Tests for /api/v1/Activities endpoint
      ├── authors.spec.ts     # Tests for /api/v1/Authors endpoint
      ├── books.spec.ts       # Tests for /api/v1/Books endpoint
      ├── cover-photos.spec.ts # Tests for /api/v1/CoverPhotos endpoint
      └── users.spec.ts       # Tests for /api/v1/Users endpoint
```

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run all tests:
```bash
npx playwright test
```

3. Run tests with line reporter:
```bash
npx playwright test --reporter=line
```

4. Run tests for specific endpoint:
```bash
npx playwright test tests/api/authors.spec.ts     # Run only Authors tests
npx playwright test tests/api/activities.spec.ts  # Run only Activities tests
npx playwright test tests/api/books.spec.ts       # Run only Books tests
npx playwright test tests/api/cover-photos.spec.ts # Run only CoverPhotos tests
npx playwright test tests/api/users.spec.ts       # Run only Users tests
```

## Test Coverage

### Activities API
- GET /api/v1/Activities
  - List all activities
  - Schema validation
- GET /api/v1/Activities/{id}
  - Get single activity
- POST /api/v1/Activities
  - Create new activity
  - Handle missing fields
  - Handle invalid data types
  - Handle empty body
  - Handle large payloads
- PUT /api/v1/Activities/{id}
  - Update existing activity
  - Handle non-existent ID
  - Handle invalid data types
- DELETE /api/v1/Activities/{id}
  - Delete existing activity
  - Handle non-existent ID
  - Handle invalid ID format

### Authors API
- GET /api/v1/Authors
  - List all authors
  - Schema validation
  - Query parameter handling
  - Performance constraints
  - Special characters in headers
  - Concurrent requests
- GET /api/v1/Authors/{id}
  - Get single author
- POST /api/v1/Authors
  - Create new author
  - Handle missing fields
  - Handle invalid data types
- PUT /api/v1/Authors/{id}
  - Update existing author
  - Handle non-existent ID
  - Handle invalid data types
- DELETE /api/v1/Authors/{id}
  - Delete existing author
  - Handle non-existent ID
  - Handle invalid ID format

### Books API
- GET /api/v1/Books
  - List all books
  - Schema validation
- GET /api/v1/Books/{id}
  - Get single book
- POST /api/v1/Books
  - Create new book
  - Handle missing fields
  - Handle invalid data types
- PUT /api/v1/Books/{id}
  - Update existing book
  - Handle non-existent ID
- DELETE /api/v1/Books/{id}
  - Delete existing book
  - Handle invalid ID format

### CoverPhotos API
- GET /api/v1/CoverPhotos
  - List all cover photos
  - Schema validation
- GET /api/v1/CoverPhotos/{id}
  - Get single cover photo
- POST /api/v1/CoverPhotos
  - Create new cover photo
  - Handle invalid URL format
- PUT /api/v1/CoverPhotos/{id}
  - Update existing cover photo
- DELETE /api/v1/CoverPhotos/{id}
  - Delete existing cover photo
  - Handle invalid ID format

### Users API
- GET /api/v1/Users
  - List all users
  - Schema validation
- GET /api/v1/Users/{id}
  - Get single user
  - Handle non-existent ID
- POST /api/v1/Users
  - Create new user
  - Handle missing fields
  - Handle password complexity
- PUT /api/v1/Users/{id}
  - Update existing user
- DELETE /api/v1/Users/{id}
  - Delete existing user
  - Handle invalid ID format 

## GitHub Actions Workflow

This project includes a GitHub Actions workflow for running Playwright tests automatically on push and pull request events. The workflow is defined in the `.github/workflows/playwright.yaml` file and includes the following steps:

- Checkout the repository
- Set up Node.js
- Install dependencies
- Install Playwright with dependencies
- Run the Playwright tests
- Upload the test report as an artifact

You can view the workflow results in the "Actions" tab of your GitHub repository. 