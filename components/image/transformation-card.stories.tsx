import { Meta, StoryObj } from "@storybook/react";
import { TransformationCard } from ".";
import { Layout } from "lucide-react";
import { TransformationTask } from "@/lib/types";

const meta: Meta<typeof TransformationCard> = {
  title: "TransformationCard",
  component: TransformationCard,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const baseTask: TransformationTask = {
  id: 123,
  status: "PENDING",
  format: "jpeg",
  transformations: {
    resize: { width: 800, height: 600 },
    grayscale: true,
  },
  original_image: 456,
  result_image: null,
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  error_message: null,
};

export const Pending: Story = {
  args: {
    task: {
      ...baseTask,
      status: "PENDING",
    },
    isClickable: false,
  },
};

export const InProgress: Story = {
  args: {
    task: {
      ...baseTask,
      status: "IN_PROGRESS",
    },
    isClickable: false,
  },
};

export const Success: Story = {
  args: {
    task: {
      ...baseTask,
      status: "SUCCESS",
      result_image: 123,
    },
    isClickable: true,
  },
};

export const Failed: Story = {
  args: {
    task: {
      ...baseTask,
      status: "FAILED",
      error_message: "Image Processing Robots are Tired",
    },
    isClickable: false,
  },
};
