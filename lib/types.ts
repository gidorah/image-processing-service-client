/**
 * Represents the structure of a User object from the API.
 */
export interface User {
  id: number;
  email: string;
}

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
 * Represents a SourceImage from the API. It extends the base type.
 */
export interface SourceImageType extends BaseImageType {}

/**
 * Represents a TransformedImage from the API.
 */
export interface TransformedImageType extends BaseImageType {
  sourceImage: number;
  transformationTask: number;
}
