# Design Document

## Overview

The Image Transformations Display feature adds a dedicated section to the Image Detail Page that showcases all transformation tasks associated with a source image. This feature enhances the user experience by providing a centralized view of all processing operations, their current status, and easy access to results.

The design follows a card-based horizontal scrolling layout that adapts to different screen sizes while maintaining optimal usability across desktop, tablet, and mobile devices.

## Architecture

### Component Hierarchy

```
ImageDetailPage
├── ImageDisplay (existing)
├── TransformationsSection (new)
│   ├── TransformationsHeader
│   ├── TransformationsContainer
│   │   └── TransformationCard[] (multiple)
│   └── EmptyState (conditional)
```

### Data Flow

1. **Initial Load**: TransformationsSection fetches transformation tasks via single API call
2. **Centralized Polling**: TransformationsSection manages polling for all incomplete tasks with smart intervals
3. **Form Integration**: Transformation form submission triggers automatic refresh with retry mechanism
4. **User Interaction**: Card clicks navigate to result pages
5. **Responsive Adaptation**: Layout adjusts based on viewport size

### Data Management Architecture

**Centralized Approach**: TransformationsSection owns all data fetching and state management to optimize performance for high-volume usage scenarios.

**Key Design Decisions**:

- Single API call fetches complete task list (no individual task fetching needed)
- Centralized polling reduces server load and improves efficiency
- Form integration through callback-based refresh mechanism
- No optimistic updates - wait for server confirmation

## Components and Interfaces

### TransformationsSection Component

**Purpose**: Main container component that owns all transformation data management and orchestrates the display

**Props**:

```typescript
interface TransformationsSectionProps {
  imageId: number;
}
```

**Responsibilities**:

- **Data Management**: Fetch transformation tasks via `getImageTransformations` API
- **Centralized Polling**: Manage polling for incomplete tasks with smart intervals
- **State Management**: Handle loading, error, and empty states
- **Automatic Refresh**: Respond to React Query cache invalidation from form submissions
- **UI Orchestration**: Coordinate horizontal scrolling and responsive behavior

**Data Fetching Strategy**:

```typescript
// React Query implementation with type-safe query keys
const {
  data: transformations,
  isLoading,
  error,
  refetch,
} = useQuery({
  queryKey: queryKeys.transformations(imageId),
  queryFn: () => getImageTransformations(imageId),
  refetchInterval: (query) => {
    // Smart polling: only poll if there are incomplete tasks
    const hasIncomplete = query.state.data?.some(
      (task) => task.status === "PENDING" || task.status === "IN_PROGRESS"
    );
    return hasIncomplete ? 2000 : false; // 2 seconds for active processing
  },
  refetchIntervalInBackground: false, // Pause when tab inactive
  retry: (failureCount, error) => {
    // Exponential backoff for polling failures
    return failureCount < 3;
  },
  retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
});
```

**Polling Strategy**:

- **Active Processing**: 2-3 second intervals when tasks are IN_PROGRESS or PENDING
- **Background Pause**: Automatically pause polling when tab/window becomes inactive
- **Error Handling**: Silent retry with exponential backoff, max 3 attempts
- **Smart Termination**: Stop polling when all tasks are completed

### TransformationCard Component

**Purpose**: Pure presentation component for displaying individual transformation task information

**Props**:

```typescript
interface TransformationCardProps {
  task: TransformationTask;
  onClick?: (taskId: string) => void;
  isClickable: boolean;
}
```

**Design Philosophy**: TransformationCard is a pure presentation component that receives all necessary data from its parent. It does not perform any API calls or manage its own state, ensuring optimal performance and simplicity.

**shadcn/ui Components Used**:

- `Card`, `CardContent`, `CardHeader` for card structure
- `Badge` for status indicators
- `Button` for clickable interactions
- `Progress` for in-progress transformations
- `Skeleton` for loading states

**Transformations Display Logic**:

The `transformations` field contains a Record<string, unknown> with transformation parameters. The display logic should be dynamic and extensible to handle any transformation type:

```typescript
// Dynamic transformation parsing
const parseTransformations = (transformations: Record<string, unknown>) => {
  return Object.entries(transformations)
    .map(([key, value]) => {
      // Capitalize the transformation name
      const displayName = key.charAt(0).toUpperCase() + key.slice(1);

      // Handle different value types dynamically
      if (typeof value === "boolean") {
        return value ? displayName : null; // Only show if true
      } else if (typeof value === "object" && value !== null) {
        // For complex objects, show key properties
        const props = Object.entries(value as Record<string, any>)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", ");
        return `${displayName}: ${props}`;
      } else {
        return `${displayName}: ${value}`;
      }
    })
    .filter(Boolean); // Remove null values
};
```

**Design Rationale**: This approach is transformation-agnostic and will automatically adapt to new transformation types without requiring code changes. It provides readable output for any transformation structure while maintaining flexibility for future extensions.

**Visual States**:

- **Pending**: Loading spinner using `Skeleton`, muted colors, disabled interaction
- **In Progress**: `Progress` component, animated elements, disabled interaction
- **Completed**: Success styling with `Badge`, preview thumbnail, clickable `Card`
- **Failed**: Error styling with `Badge`, error message, disabled interaction
- **Cancelled**: Warning styling with `Badge`, cancelled message, disabled interaction

### Form Integration Pattern

**Purpose**: Seamless communication between transformation form and transformations list using React Query invalidation

**Design Rationale**: To satisfy Requirement 7, the form submission success triggers an immediate refresh of the transformations list. This is achieved through React Query's cache invalidation mechanism, which provides automatic coordination between components without tight coupling.

**Integration Pattern**:

```typescript
// Query Key Factory for type safety and consistency
export const queryKeys = {
  transformations: (imageId: number) => ["transformations", imageId] as const,
  image: (imageId: number) => ["image", imageId] as const,
} as const;

// In TransformationForm component
/**
 * TransformationForm component
 *
 * Side effects:
 * - Invalidates transformations query on successful submission
 * - This triggers automatic refresh in TransformationsSection and any other components
 *   using the same query key: ['transformations', imageId]
 *
 * Dependencies:
 * - Requires React Query context (QueryClient)
 * - Affects any component using transformations query for the same imageId
 */
const TransformationForm = ({ imageId }: { imageId: number }) => {
  const queryClient = useQueryClient();

  const { mutate: processImage } = useMutation({
    mutationFn: transformImage,
    onSuccess: (data) => {
      // Invalidate transformations cache to trigger automatic refresh
      queryClient.invalidateQueries({
        queryKey: queryKeys.transformations(imageId),
      });
    },
  });
};

// In TransformationsSection component
/**
 * TransformationsSection component
 *
 * Data dependencies:
 * - Automatically refreshes when transformations query is invalidated
 * - Listens to query key: ['transformations', imageId]
 * - Will refresh when TransformationForm successfully submits
 */
const TransformationsSection = ({ imageId }: { imageId: number }) => {
  const {
    data: transformations,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: queryKeys.transformations(imageId),
    queryFn: () => getImageTransformations(imageId),
    // Automatic refresh triggered by cache invalidation
  });
};
```

**Key Features**:

- **Automatic Cache Invalidation**: React Query handles refresh coordination automatically
- **Type-Safe Query Keys**: TypeScript factory prevents typos and ensures consistency
- **Decoupled Components**: Form and list don't need direct references to each other
- **Network Deduplication**: React Query prevents duplicate API calls
- **Documented Dependencies**: Clear documentation of which components affect each other
- **No Optimistic Updates**: Wait for server response before showing new transformations

**Form Submission Flow**:

1. User submits transformation form
2. Form calls API and waits for server response (no optimistic updates)
3. On success, form invalidates transformations query cache
4. React Query automatically triggers refetch for all components using that query
5. TransformationsSection receives fresh data and updates automatically
6. New transformation appears in list once successfully fetched

### Query Key Management

**Purpose**: Centralized, type-safe query key management to prevent inconsistencies and enable reliable cache invalidation

**Query Key Factory**:

```typescript
// lib/query-keys.ts
export const queryKeys = {
  // Image-related queries
  image: (imageId: number) => ["image", imageId] as const,

  // Transformation-related queries
  transformations: (imageId: number) => ["transformations", imageId] as const,
  transformation: (taskId: number) => ["transformation", taskId] as const,

  // User-related queries (for future use)
  user: () => ["user"] as const,
  userImages: (userId: number) => ["user", userId, "images"] as const,
} as const;
```

**Usage Pattern**:

```typescript
// In components - always use the factory
const { data } = useQuery({
  queryKey: queryKeys.transformations(imageId),
  queryFn: () => getImageTransformations(imageId),
});

// For invalidation - consistent keys guaranteed
queryClient.invalidateQueries({
  queryKey: queryKeys.transformations(imageId),
});
```

**Benefits**:

- **Type Safety**: TypeScript prevents typos in query keys
- **Consistency**: Same key format used everywhere
- **Refactoring Safety**: Change key format in one place
- **Documentation**: Clear structure shows all available queries

### Data Models

```typescript
export interface TransformationTask {
  id: number;
  status: "PENDING" | "IN_PROGRESS" | "SUCCESS" | "FAILED" | "CANCELLED";
  format: string;
  transformations: Record<string, unknown>;
  original_image: number;
  result_image: number | null;
  created_at: string;
  updated_at: string;
  error_message: string | null;
}
```

## User Interface Design

### Layout Structure

**Desktop Layout**:

- Cards: 280px width, 200px height
- Spacing: 16px gap between cards
- Container: Full width with horizontal scroll
- Padding: 24px horizontal, 16px vertical

**Tablet Layout**:

- Cards: 240px width, 180px height
- Spacing: 12px gap between cards
- Container: Full width with touch scroll
- Padding: 16px horizontal, 12px vertical

**Mobile Layout**:

- Cards: 200px width, 160px height
- Spacing: 8px gap between cards
- Container: Full width with touch scroll
- Padding: 12px horizontal, 8px vertical

### Card Design Specifications

**Card Structure**:

```
┌─────────────────────────┐
│ Status Indicator        │
│ ┌─────────────────────┐ │
│ │   Preview/Icon      │ │
│ │                     │ │
│ └─────────────────────┘ │
│ Transformations List    │
│ • Resize: 800x600      │
│ • Grayscale            │
│ • Format: JPEG         │
│ Timestamp              │
│ Progress/Status        │
└─────────────────────────┘
```

**Visual States**:

- **Pending**: Gray border, loading spinner, opacity 0.7
- **In Progress**: Blue border, progress bar, pulse animation
- **Completed**: Green border, hover effects, full opacity
- **Failed**: Red border, error icon, opacity 0.8

### Responsive Behavior

**Breakpoints**:

- Desktop: ≥1024px
- Tablet: 768px - 1023px
- Mobile: <768px

**Scroll Indicators**:

- Fade gradients on container edges when content overflows
- Touch-friendly scroll behavior on mobile devices
- Keyboard navigation support for accessibility

## Error Handling

### API Error Scenarios

1. **Polling Failures**: Silent retry with exponential backoff (max 3 attempts)
2. **Authentication Errors**: Redirect to login page via global interceptor
3. **Not Found Errors**: Show appropriate empty state
4. **Server Errors**: Display user-friendly error message with manual refresh option
5. **Form Refresh Failures**: Automatic retry after 2 seconds, then manual refresh option

### Polling Error Handling

**Silent Error Strategy**: Polling errors are handled silently to avoid disrupting user experience during high-traffic periods when servers may be temporarily unavailable.

**Exponential Backoff**:

- 1st retry: 1 second delay
- 2nd retry: 2 second delay
- 3rd retry: 4 second delay
- After 3 failures: Stop polling, show manual refresh option

### Loading States

1. **Initial Load**: Skeleton cards with shimmer animation
2. **Refresh**: Overlay loading indicator without disrupting existing content
3. **Individual Updates**: In-place status updates without full re-render

### Error Recovery

- Automatic retry for transient network errors
- Manual refresh button for persistent issues
- Graceful degradation when transformation data is unavailable

## Testing Strategy

### Unit Tests

**TransformationsSection**:

- Renders correctly with different data states
- Handles loading and error states appropriately
- Manages horizontal scrolling behavior
- Responds to viewport changes

**TransformationCard**:

- Displays correct information for each transformation type
- Shows appropriate visual states based on status
- Handles click interactions correctly
- Renders responsive layouts properly

### Integration Tests

**API Integration**:

- Fetches transformation data correctly
- Handles API errors gracefully
- Updates data in real-time via polling
- Maintains data consistency

**Navigation Integration**:

- Card clicks navigate to correct result pages
- Maintains proper routing state
- Handles back navigation appropriately

### End-to-End Tests

**User Workflows**:

- View transformations on image detail page
- Scroll through multiple transformation cards
- Click completed transformations to view results
- Experience responsive behavior across devices

### Performance Considerations

**Optimization Strategies**:

- **Centralized Data Fetching**: Single API call instead of N individual calls
- **Smart Polling**: Only poll when incomplete tasks exist, pause when tab inactive
- **Efficient Updates**: React Query caching prevents unnecessary re-renders
- **Memoization**: Card components memoized to prevent re-renders on polling updates
- **Virtualization**: For very large transformation lists (100+ items)
- **Background Optimization**: Polling pauses when browser tab becomes inactive

**High-Volume Performance**:

- Designed for scenarios with many transformations per user
- Optimized for high server load with queued (pending) tasks
- Reduced API calls minimize server impact during peak usage
- Exponential backoff prevents polling storms during server issues

**Monitoring**:

- Track scroll performance metrics
- Monitor API response times
- Measure component render times
- Analyze user interaction patterns

## Implementation Notes

### Technology Integration

**Next.js App Router**:

- Client-side data fetching via React Query (no SSR for transformations)
- Centralized polling for real-time updates
- Cache invalidation for component coordination
- No optimistic updates - server-confirmed data only

**React Query Architecture**:

- Type-safe query key factory for consistency
- Automatic cache invalidation for form integration
- Smart polling with background pause
- Network request deduplication
- Exponential backoff for error handling

**Styling Approach**:

- Tailwind CSS for responsive design
- CSS Grid/Flexbox for card layouts
- CSS animations for status transitions
- Custom scrollbar styling for better UX

**State Management**:

- React Query for server state, caching, and component coordination
- Local component state for UI interactions
- Zustand integration for global app state

### Accessibility Considerations

- ARIA labels for transformation status
- Keyboard navigation support
- Screen reader compatibility
- High contrast mode support
- Focus management for scrollable content

### Browser Compatibility

- Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
- Progressive enhancement for older browsers
- Polyfills for CSS scroll-snap if needed
- Fallback layouts for unsupported features
