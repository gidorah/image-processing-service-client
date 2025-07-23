/**
 * Query key factory for image-related queries.
 *
 * @example
 * ```typescript
 * // Get transformations for an image
 * const key = queryKeys.transformations(123);
 * // Get a specific transformation task
 * const taskKey = queryKeys.transformation(456);
 * ```
 */
export const queryKeys = {
  transformations: (imageId: number) => ["transformations", imageId] as const,
  imageTasks: (imageId: number) => ["imageTasks", imageId] as const,
  image: (imageId: number) => ["image", imageId] as const,
  transformation: (taskId: number) => ["transformation", taskId] as const,
};
