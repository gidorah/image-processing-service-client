# Image Processing Service Frontend

A modern Next.js application that provides an intuitive interface for image processing and transformation. Users can upload images, apply various transformations, and track processing status in real-time.

## Features

- **Image Upload**: Drag-and-drop interface for easy image uploading
- **Image Transformations**: Apply resize, crop, rotate, filters, watermarks, and format conversions
- **Real-time Processing**: Track transformation task status with live polling
- **User Dashboard**: Manage uploaded images and view processing history
- **Secure Authentication**: JWT-based authentication with automatic session management
- **Responsive Design**: Modern UI built with Tailwind CSS and shadcn/ui components

## Technology Stack

- **Framework**: Next.js 15.3.3 with App Router
- **Language**: TypeScript 5 with strict mode
- **UI**: Tailwind CSS 4 + shadcn/ui components (New York style)
- **State Management**: Zustand (global) + TanStack Query (server state)
- **Forms**: React Hook Form with Zod validation
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React
- **Themes**: next-themes for dark/light mode

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp .env.example .env.local
   ```

   Configure your API URL and other environment variables.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint issues automatically
npm run format       # Format code with Prettier
npm run format:check # Check code formatting
```

## Project Structure

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

## Key Features

### Authentication

- Secure JWT-based authentication
- Automatic token refresh and session management
- Protected routes with middleware
- Login/signup forms with validation

### Image Processing

- Upload images via drag-and-drop interface
- Apply multiple transformations: resize, crop, rotate, filters, watermarks
- Support for various output formats (JPEG, PNG, WebP)
- Real-time status tracking for processing tasks

### User Experience

- Responsive design for all device sizes
- Dark/light theme support
- Loading states and error handling
- Toast notifications for user feedback

## API Integration

The application integrates with a Django REST API backend. Key API functions include:

- **Authentication**: Login, logout, registration, password management
- **Image Management**: Upload, retrieve, and list source images
- **Transformations**: Create transformation tasks and track status
- **Task Management**: Fetch transformation tasks and individual task details

See `API_DOCUMENTATION.md` for detailed API endpoint documentation.

## Development

### Adding Components

Use shadcn/ui for new UI components:

```bash
npx shadcn@latest add [component-name]
```

### Code Style

- ESLint + Prettier for code formatting
- TypeScript strict mode enabled
- Path aliases: `@/*` maps to project root
- Follow established naming conventions

### State Management

- **Server State**: Use TanStack Query for API data
- **Global State**: Use Zustand for authentication and UI state
- **Form State**: Use React Hook Form with Zod validation

## Contributing

1. Follow the established code style and patterns
2. Add TypeScript types for all new code
3. Include proper error handling
4. Test components and API functions
5. Update documentation for new features
