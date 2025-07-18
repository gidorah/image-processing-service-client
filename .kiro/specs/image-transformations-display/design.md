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

1. **Initial Load**: Page component fetches image data and transformation tasks via API
2. **Real-time Updates**: Polling mechanism updates transformation statuses
3. **Form Integration**: Transformation form submission triggers automatic refresh of tasks list
4. **User Interaction**: Card clicks navigate to result pages
5. **Responsive Adaptation**: Layout adjusts based on viewport size

## Components and Interfaces

### TransformationsSection Component

**Purpose**: Main container component that orchestrates the transformations display

**Props**:

```typescript
interface TransformationsSectionProps {
  imageId: string;
  transformations: TransformationTask[];
  isLoading: boolean;
  onRefresh?: () => void;
}
```

**Responsibilities**:

- Manage loading states
- Handle empty state display
- Coordinate horizontal scrolling behavior
- Provide refresh functionality

### TransformationCard Component

**Purpose**: Individual card displaying transformation task information

**Props**:

```typescript
interface TransformationCardProps {
  task: TransformationTask;
  onClick?: (taskId: string) => void;
  isClickable: boolean;
}
```

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

### Form Integration Component

**Purpose**: Handles communication between transformation form and transformations list

**Design Rationale**: To satisfy Requirement 7, we need a mechanism to automatically refresh the transformations list when a new transformation is submitted. This is achieved through a callback-based approach that maintains loose coupling between the form and the transformations display.

**Integration Pattern**:

```typescript
interface FormIntegrationProps {
  onTransformationSubmitted: () => void;
}

// Usage in Image Detail Page
const handleTransformationSubmit = useCallback(() => {
  // Trigger refresh of transformations list
  refetchTransformations();
}, [refetchTransformations]);
```

**Key Features**:

- Automatic refresh trigger after successful form submission
- Scroll position preservation during refresh when possible
- Error handling for failed refresh attempts
- Optimistic updates for immediate user feedback

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

1. **Network Failures**: Display retry mechanism with exponential backoff
2. **Authentication Errors**: Redirect to login page
3. **Not Found Errors**: Show appropriate empty state
4. **Server Errors**: Display user-friendly error message with refresh option

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

- Lazy loading for transformation thumbnails
- Virtualization for large numbers of transformations
- Debounced polling to reduce API calls
- Memoization of card components to prevent unnecessary re-renders

**Monitoring**:

- Track scroll performance metrics
- Monitor API response times
- Measure component render times
- Analyze user interaction patterns

## Implementation Notes

### Technology Integration

**Next.js App Router**:

- Server-side rendering for initial transformation data
- Client-side updates via React Query
- Optimistic updates for better UX

**Styling Approach**:

- Tailwind CSS for responsive design
- CSS Grid/Flexbox for card layouts
- CSS animations for status transitions
- Custom scrollbar styling for better UX

**State Management**:

- React Query for server state and caching
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
