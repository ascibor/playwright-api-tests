# Playwright API Tests

This project contains automated API tests for the Fake REST API (https://fakerestapi.azurewebsites.net/) using Playwright.

## Features

- Modern TypeScript syntax
- Gherkin-style test descriptions (Given/When/Then)
- Comprehensive test coverage for multiple endpoints
- Performance testing
- Concurrent request handling

## Project Structure

```
tests/
  └── api/
      ├── activities.spec.ts  # Tests for /api/v1/Activities endpoint
      └── authors.spec.ts     # Tests for /api/v1/Authors endpoint
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
npx playwright test tests/api/authors.spec.ts    # Run only Authors tests
npx playwright test tests/api/activities.spec.ts  # Run only Activities tests
```

## Test Coverage

### Authors API
- Basic functionality and schema validation
- Query parameter handling
- Invalid parameter handling
- Performance constraints
- Special character handling in headers
- Concurrent request handling

### Activities API
- List all activities with schema validation
- Get single activity by ID 