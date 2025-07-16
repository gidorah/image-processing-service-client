# Technology Stack & Build System

## Core Framework

- **Next.js 15.3.3** with App Router (file-based routing, SSR support)
- **React 19** with TypeScript for type safety
- **Node.js** runtime environment

## UI & Styling

- **Tailwind CSS 4** for utility-first styling
- **shadcn/ui** components (New York style, with CSS variables)
- **Radix UI** primitives for accessible components
- **Lucide React** for icons
- **next-themes** for theme management

## State Management

- **Zustand** for global client state (auth, user data)
- **TanStack Query (React Query)** for server state management
- **React Hook Form** with **Zod** validation for forms

## API & Data

- **Axios** for HTTP client with interceptors
- **JWT authentication** via HTTP-only cookies
- RESTful API communication with Django backend

## Development Tools

- **TypeScript 5** with strict mode enabled
- **ESLint** with Next.js and Prettier configs
- **Prettier** with Tailwind plugin for code formatting

## Common Commands

### Development

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

### Code Quality

```bash
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

### Component Management

```bash
npx shadcn@latest add [component]  # Add shadcn/ui components
```

## Configuration Notes

- Path aliases: `@/*` maps to project root
- Image optimization configured for S3 remote patterns
- CSS variables enabled for theming
- Strict TypeScript configuration with ES2017 target
