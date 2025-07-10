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
} from "@/lib/validators";
import { Control, UseFormWatch } from "react-hook-form";

const AccordionContentClasses = "m-3 flex flex-col gap-4";
const SectionClasses = "flex flex-col gap-4 group";

function ParameterSlider(props: React.ComponentProps<typeof Slider>) {
  return (
    <div className="group flex flex-col gap-4" data-disabled={props.disabled}>
      <Label htmlFor={props.id}>{props.title}</Label>
      <Slider className={cn("w-full")} {...props} />
    </div>
  );
}

function ParameterSwitch(props: React.ComponentProps<typeof Switch>) {
  return (
    <div className="flex flex-row gap-4">
      <Switch {...props} />
      <Label htmlFor={props.id}>{props.title}</Label>
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
        name="resize.scale"
        control={control}
        render={({ field }) => (
          <ParameterSlider
            title="Scale"
            id="scale"
            min={0.2}
            max={5}
            step={0.2}
            value={[field.value ?? 1]}
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

export default function TransformationForm() {
  const { control, watch } = useForm<TransformationFormValues>({
    resolver: zodResolver(transformationFormSchema),
  });

  return (
    <div>
      <div>
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
        <Button>Process Image</Button>
      </div>
    </div>
  );
}
