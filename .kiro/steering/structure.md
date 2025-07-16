# Project Structure & Organization

## Directory Layout

```
/
├── app/                    # Next.js App Router pages and layouts
│   ├── (auth)/            # Authentication route group
│   │   ├── login/         # Login page
│   │   └── signup/        # Registration page
│   ├── (main)/            # Main application route group
│   │   ├── dashboard/     # User dashboard
│   │   ├── image/[id]/    # Dynamic image detail pages
│   │   └── result/[taskId]/ # Transformation result pages
│   ├── layout.tsx         # Root layout with providers
│   ├── page.tsx           # Homepage (image uploader)
│   └── providers.tsx      # React Query and theme providers
├── components/            # Reusable React components
│   ├── auth/             # Authentication-specific components
│   ├── dashboard/        # Dashboard-specific components
│   ├── image/            # Image processing components
│   ├── shared/           # Shared components (Header, Footer)
│   └── ui/               # shadcn/ui component library
├── lib/                  # Utilities and business logic
│   ├── api.ts            # Axios instance and API functions
│   ├── types.ts          # TypeScript type definitions
│   ├── utils.ts          # General utility functions
│   ├── validators.ts     # Zod validation schemas
│   └── transform-types.ts # Image transformation types
├── store/                # Global state management
│   └── authStore.ts      # Zustand authentication store
└── public/               # Static assets
```

## Architectural Patterns

### Route Groups

- `(auth)` - Authentication pages with minimal layout
- `(main)` - Main application pages with full header/footer

### Component Organization

- **Feature-based**: Components grouped by domain (auth, dashboard, image)
- **Shared components**: Reusable UI elements in `shared/`
- **UI library**: shadcn/ui components in `ui/` directory

### State Management Strategy

- **Server state**: TanStack Query for API data, caching, and synchronization
- **Client state**: Zustand for authentication and global UI state
- **Form state**: React Hook Form for local form management

### API Layer

- Centralized Axios instance with request/response interceptors
- Automatic token attachment and 401 error handling
- Type-safe API functions with proper error handling

### File Naming Conventions

- **Pages**: `page.tsx` (App Router convention)
- **Layouts**: `layout.tsx` (App Router convention)
- **Components**: PascalCase with descriptive names
- **Utilities**: camelCase with clear purpose
- **Types**: Descriptive interfaces and types

### Import Patterns

- Use `@/` path alias for all internal imports
- Group imports: external libraries, internal modules, relative imports
- Prefer named exports for utilities, default exports for components
