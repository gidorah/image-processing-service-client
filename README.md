This is the front-end of image processing service toy project of mine.

Directory Structure

```
/
├── app/                  # --- Main pages and layouts
│   ├── (auth)/             # --- Authentication pages group
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (main)/             # --- Core application pages group
│   │   ├── dashboard/page.tsx
│   │   ├── image/[id]/page.tsx
│   │   └── result/[taskId]/page.tsx
│   │   └── layout.tsx        # Layout with header/footer for authenticated users
│   ├── layout.tsx          # --- Root layout
│   └── page.tsx            # --- Homepage (the uploader)
├── components/           # --- Reusable React components
│   ├── auth/               # --- Authentication components (forms, buttons)
│   ├── dashboard/          # --- Dashboard specific components (image grids)
│   ├── ui/                 # --- shadcn/ui components will go here
│   └── shared/             # --- General components (Header, Footer, etc.)
├── lib/                  # --- Helper functions, utilities, and API logic
│   ├── api.ts              # --- Centralized Axios instance and API calls
│   ├── utils.ts            # --- General utility functions
│   └── validators.ts       # --- Zod validation schemas
├── store/                # --- Zustand store for global state
│   └── authStore.ts
└── public/               # --- Static assets (images, fonts)
```
