# Videx - Video Library Dashboard

## Environment

### Setup

```bash
npm install # Install dependencies
npm run prisma:generate # Generate Prisma client
npm run prisma:dev:migrate # Run database migrations
npm run prisma:seed # Seed database
```

### Run dev server

```bash
npm run dev:server
npm run dev:client
```

### Run tests

```bash
npm run test
```

### Run type checks

```bash
npm run typecheck
```

### Run linter

```bash
npm run check
```

### Run formatter

```bash
npm run format
```

## Project Structure

```
videx/
├── client/                 # React frontend application
│   ├── components/         # Reusable UI components
│   ├── hooks/              # Custom React hooks and queries
│   ├── pages/              # Page components
│   ├── utils/              # Utility functions
│   ├── App.tsx             # Main app component
│   ├── main.tsx            # App entry point
│   └── index.css           # Global styles
├── server/                 # Fastify backend API
│   └── src/
│       ├── controllers/    # Request handlers
│       ├── routes/         # API route definitions
│       ├── services/       # Business logic
│       ├── utils/          # Utility functions
│       └── index.ts        # Server entry point
├── shared/                 # Shared code between client/server (data models, schemas)
└── prisma/                 # Database layer
```

## Technologies Used

### Frontend

- **React 19** - Client code
- **Vite** - Build tool for client code
- **TanStack Query** - Query management
- **Tailwind CSS** - Styling
- **Vitest/React Testing Library** - Unit testing

### Backend

- **Fastify** - Web framework
- **TSX** - Build tool for server code
- **Prisma (SQLite)** - Database ORM
- **Zod** - Schema validation
- **Vitest** - Unit testing

### Development Tools

- **Biome** - Fast linter and formatter

### Database

- **Prisma ORM** - Type-safe database operations
- **SQLite** - File-based database for development

## Architecture Decisions & Tradeoffs

### Database

- ORM(✅) over no ORM

  - ✅ Type safe
  - ✅ Clean abstraction, easy CRUD operations
  - ❌ Less control over raw SQL

- Prisma(✅) over TypeORM

  - ✅ Better type safety
  - ✅ Easier setup
  - ❌ More difficult to build dynamic queries
    - Although Prisma provides proper types to build

- SQLite(✅) over PostgreSQL

  - ✅ No external dependencies
  - ✅ Easy and quick setup
  - ✅ Better performance for single user, lightweight
  - ❌ Not suitable for production
  - ❌ No support for array structure
    - Storing arrays as a comma separated list

- Autoincrement(✅) over custom unique id
  - ✅ Works out of the box, doesn't require additional logic
    - Could be achieved with counter table?
  - ❌ Doesn't match provided dataset
    - Requires transformation when seeding data

### Pagination

- Cursor based(✅) over offset pagination
  - ✅ Consistent performance regardless of page size
  - ✅ Consistent: no data duplication
  - ✅ Better support for infinite scroll
  - ❌ Small overhead in implementation

## TODO

### Deployment

- [ ] Set up build tool for server
- [ ] Set up CI for linting, testing and building

### DX

- [ ] Revisit/fix tsconfigs

### Database

- [ ] Migrate to PostgreSQL for production use
  - [ ] Implement proper array support for tags
  - [ ] Add database indexes for search performance

### Filtering

- [ ] Add support for fuzzy search
- [ ] Add proper tag search with AND/OR logic

### Logging/Monitoring

- [ ] Add comprehensive error logging
- [ ] Add request tracing

### Security

- [ ] Implement CORS

### API/Endpoints

- [ ] Add bulk operations (bulk create, update, delete)
- [ ] Create endpoint for already used tags
- [ ] Implement soft deletes
- [ ] Optimistic updates/update React Query on mutation cache
- [ ] Allow to update video metadata

### Client side validation

- [ ] Custom error messages instead of built-in zod

### Testing

- [ ] More client side tests
