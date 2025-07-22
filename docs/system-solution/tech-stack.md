# Tech Stack: Image Processing Service

This document outlines the technology stack for the Image Processing Service's frontend application, as derived from the system overview and architecture documents.

## 1. Frontend

The frontend is a modern single-page application (SPA) built with a focus on type safety, component-based UI, and efficient state management.

- **Framework:** **Next.js (App Router)**
  - **Justification:** Chosen for its powerful features like Server-Side Rendering (SSR), Static Site Generation (SSG), file-based routing, and API routes, which provide a robust foundation for a high-performance web application. The App Router enables a modern, flexible routing and layout system.
- **Language:** **TypeScript**
  - **Justification:** Used to enforce type safety, which reduces runtime errors, improves code quality, and enhances developer experience through better autocompletion and static analysis.
- **UI Components:** **shadcn/ui** & **Radix UI**
  - **Justification:** shadcn/ui provides a set of beautifully designed, accessible, and customizable components built on top of Radix UI's unstyled, accessible primitives. This combination allows for rapid development of a consistent and high-quality user interface.
- **Styling:** **Tailwind CSS**
  - **Justification:** A utility-first CSS framework that enables rapid UI development directly within the markup, promoting consistency and maintainability without writing custom CSS.
- **Global State Management:** **Zustand**
  - **Justification:** A small, fast, and scalable state management solution. Its simplicity and minimal boilerplate make it an excellent choice for managing global client-side state, such as user authentication status.
- **Server State Management:** **TanStack Query (React Query)**
  - **Justification:** A powerful library for fetching, caching, synchronizing, and updating server state. It simplifies data fetching logic, handles caching and background refetching automatically, and provides a great user experience by managing loading and error states.
- **Forms:** **React Hook Form** & **Zod**
  - **Justification:** React Hook Form is used for building performant and flexible forms. It integrates seamlessly with Zod for schema validation, ensuring that all user input is validated against a defined schema on both the client and server sides.
- **API Client:** **Axios**
  - **Justification:** A promise-based HTTP client for making requests to the backend API. It is configured with interceptors to handle global concerns like authentication (e.g., refreshing tokens, handling 401 errors).

## 2. Backend

The backend is a powerful, Django-based RESTful API responsible for all business logic, data persistence, and asynchronous task processing.

- **Language:** **Python**
- **Runtime:** **CPython** (assumed, as it's the standard for Django)
- **Framework:** **Django** (specifically Django REST Framework)
  - **Justification:** A high-level Python web framework that encourages rapid development and clean, pragmatic design. Django REST Framework is the standard for building robust and scalable RESTful APIs with Django.
- **Key Libraries:**
  - **Celery:** For running asynchronous image processing tasks in the background, ensuring the API remains responsive.
  - **Redis:** Acts as the message broker for Celery, managing the queue of tasks to be processed.

## 3. Database

- **Database Technology:** **PostgreSQL**
  - **Justification:** A powerful, open-source object-relational database system known for its reliability, feature robustness, and performance. It is well-suited for handling the relational data of the application (Users, Images, Tasks).
- **ODM/ORM:** **Django ORM**
  - **Justification:** The built-in Object-Relational Mapper in Django provides a high-level API for interacting with the database, abstracting away raw SQL queries and simplifying data access.

## 4. Real-time Communication

- **Technology:** **Polling** (via TanStack Query)
  - **Justification:** The current requirement is to show the status of image transformation tasks in real-time. While WebSockets could be used, a simpler and effective initial approach is to use the polling capabilities of **TanStack Query**. It can be configured to refetch the task status from the `/api/tasks/<id>/` endpoint at a regular interval (e.g., every few seconds) until the task is complete. This avoids the complexity of setting up a WebSocket connection while still providing the necessary real-time feedback to the user. If true real-time needs expand, WebSockets could be integrated later.

## 5. Testing

- **Unit & Integration Testing:**
  - **Framework:** **Vitest**
  - **Library:** **React Testing Library**
  - **Justification:** Vitest is a modern, fast, and ESM-native testing framework that is compatible with Jest's API. React Testing Library is used to test React components in a way that resembles how users interact with them, ensuring the application is accessible and functional.
- **End-to-End (E2E) Testing:** (Recommendation)
  - **Framework:** **Playwright** or **Cypress**
  - **Justification:** While not currently implemented, a dedicated E2E testing framework is recommended to automate testing of critical user flows across different browsers, such as the authentication and image upload/transformation processes.

## 6. DevOps & Deployment

- **CI/CD Pipeline:** (Recommendation)
  - **Tools:** **GitHub Actions**
  - **Justification:** A CI/CD pipeline should be set up to automate testing, linting, and building of the frontend application on every push to the main branch. GitHub Actions is a natural choice as the repository is likely hosted on GitHub.
- **Hosting Environment:** **Vercel** (recommended for Next.js) or **AWS (S3/CloudFront)**
  - **Justification:** Vercel is the platform built by the creators of Next.js and offers a seamless, zero-configuration deployment experience with optimizations for performance and scalability. Alternatively, the application can be deployed as a static site to an S3 bucket and served via CloudFront for global distribution.
- **Containerization:** **Docker**
  - **Justification:** The backend services (Django, Celery, Redis, PostgreSQL) are containerized using Docker, as illustrated in the architecture diagram. This ensures consistency across development, testing, and production environments.
