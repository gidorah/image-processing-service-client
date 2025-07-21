/**
 * Query key factory for image-related queries.
 *
 * @example
 * ```typescript
 * // Get transformations for an image
 * const key = queryKeys.transformations(123);
 * ```
 */
export const queryKeys = {
  transformations: (imageId: number) => ["transformations", imageId] as const,
  image: (imageId: number) => ["image", imageId] as const,
};
