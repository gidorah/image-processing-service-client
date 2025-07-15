"use client";

import { TransformationTask } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, XIcon, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface TransformationTaskCardProps {
  task: TransformationTask;
  onViewResult?: (taskId: number) => void;
}

function TaskStatusBadge({ status }: { status: TransformationTask["status"] }) {
  switch (status) {
    case "PENDING":
      return (
        <Badge
          variant="outline"
          className="border-blue-200 bg-blue-50 text-blue-600 dark:border-blue-800 dark:bg-blue-950/20"
        >
          <Loader2 className="animate-spin" />
          Processing
        </Badge>
      );
    case "SUCCESS":
      return (
        <Badge
          variant="outline"
          className="border-green-200 bg-green-50 text-green-600 dark:border-green-800 dark:bg-green-950/20"
        >
          <CheckIcon />
          Complete
        </Badge>
      );
    case "FAILURE":
      return (
        <Badge variant="destructive">
          <XIcon />
          Failed
        </Badge>
      );
    default:
      return null;
  }
}

function formatTransformations(
  transformations: Record<string, unknown>
): string {
  if (!transformations || typeof transformations !== "object") {
    return "No transformations";
  }

  const transformationList = Object.entries(transformations)
    .map(([key, value]) => {
      // Handle different transformation formats
      if (key === "operation" && typeof value === "string") {
        return (
          value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " ")
        );
      }
      if (typeof value === "boolean" && value) {
        return key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");
      }
      if (typeof value === "object" && value !== null) {
        return key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, " ");
      }
      return null;
    })
    .filter(Boolean);

  return transformationList.length > 0
    ? transformationList.join(", ")
    : "Custom transformations";
}

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return "Invalid Date";
  }
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function TransformationTaskCard({
  task,
  onViewResult,
}: TransformationTaskCardProps) {
  const handleViewResult = () => {
    if (onViewResult && task.status === "SUCCESS" && task.result_image) {
      onViewResult(task.id);
    }
  };

  const getActionButton = () => {
    switch (task.status) {
      case "SUCCESS":
        return task.result_image ? (
          <Button size="sm" onClick={handleViewResult} className="w-full">
            View Result
          </Button>
        ) : null;
      case "FAILURE":
        return (
          <Button
            variant="outline"
            size="sm"
            className="w-full text-red-600 hover:text-red-700"
            disabled
          >
            Error Details
          </Button>
        );
      case "PENDING":
        return (
          <Button variant="outline" size="sm" className="w-full" disabled>
            Processing...
          </Button>
        );
      default:
        return null;
    }
  };

  return (
    <Card
      className={cn(
        "w-80 flex-shrink-0 transition-all duration-200",
        task.status === "SUCCESS" && "hover:shadow-md",
        task.status === "FAILURE" &&
          "border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20"
      )}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-base">
              {task.format.toUpperCase()} Image
            </CardTitle>
            <div className="mt-1">
              <TaskStatusBadge status={task.status} />
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Transformations
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formatTransformations(task.transformations)}
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Created
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {formatDate(task.created_at)}
          </p>
        </div>

        {task.status === "FAILURE" && task.error_message && (
          <div>
            <p className="text-sm font-medium text-red-700 dark:text-red-300">
              Error
            </p>
            <p className="text-sm break-words text-red-600 dark:text-red-400">
              {task.error_message}
            </p>
          </div>
        )}

        {getActionButton()}
      </CardContent>
    </Card>
  );
}
