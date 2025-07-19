"use client";

import React from "react";
import TransformationCard, {
  TransformationCardSkeleton,
} from "./transformation-card";
import { TransformationTask } from "@/lib/types";

// Sample transformation tasks for demo
const sampleTasks: TransformationTask[] = [
  {
    id: 1,
    status: "SUCCESS",
    format: "jpeg",
    transformations: {
      resize: { width: 800, height: 600 },
      grayscale: true,
    },
    original_image: 1,
    result_image: 2,
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:35:00Z",
    error_message: null,
  },
  {
    id: 2,
    status: "IN_PROGRESS",
    format: "png",
    transformations: {
      resize: { width: 1200, height: 800 },
      blur: 5,
    },
    original_image: 1,
    result_image: null,
    created_at: "2024-01-15T11:00:00Z",
    updated_at: "2024-01-15T11:02:00Z",
    error_message: null,
  },
  {
    id: 3,
    status: "FAILED",
    format: "webp",
    transformations: {
      resize: { width: 2000, height: 1500 },
      quality: 90,
    },
    original_image: 1,
    result_image: null,
    created_at: "2024-01-15T09:45:00Z",
    updated_at: "2024-01-15T09:47:00Z",
    error_message: "Image processing failed: Invalid dimensions",
  },
  {
    id: 4,
    status: "PENDING",
    format: "jpeg",
    transformations: {
      grayscale: true,
      sepia: true,
    },
    original_image: 1,
    result_image: null,
    created_at: "2024-01-15T11:15:00Z",
    updated_at: "2024-01-15T11:15:00Z",
    error_message: null,
  },
  {
    id: 5,
    status: "CANCELLED",
    format: "png",
    transformations: {
      resize: { width: 500, height: 300 },
      rotate: 90,
    },
    original_image: 1,
    result_image: null,
    created_at: "2024-01-15T08:30:00Z",
    updated_at: "2024-01-15T08:32:00Z",
    error_message: null,
  },
];

export default function TransformationCardDemo() {
  const handleCardClick = (taskId: string) => {
    console.log("Card clicked:", taskId);
    // In real implementation, this would navigate to result page
  };

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">TransformationCard Component Demo</h2>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">All Status States</h3>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {sampleTasks.map((task) => (
            <TransformationCard
              key={task.id}
              task={task}
              onClick={handleCardClick}
              isClickable={task.status === "SUCCESS"}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Loading State</h3>
        <div className="flex gap-4 overflow-x-auto pb-4">
          <TransformationCardSkeleton />
          <TransformationCardSkeleton />
          <TransformationCardSkeleton />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Responsive Test</h3>
        <p className="text-muted-foreground text-sm">
          Resize your browser window to see responsive behavior
        </p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {sampleTasks.slice(0, 4).map((task) => (
            <TransformationCard
              key={task.id}
              task={task}
              onClick={handleCardClick}
              isClickable={task.status === "SUCCESS"}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
