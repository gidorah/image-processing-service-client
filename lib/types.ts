/**
 * Represents the structure of a User object from the API.
 */
export interface User {
  id: number;
  email: string;
}

/**
 * Represents the structure of an Image Metadata.
 * TODO: Could be detailed later
 */
export type Metadata = Record<string, unknown>;

/**
 * The base interface for all image types, corresponding to the BaseImage model.
 */
export interface BaseImageType {
  id: number;
  owner: number;
  file: string;
  fileName: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Represents a SourceImage from the API. It "could" extend base type in the future.
 */
export type SourceImageType = BaseImageType;

/**
 * Represents a TransformedImage from the API.
 */
export interface TransformedImageType extends BaseImageType {
  sourceImage: number;
  transformationTask: number;
}

/**
 * Represents a TransformationTask from the API.
 */
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
