import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const signupSchema = z
  .object({
    email: z.string().email("Invalid email address"),
    password1: z.string().min(6),
    password2: z.string().min(6),
  })
  .refine((data) => data.password1 === data.password2, {
    message: "Passwords do not match",
    path: ["password2"],
  });

export type SignupInput = z.infer<typeof signupSchema>;

export const formatSchema = z.enum(["jpeg", "png"]);
export const cropParamsSchema = z.object({
  width: z.number().positive(),
  height: z.number().positive(),
  x: z.number().nonnegative(),
  y: z.number().nonnegative(),
});
export const resizeParamsSchema = cropParamsSchema.pick({
  width: true,
  height: true,
});
export const rotateParamsSchema = z.object({
  degrees: z.number().min(0).max(359),
});
export const filterParamsSchema = z.object({
  grayscale: z.boolean().optional(),
  sepia: z.boolean().optional(),
  blur: z.boolean().optional(),
});
export const watermarkParamsSchema = z.object({
  watermark_text: z.string().min(1),
});
export const transformationSchema = z.discriminatedUnion("operation", [
  z.object({ operation: z.literal("crop"), params: cropParamsSchema }),
  z.object({ operation: z.literal("resize"), params: resizeParamsSchema }),
  z.object({ operation: z.literal("rotate"), params: rotateParamsSchema }),
  z.object({
    operation: z.literal("apply_filter"),
    params: filterParamsSchema,
  }),
  z.object({
    operation: z.literal("watermark"),
    params: watermarkParamsSchema,
  }),
  z.object({ operation: z.literal("flip") }),
  z.object({ operation: z.literal("mirror") }),
]);
export const transformRequestSchema = z.object({
  format: formatSchema.optional(),
  transformations: z.array(transformationSchema).min(1),
});
export type Transformation = z.infer<typeof transformationSchema>;
export type TransformRequest = z.infer<typeof transformRequestSchema>;

/**
 * Structure of API schema is not compatible with React Hook From
 * or any other form library since request has an array of Transformations
 * and it is not possible to resolve changing transformations list correctly
 * with transformRequestSchema. So we created transformationFormSchema to
 * validate TransformationForm then on submit it converts into transformRequestSchema.
 */
export const transformationFormSchema = z.object({
  format: formatSchema,
  crop: z.object({
    active: z.boolean(),
    width: z.number().positive(),
    height: z.number().positive(),
    x: z.number().nonnegative(),
    y: z.number().nonnegative(),
  }),
  resize: z.object({
    active: z.boolean(),
    width: z.number().positive(),
    height: z.number().positive(),
  }),
  rotate: rotateParamsSchema
    .extend({
      active: z.boolean(),
    })
    .required(),
  filters: z.object({
    grayscale: z.boolean(),
    sepia: z.boolean(),
    blur: z.boolean(),
  }),
  watermark: watermarkParamsSchema.extend({
    watermark_text: z.string(),
  }),
  flip: z.boolean(),
  mirror: z.boolean(),
});

export type TransformationFormValues = z.infer<typeof transformationFormSchema>;
