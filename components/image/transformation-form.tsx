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

const AccordionContentClasses = "m-3 flex flex-col gap-4";

function ParameterSlider(props: React.ComponentProps<typeof Slider>) {
  return (
    <div className="flex flex-col gap-4">
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

export default function TransformationForm() {
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
              <ParameterSlider title="Start Point X" id="x" />
              <ParameterSlider title="Start Point Y" id="y" />
              <ParameterSlider title="Width" id="width" />
              <ParameterSlider title="Height" id="height" />
              <ParameterSlider
                title="Scale"
                id="scale"
                min={0.2}
                max={5}
                step={0.2}
                defaultValue={[1]}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem className="h-fit" value="orientation">
            <AccordionTrigger>Orientation</AccordionTrigger>
            <AccordionContent className={AccordionContentClasses}>
              <ParameterSlider
                title="Rotation"
                id="rotate"
                min={0}
                max={359}
                step={1}
              />
              <ParameterSwitch title="Flip" id="flip" />
              <ParameterSwitch title="Mirror" id="mirror" />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem className="h-fit" value="filters">
            <AccordionTrigger>Filters</AccordionTrigger>
            <AccordionContent className={AccordionContentClasses}>
              <ParameterSwitch title="Grayscale" id="grayscale" />
              <ParameterSwitch title="Sepia" id="sepia" />
              <ParameterSwitch title="Blur" id="blur" />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem className="h-fit" value="watermark">
            <AccordionTrigger>Watermark</AccordionTrigger>
            <AccordionContent className={AccordionContentClasses}>
              <Label htmlFor="watermark-text">Text</Label>
              <Input id="watermark-text" type="text" />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <Button>Process Image</Button>
      </div>
    </div>
  );
}
