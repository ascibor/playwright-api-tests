# Playwright API Tests

This project contains automated API tests for the Fake REST API (https://fakerestapi.azurewebsites.net/) using Playwright.

## Features

- Modern TypeScript syntax
- Gherkin-style test descriptions (Given/When/Then)
- Comprehensive test coverage for Authors endpoint
- Performance testing
- Concurrent request handling

## Setup

1. Install dependencies:
```bash
npm install
```

2. Run tests:
```bash
npx playwright test
```

3. Run tests with line reporter:
```bash
npx playwright test --reporter=line
```

## Test Cases

The test suite includes verification of:
- Basic functionality and schema validation
- Query parameter handling
- Invalid parameter handling
- Performance constraints
- Special character handling in headers
- Concurrent request handling 