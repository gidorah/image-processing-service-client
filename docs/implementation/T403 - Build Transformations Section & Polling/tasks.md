# Implementation Plan: T403 - Build Transformations Section & Polling

This document outlines the step-by-step tasks required to implement the "Transformations" section, focusing on performance and user experience improvements as detailed in the technical design.

## Phase 1: Backend API Enhancement

This phase focuses on creating a dedicated, performant API endpoint to fetch transformation tasks for a specific image.

- [x] **1. Create a dedicated API endpoint to fetch tasks for a specific image.**
  - **Task:** Implement the `GET /api/images/<id>/tasks/` endpoint that returns a JSON list of transformation tasks associated with the given image ID.
  - **File Path:** `backend/apps/images/api/views.py` (Note: This is a placeholder path for the Django backend.)
  - _Requirements: T403-FR01, T403-NR01_
  - **Sub-task:**
    - [x] **1.1 Write an integration test for the new API endpoint.**
      - **Task:** Create a test that verifies the endpoint returns the correct tasks for a given image ID and handles cases where no tasks exist.
      - **File Path:** `backend/apps/images/api/tests/test_views.py` (Note: Placeholder path.)

## Phase 2: Frontend Data Fetching

This phase refactors the frontend to use the new, efficient API endpoint.

- [x] **2. Update the frontend API library to use the new endpoint.**

  - **Task:** Create a new function, `getImageTransformationTasksById`, in the API library that accepts an `imageId` and fetches data from the new `GET /api/images/<id>/tasks/` endpoint. This function should also handle cursor-based pagination.
  - **File Path:** `lib/api.ts`
  - _Requirements: T403-FR01, T403-FR06, T403-NR01_

- [x] **3. Refactor the `TransformationsSection` component to use the new data fetching function.**
  - **Task:** Update the `TransformationsSection` component to use `useInfiniteQuery`. The `queryFn` should call `getImageTransformationTasksById`, and the query key should be updated to `['imageTasks', imageId]` to ensure correct caching. Implement the "load more" functionality to fetch subsequent pages.
  - **File Path:** `components/image/transformations-section.tsx`
  - _Requirements: T403-FR01, T403-FR02, T403-FR03, T403-FR06, T403-NR02_

## Phase 3: UI and Component-Level Tasks

This phase includes minor component optimizations and creating Storybook stories for UI validation and testing.

- [ ] **4. Optimize the `TransformationCard` component.**

  - **Task:** Wrap the `TransformationCard` component in `React.memo` to prevent unnecessary re-renders, as suggested in the performance considerations.
  - **File Path:** `components/image/transformation-card.tsx`
  - _Requirements: T403-NR04_

- [ ] **5. Create a Storybook story for the `TransformationCard` component.**

  - **Task:** Develop a new Storybook file that showcases all visual states of the `TransformationCard` (e.g., PENDING, IN_PROGRESS, SUCCESS, FAILED).
  - **File Path:** `components/image/transformation-card.stories.tsx` (New file)
  - _Requirements: T403-NR03_

- [ ] **6. Create a Storybook story for the `TransformationsSection` component.**
  - **Task:** Develop a new Storybook file that demonstrates the different states of the `TransformationsSection`, including the loading state (s-keletons), error state, and a populated list of tasks.
  - **File Path:** `components/image/transformations-section.stories.tsx` (New file)
  - _Requirements: T403-NR03_

## Phase 4: Testing

This phase ensures that the refactored components and new logic are thoroughly tested.

- [ ] **7. Update integration tests for the `TransformationsSection` component.**
  - **Task:** Modify the existing integration tests to mock the new `getImageTransformationTasksById` API call. Verify that the component correctly renders the list, that polling stops when all tasks are in a terminal state, that the "load more" functionality works correctly, and that API errors are handled gracefully.
  - **File Path:** `components/image/__tests__/transformations-section.test.tsx`
  - _Requirements: T403-FR01, T403-FR02, T403-FR05, T403-FR06_
