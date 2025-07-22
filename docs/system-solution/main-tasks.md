# Main Project Epics & Tasks

This document outlines the granular, sequential epics and tasks for the Image Processing Service frontend project. Epics are prefixed with `E` and tasks with `T`. The plan is an updated version of `docs/incoming/Original_Plan.md`, revised to reflect the analysis in the system solution documents.

---

### **E01 - Project Foundation & Initial Setup**

- **Description:** Configure the Next.js project, install all necessary libraries, define the project structure, and set up basic layouts and navigation.
- **Tasks:**
  - [x] **T101 - Initialize Next.js Project:** Create a new Next.js project with TypeScript and Tailwind CSS.
  - [x] **T102 - Install & Configure Libraries:** Install all core dependencies (shadcn/ui, Zustand, TanStack Query, etc.).
  - [x] **T103 - Initialize Shadcn/UI:** Set up `globals.css`, theme variables, and utility functions.
  - [x] **T104 - Define Project Structure:** Create the designed directory structure (`/app`, `/components`, `/lib`, etc.).
  - [x] **T105 - Set Up Basic Layout & Nav:** Create a root layout with a placeholder Header and Footer.
  - [x] **T106 - Configure Linting & Formatting:** Set up ESLint and Prettier for consistent code style.

---

### **E02 - User Authentication & Account Management**

- **Description:** Implement the complete user authentication flow, including registration, login, logout, protected routes, and password reset functionality.
- **Dependencies:** E01
- **Tasks:**
  - [x] **T201 - Create API Client & Auth Store:** Set up the centralized Axios instance and Zustand store.
  - [x] **T202 - Build Login & Signup UI:** Create the pages and forms for `/login` and `/signup`.
  - [x] **T203 - Implement Form Validation:** Create Zod schemas and integrate with React Hook Form.
  - [x] **T204 - Integrate Auth API Endpoints:** Use TanStack Query to call `/api/register` and `/api/login`.
  - [x] **T205 - Implement Logout & Protected Routes:** Create a logout function and protect dashboard routes.
  - [ ] **T206 - Implement Forgot Password Flow:** Add a "Forgot Password" feature to the login flow.
    - **Note:** _New task._ Based on `FR006` and original plan task `#35`.
  - [ ] **T207 - Enhance Token Refresh Logic:** Update the Axios interceptor to handle `401` errors by attempting a token refresh before logging out.
    - **Note:** _New task._ Based on architectural recommendations in `architecture.md`.
  - [ ] **T208 - Update User Type Definition:** Synchronize the `User` type in `lib/types.ts` with the full data model from the backend API (`/api/auth/user/`).
    - **Note:** _New task._ Addresses "Incomplete Type Definitions" from `product-overview.md`.

---

### **E03 - Core Image Upload & Management**

- **Description:** Develop the functionality for users to upload images and view them on a dedicated detail page.
- **Dependencies:** E02
- **Tasks:**
  - [x] **T301 - Build Homepage Image Uploader:** Create the drag-and-drop file uploader component.
  - [x] **T302 - Implement Image Upload API:** Create a mutation hook to send the file to `/api/images/upload/`.
  - [x] **T303 - Build Image Detail Page:** Create the dynamic page at `/image/[id]` to display the source image.

---

### **E04 - Image Transformation Workflow**

- **Description:** Build the end-to-end process for applying transformations, polling for status, and displaying the result.
- **Dependencies:** E03
- **Tasks:**
  - [x] **T401 - Build Transformation Form:** Create the form on the image detail page for selecting transformations.
  - [x] **T402 - Implement Transformation API:** Create a mutation to send parameters to `/api/images/[id]/transform/`.
  - [ ] **T403 - Build Transformations Section & Polling:** Display transformation tasks and poll for status updates.
  - [ ] **T404 - Display Transformation Result:** Build the page to show the final transformed image and allow download.

---

### **E05 - User Dashboard & History**

- **Description:** Create a centralized dashboard for users to view their history of source and transformed images.
- **Dependencies:** E03
- **Tasks:**
  - [ ] **T501 - Build Dashboard Layout:** Create the main structure for the user dashboard page.
  - [ ] **T502 - Fetch & Display Source Images:** Implement functionality to list the user's uploaded images.
  - [ ] **T503 - Fetch & Display Transformed Images:** Implement functionality to list the user's transformed images.

---

### **E06 - UI/UX Polish & Finalization**

- **Description:** Enhance the user experience with responsive design, notifications, and improved loading states.
- **Dependencies:** E05
- **Tasks:**
  - [ ] **T601 - Implement Responsive Design:** Ensure the application is fully responsive on all devices.
  - [ ] **T602 - Add Toast Notifications:** Integrate non-intrusive notifications for user actions.
  - [ ] **T603 - Improve Loading States:** Add clear loading indicators during data fetching and processing.
  - [ ] **T604 - Refine Global Error Handling:** Implement a robust and consistent error handling strategy.

---

### **E07 - Technical Debt & Codebase Refinement**

- **Description:** Address identified technical debt to improve code quality and maintainability.
- **Dependencies:** E04
- **Tasks:**
  - [ ] **T701 - Remove Hardcoded Values:** Replace the `"TODO"` in the `uploadImage` function with a dynamic value or remove it.
  - [ ] **T702 - Refactor Logout Logic:** Ensure client-side state is cleared immediately on logout success, without relying on a `401` response.
  - [ ] **T703 - Add Comprehensive Testing:** Increase test coverage for critical user flows like authentication and image transformation.
  - [ ] **T704 - Clean Up Commented-out Code:** Remove the commented-out test code from the dashboard page.
  - [ ] **T705 - Implement Efficient Task Fetching:** Create a new query to fetch transformation tasks for a specific image using the recommended `GET /api/images/<id>/tasks/` endpoint.
    - **Note:** _New task._ Added to address the performance bottleneck identified in `architecture.md`. This task assumes the backend endpoint is available.
