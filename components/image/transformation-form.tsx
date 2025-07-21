"use client";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "../ui/accordion";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  transformationFormSchema,
  TransformationFormValues,
  TransformRequest,
  Transformation,
} from "@/lib/validators";
import { Control, UseFormWatch } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { transformImage } from "@/lib/api";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/lib/query-keys";

const AccordionContentClasses = "m-3 flex flex-col gap-4";
const SectionClasses = "flex flex-col gap-4 group";

function ParameterSlider({
  title,
  ...props
}: Omit<React.ComponentProps<typeof Slider>, "title"> & { title: string }) {
  return (
    <div className="group flex flex-col gap-4" data-disabled={props.disabled}>
      <Label htmlFor={props.id}>{title}</Label>
      <Slider className={cn("w-full")} {...props} />
    </div>
  );
}

function ParameterSwitch({
  title,
  ...props
}: Omit<React.ComponentProps<typeof Switch>, "title"> & { title: string }) {
  return (
    <div className="flex flex-row gap-4">
      <Switch {...props} />
      <Label htmlFor={props.id}>{title}</Label>
    </div>
  );
}

interface SectionProps {
  control: Control<TransformationFormValues>;
  watch: UseFormWatch<TransformationFormValues>;
}

function CropSection({ control, watch }: SectionProps) {
  const isCropSectionActive = watch("crop.active");

  return (
    <div className={SectionClasses}>
      <Controller
        name="crop.active"
        control={control}
        render={({ field }) => (
          <ParameterSwitch
            title="Cropping"
            id="crop-active"
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        )}
      />
      <Controller
        name="crop.x"
        control={control}
        render={({ field }) => (
          <ParameterSlider
            title="Start Point X"
            id="x"
            value={[field.value ?? 0]}
            onValueChange={(value) => field.onChange(value[0])}
            disabled={!isCropSectionActive}
          />
        )}
      />
      <Controller
        name="crop.y"
        control={control}
        render={({ field }) => (
          <ParameterSlider
            title="Start Point Y"
            id="y"
            value={[field.value ?? 0]}
            onValueChange={(value) => field.onChange(value[0])}
            disabled={!isCropSectionActive}
          />
        )}
      />
      <Controller
        name="crop.width"
        control={control}
        render={({ field }) => (
          <ParameterSlider
            title="Width"
            id="width"
            value={[field.value ?? 0]}
            onValueChange={(value) => field.onChange(value[0])}
            disabled={!isCropSectionActive}
          />
        )}
      />
      <Controller
        name="crop.height"
        control={control}
        render={({ field }) => (
          <ParameterSlider
            title="Height"
            id="height"
            value={[field.value ?? 0]}
            onValueChange={(value) => field.onChange(value[0])}
            disabled={!isCropSectionActive}
          />
        )}
      />
    </div>
  );
}

function ScaleSection({ control, watch }: SectionProps) {
  const isResizeActive = watch("resize.active");
  return (
    <div className={SectionClasses}>
      <Controller
        name="resize.active"
        control={control}
        render={({ field }) => (
          <ParameterSwitch
            title="Resizing"
            id="resize-active"
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        )}
      />
      <Controller
        name="resize.width"
        control={control}
        render={({ field }) => (
          <ParameterSlider
            title="Width"
            id="resize-width"
            value={[field.value ?? 0]}
            onValueChange={(value) => field.onChange(value[0])}
            disabled={!isResizeActive}
          />
        )}
      />
      <Controller
        name="resize.height"
        control={control}
        render={({ field }) => (
          <ParameterSlider
            title="Height"
            id="resize-height"
            value={[field.value ?? 0]}
            onValueChange={(value) => field.onChange(value[0])}
            disabled={!isResizeActive}
          />
        )}
      />
    </div>
  );
}

function OrientationSection({ control, watch }: SectionProps) {
  const isRotateActive = watch("rotate.active");
  return (
    <div className={SectionClasses}>
      <Controller
        name="rotate.active"
        control={control}
        render={({ field }) => (
          <ParameterSwitch
            title="Rotation"
            id="rotate-active"
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        )}
      />
      <Controller
        name="rotate.degrees"
        control={control}
        render={({ field }) => (
          <ParameterSlider
            title="Angle"
            id="angle"
            min={0}
            max={359}
            step={1}
            value={[field.value ?? 0]}
            onValueChange={(value) => field.onChange(value[0])}
            disabled={!isRotateActive}
          />
        )}
      />
      <Controller
        name="flip"
        control={control}
        render={({ field }) => (
          <ParameterSwitch
            title="Flip"
            id="flip"
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        )}
      />
      <Controller
        name="mirror"
        control={control}
        render={({ field }) => (
          <ParameterSwitch
            title="Mirror"
            id="mirror"
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        )}
      />
    </div>
  );
}

function FiltersSection({ control }: SectionProps) {
  return (
    <div className={SectionClasses}>
      <Controller
        name="filters.grayscale"
        control={control}
        render={({ field }) => (
          <ParameterSwitch
            title="Grayscale"
            id="grayscale"
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        )}
      />
      <Controller
        name="filters.sepia"
        control={control}
        render={({ field }) => (
          <ParameterSwitch
            title="Sepia"
            id="sepia"
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        )}
      />
      <Controller
        name="filters.blur"
        control={control}
        render={({ field }) => (
          <ParameterSwitch
            title="Blur"
            id="blur"
            checked={field.value}
            onCheckedChange={field.onChange}
          />
        )}
      />
    </div>
  );
}

function buildTransformationRequest(
  formData: TransformationFormValues
): TransformRequest {
  const transformations: Transformation[] = [];

  if (formData.crop.active) {
    const crop: Transformation = {
      operation: "crop",
      params: {
        x: formData.crop.x,
        y: formData.crop.y,
        width: formData.crop.width,
        height: formData.crop.height,
      },
    };
    transformations.push(crop);
  }

  if (formData.resize.active) {
    const resize: Transformation = {
      operation: "resize",
      params: {
        width: formData.resize.width,
        height: formData.resize.height,
      },
    };
    transformations.push(resize);
  }

  if (formData.rotate.active) {
    const rotate: Transformation = {
      operation: "rotate",
      params: {
        degrees: formData.rotate.degrees,
      },
    };
    transformations.push(rotate);
  }

  if (
    formData.filters.blur ||
    formData.filters.grayscale ||
    formData.filters.sepia
  ) {
    const filter: Transformation = {
      operation: "apply_filter",
      params: {
        grayscale: formData.filters.grayscale ?? undefined,
        blur: formData.filters.blur ?? undefined,
        sepia: formData.filters.sepia ?? undefined,
      },
    };
    transformations.push(filter);
  }

  if (formData.watermark.watermark_text) {
    const watermark: Transformation = {
      operation: "watermark",
      params: {
        watermark_text: formData.watermark.watermark_text,
      },
    };
    transformations.push(watermark);
  }

  if (formData.flip) {
    transformations.push({ operation: "flip" });
  }

  if (formData.mirror) {
    transformations.push({ operation: "mirror" });
  }

  const transformRequest: TransformRequest = {
    format: formData.format ?? undefined,
    transformations,
  };
  console.log("Transform Form Data:", formData);
  console.log("Transform Request:", transformRequest);

  return transformRequest;
}

/**
 * TransformationForm component for submitting image transformation requests.
 *
 * @description This component handles image transformation form submission and automatically
 * coordinates with other components through React Query cache invalidation.
 *
 * **Side Effects:**
 * - On successful form submission, invalidates the transformations query cache
 * - This triggers automatic refresh in any component using the same query key
 * - Specifically affects TransformationsSection component on the same page
 *
 * **Dependencies:**
 * - Requires React Query context (QueryClient) to be available
 * - Uses queryKeys.transformations(imageId) for cache coordination
 * - Affects any component querying transformations for the same imageId
 *
 * **Cache Coordination:**
 * - Query Key: ['transformations', imageId]
 * - Invalidation triggers: Successful transformation submission
 * - Affected components: TransformationsSection, any other transformation list components
 *
 * @param props - Component props
 * @param props.imageId - The ID of the image to transform
 *
 * @example
 * ```tsx
 * // This form will automatically refresh transformation lists on the same page
 * <TransformationForm imageId={123} />
 * ```
 */
export default function TransformationForm({ imageId }: { imageId: number }) {
  const {
    control,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<TransformationFormValues>({
    resolver: zodResolver(transformationFormSchema),
    defaultValues: {
      format: "jpeg",
      crop: {
        active: false,
        width: 512,
        height: 512,
        x: 0,
        y: 0,
      },
      resize: {
        active: false,
        width: 512,
        height: 512,
      },
      rotate: {
        active: false,
        degrees: 0,
      },
      filters: {
        grayscale: false,
        sepia: false,
        blur: false,
      },
      watermark: {
        watermark_text: "",
      },
      flip: false,
      mirror: false,
    },
  });

  if (errors && Object.keys(errors).length > 0) {
    console.log("Form Errors:", errors);
  }

  const queryClient = useQueryClient();

  const { mutate: processImage, isPending } = useMutation({
    mutationFn: transformImage,
    onSuccess: () => {
      try {
        queryClient.invalidateQueries({
          queryKey: queryKeys.transformations(imageId),
        });
        toast.success("Transformation submitted successfully!");
      } catch (error) {
        console.error("Cache invalidation failed:", error);
        toast.success(
          "Transformation submitted! Please refresh the page to see the new transformation in the list."
        );
      }
    },
    onError: (error) => {
      toast.error(
        `Transform Image Failed: ${error instanceof Error ? error.message : "An unexpected error occurred"}`
      );
    },
  });

  function onSubmit(formData: TransformationFormValues) {
    const requestData = buildTransformationRequest(formData);

    processImage({ id: imageId, data: requestData });
  }

  return (
    <div>
      <div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Accordion
            className="w-2xs"
            type="single"
            defaultValue="sizing"
            collapsible
          >
            <AccordionItem className="h-fit" value="sizing">
              <AccordionTrigger>Sizing</AccordionTrigger>
              <AccordionContent className={AccordionContentClasses}>
                <CropSection control={control} watch={watch} />
                <ScaleSection control={control} watch={watch} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem className="h-fit" value="orientation">
              <AccordionTrigger>Orientation</AccordionTrigger>
              <AccordionContent className={AccordionContentClasses}>
                <OrientationSection control={control} watch={watch} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem className="h-fit" value="filters">
              <AccordionTrigger>Filters</AccordionTrigger>
              <AccordionContent className={AccordionContentClasses}>
                <FiltersSection control={control} watch={watch} />
              </AccordionContent>
            </AccordionItem>
            <AccordionItem className="h-fit" value="watermark">
              <AccordionTrigger>Watermark</AccordionTrigger>
              <AccordionContent className={AccordionContentClasses}>
                <Label htmlFor="watermark-text">Text</Label>
                <Controller
                  name="watermark.watermark_text"
                  control={control}
                  render={({ field }) => (
                    <Input
                      id="watermark-text"
                      type="text"
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                    />
                  )}
                />
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Processing..." : "Process Image"}
          </Button>
        </form>
      </div>
    </div>
  );
}
