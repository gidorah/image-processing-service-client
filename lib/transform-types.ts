export type Operation =
  | "crop"
  | "resize"
  | "rotate"
  | "apply_filter"
  | "watermark"
  | "flip"
  | "mirror";

export interface Transformation<T extends Operation, P = object> {
  operation: T;
  params?: P;
}

export type CropParams = {
  width: number;
  height: number;
  x: number;
  y: number;
};
export type ResizeParams = { width: number; height: number };
export type RotateParams = { degrees: number };
export type FilterParams = {
  grayscale?: boolean;
  sepia?: boolean;
  blur?: boolean;
};
export type WatermarkParams = { watermark_text: string };
