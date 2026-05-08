# Contributing to PaperLabs

## Development Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/Srinidhi0604/PaperLabs.git
   cd PaperLabs
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. Run development server:
   ```bash
   npm run dev
   ```

## Project Structure

- `src/app/` - Next.js app router pages and API routes
- `src/components/` - React components
- `src/lib/` - Utility functions, types, and helpers
- `src/data/` - Static data and content
- `src/models/` - MongoDB models

## Key Utilities

### Types (`src/lib/types.ts`)
Shared TypeScript interfaces for User, Paper, Problem, Submission, etc.

### Validation (`src/lib/validation.ts`)
Input validation functions (email, username, password, etc.)

### API Response (`src/lib/api-response.ts`)
Standardized API response builders and error handlers.

### Constants (`src/lib/constants.ts`)
Application-wide configuration constants.

### Logger (`src/lib/logger.ts`)
Consistent logging utility for debugging and monitoring.

### Utils (`src/lib/utils.ts`)
Common helper functions (date formatting, debouncing, etc.)

## API Routes

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/callback` - OAuth callback

### Users
- `GET /api/users/[username]` - Get user profile
- `GET /api/users` - Get all users

### Papers & Problems
- `GET /api/reviews` - Get paper reviews
- `POST /api/submit` - Submit problem solution

## Code Style

- Use TypeScript for type safety
- Follow existing naming conventions
- Add JSDoc comments to functions
- Use the provided utility functions
- Keep functions small and focused

## Testing

Before committing:
1. Test your changes locally
2. Run `npm run lint` to check for issues
3. Verify no console errors in development

## Commit Message Format

Use conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `refactor:` Code refactoring
- `chore:` Maintenance tasks

Example: `feat: add user authentication`

## Questions?

Open an issue or reach out to the maintainers.
