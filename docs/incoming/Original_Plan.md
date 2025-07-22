# **Project Handover: Image Processing Frontend**

### **1\. Project Overview**

**Goal:** To build a modern, responsive, and user-friendly frontend for the existing Django-based Image Processing API. The application will allow users to sign up, log in, upload images, apply transformations, and view their image history.

**UI/UX Inspiration:** The user interface and primary user flow will be inspired by remove.bg, emphasizing a simple, drag-and-drop experience for the initial image upload.

**Backend:** The frontend will communicate with the provided Django backend project, which handles user authentication, image storage (S3), and asynchronous task processing (Celery/Redis).

### **2\. Core Architecture & Technology Stack**

The architecture is designed to be modern, scalable, and maintainable, leveraging the best of the React and Next.js ecosystems.

| Category      | Technology                   | Justification                                                                                                                                                                        |
| ------------- | ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Framework     | Next.js (App Router)         | Provides a robust foundation with file-based routing, Server-Side Rendering (SSR), and a rich ecosystem. The App Router is used for modern, flexible layouts.                        |
| Language      | TypeScript                   | Ensures type safety, which is crucial for catching errors early, improving code quality, and creating predictable interactions with the API.                                         |
| UI Components | shadcn/ui & Tailwind CSS     | shadcn/ui provides beautifully designed, unopinionated components that are copied into the project for full ownership. Tailwind CSS provides the utility classes for rapid styling.  |
| Global State  | Zustand                      | A lightweight, simple state management library for global client-side state, such as the user's authentication status and JWT tokens.                                                |
| Server State  | TanStack Query (React Query) | The industry standard for managing server state. It simplifies fetching, caching, and updating data, handling loading states, errors, and background refetching automatically.       |
| Forms         | React Hook Form & Zod        | React Hook Form offers a performant and easy-to-use solution for building forms. Zod provides TypeScript-first schema validation for robust client-side checks.                      |
| API Client    | Axios                        | A powerful HTTP client for making requests to the Django backend. A centralized Axios instance will be configured to manage the API's base URL and automatically attach auth tokens. |
| File Handling | react-dropzone               | A simple and accessible library for creating the core drag-and-drop file upload area.                                                                                                |
| Utilities     | clsx & tailwind-merge        | Essential helper libraries (installed with shadcn/ui) for conditionally combining and merging Tailwind CSS class names without style conflicts.                                      |

### **3\. System Design**

#### **3.1. Project Directory Structure**

/  
├── app/ \# \--- Main pages and layouts  
│ ├── (auth)/ \# \--- Auth pages (login, signup)  
│ ├── (main)/ \# \--- Core app pages (dashboard, etc.)  
│ ├── layout.tsx \# \--- Root layout  
│ └── page.tsx \# \--- Homepage (uploader)  
├── components/ \# \--- Reusable React components  
│ ├── auth/  
│ ├── dashboard/  
│ ├── ui/ \# \--- shadcn/ui components  
│ └── shared/ \# \--- Header, Footer, etc.  
├── lib/ \# \--- Helper functions, utilities, API logic  
│ ├── api.ts \# \--- Centralized Axios instance & API calls  
│ ├── utils.ts \# \--- General utility functions  
│ └── validators.ts \# \--- Zod validation schemas  
├── store/ \# \--- Zustand store for global state  
│ └── authStore.ts  
└── public/ \# \--- Static assets (images, fonts)

#### **3.2. Core Data Flows**

1. **Authentication Flow:**
   - User submits LoginForm \-\> React Hook Form validates with Zod \-\> TanStack Query mutation calls /api/login/.
   - On success, JWT tokens are saved as html only, samesite cookies.
   - The Axios instance uses an interceptor to attach the access token to all future requests.
2. **Image Upload & Transform Flow:**
   - User drops an image onto the react-dropzone uploader.
   - A TanStack Query mutation POSTs the file to /api/images/upload/.
   - On success, the app receives the image ID and redirects to /image/\[id\].
   - On the image page, the user selects transformations and submits a form.
   - Another mutation POSTs to /api/images/\[id\]/transform/, receiving a taskId.
   - The app redirects to /result/\[taskId\], which uses TanStack Query to poll the task status endpoint until the image is processed.

### **4. Project Task Plan**

Here is the complete breakdown of tasks based on the project's phases, including both open and completed issues.

#### **Phase 1: Initial Setup & Configuration**

- [x] **#1 Phase 1: Project Setup & Foundation**
- [x] **#2 Initialize Next.js Project**
  > Create a new Next.js project using the App Router, configured with TypeScript and Tailwind CSS. Clean out the default boilerplate code.
- [x] **#3 Install & Configure Libraries**
  > Install all core dependencies (shadcn/ui, zustand, TanStack Query, axios, React Hook Form, zod, react-dropzone).
- [x] **#4 Initialize Shadcn/UI**
  > Run the shadcn-ui init command to set up globals.css, theme variables, and utility functions for UI components.
- [x] **#5 Define Project Structure**
  > Create the directory structure we designed (/app, /components, /lib, /store, etc.) to keep the codebase organized.
- [x] **#6 Set Up Basic Layout & Nav**
  > Layout & Nav Create a root layout with a placeholder Header and Footer. The header should contain the app logo and a placeholder for auth buttons.
- [x] **#7 Configure Linting & Formatting**
  > Set up ESLint and Prettier to enforce a consistent code style and catch common errors automatically.

#### **Phase 2: User Authentication**

- [x] **#8 Phase 2: User Authentication**
- [x] **#9 Create API Client & Auth Store**
  > Set up the centralized Axios instance in lib/api.ts and the Zustand store in store/authStore.ts to manage JWT tokens and user authentication state.
- [x] **#10 Build Login & Signup UI Pages**
  > Create the pages and forms for /login and /signup using Card, Input, Button, and Label components from shadcn/ui.
- [x] **#11 Implement Form Validation**
  > Create Zod schemas for the login and registration forms and integrate them with React Hook Form for client-side validation.
- [x] **#12 Integrate Auth API Endpoints**
  > Use TanStack Query's useMutation to call the /api/register and /api/login endpoints. On success, store the tokens in Zustand.
- [x] **#13 Implement Logout & Protected Routes**
  > Create a logout button to clear auth state. Implement logic to protect pages like the dashboard, redirecting unauthenticated users to the login page.
- [skip] **#35 implement forgot password on login page:**
  > Add a "Forgot Password" feature to the login flow.

#### **Phase 3: Core Image Upload & Display**

- [x] **#14 Phase 3: Core Image Upload & Display**
- [x] **#15 Build Homepage Image Uploader**
  > Create the drag-and-drop file uploader component for the homepage. Add client-side validation for file type (e.g., jpeg, png) and file size.
- [x] **#16 Implement Image Upload API**
  > Create a useUploadImage mutation hook that sends the file to the /api/images/upload/ endpoint. On success, redirect to the new image's detail page.
- [x] **#17 Build Image Detail Page**
  > Create the dynamic page at /image/[id]. Use TanStack Query's useQuery to fetch the source image data and display the image prominently.

#### **Phase 4: Image Transformation & Results**

- [ ] **#18 Phase 4: Image Transformation & Processing**
- [x] **#19 Build Transformation Form**
  > Build the form on the image detail page that allows users to select transformation options (e.g., resize, grayscale) and submit them.
- [x] **#20 Implement Transformation API**
  > Create a useTransformImage mutation that sends the transformation parameters to the /api/images/[id]/transform/ endpoint.
- [ ] **#21 Build Transformations Section & Polling**
  > Build the transformations section inside Image Detail Page, which shows all transformation tasks of source image as cards in a horizontal layout. Polls the /api/tasks/[id]/ endpoint of "PENDING" tasks to check status. Use TanStack Query's useQuery with a refetchInterval.
- [ ] **#22 Display Transformation Result:**
  > Build the page that shows the final transformed image and allows users to download it.

#### **Phase 5: User Dashboard**

- [ ] **#23 Phase 5: User Dashboard**
- [ ] **#24 Build Dashboard Layout:**
  > Create the main structure and layout for the user dashboard.
- [ ] **#25 Fetch & Display Source Images:**
  > Implement functionality to fetch and display the user's uploaded images.
- [ ] **#26 Fetch & Display Transformed Images:**
  > Show the results of image transformations.

#### **Phase 6: Polish & Finalization**

- [ ] **#27 Phase 6: Polish & Finalization**
- [ ] **#28 Implement Responsive Design:**
  > Ensure the application is fully responsive and works seamlessly on all devices.
- [ ] **#29 Add Toast Notifications:**
  > Integrate non-intrusive notifications for user actions (e.g., successful upload, error messages).
- [ ] **#30 Improve Loading States:**
  > Enhance the user experience by adding clear loading indicators during data fetching and processing.
- [ ] **#31 Refine Global Error Handling:**
  > Implement a robust and consistent error handling strategy across the application.

#### **Miscellaneous & Future Tasks**

- [ ] **#43 Improvements and Orphan Tasks:**
  > Address any remaining small tasks, bugs, or improvements.
