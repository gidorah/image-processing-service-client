"use client";

import React from "react";
import { TransformationTask } from "@/lib/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";

interface TransformationCardProps {
  task: TransformationTask;
  onClick?: (taskId: string) => void;
  isClickable: boolean;
}

/**
 * Parses transformation parameters into a readable format
 * Handles different value types dynamically to support any transformation type
 */
const parseTransformations = (
  transformations: Record<string, unknown>
): string[] => {
  return Object.entries(transformations)
    .map(([key, value]) => {
      // Capitalize the transformation name
      const displayName = key.charAt(0).toUpperCase() + key.slice(1);

      // Handle different value types dynamically
      if (typeof value === "boolean") {
        return value ? displayName : null; // Only show if true
      } else if (typeof value === "object" && value !== null) {
        // For complex objects, show key properties
        const props = Object.entries(value as Record<string, unknown>)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", ");
        return `${displayName}: ${props}`;
      } else {
        return `${displayName}: ${value}`;
      }
    })
    .filter(Boolean) as string[]; // Remove null values
};

/**
 * Formats timestamp to a readable format
 */
const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Gets status configuration including icon, color, and label
 */
const getStatusConfig = (status: TransformationTask["status"]) => {
  switch (status) {
    case "PENDING":
      return {
        icon: Clock,
        label: "Pending",
        badgeVariant: "outline" as const,
        cardClass: "opacity-70 border-muted-foreground/20",
      };
    case "IN_PROGRESS":
      return {
        icon: Loader2,
        label: "Processing",
        badgeVariant: "default" as const,
        cardClass:
          "border-blue-200 bg-blue-50/50 dark:border-blue-800 dark:bg-blue-950/20",
        animated: true,
      };
    case "SUCCESS":
      return {
        icon: CheckCircle,
        label: "Completed",
        badgeVariant: "default" as const,
        cardClass:
          "border-green-200 bg-green-50/50 dark:border-green-800 dark:bg-green-950/20 hover:shadow-md transition-shadow",
      };
    case "FAILED":
      return {
        icon: XCircle,
        label: "Failed",
        badgeVariant: "destructive" as const,
        cardClass:
          "opacity-80 border-red-200 bg-red-50/50 dark:border-red-800 dark:bg-red-950/20",
      };
    case "CANCELLED":
      return {
        icon: AlertCircle,
        label: "Cancelled",
        badgeVariant: "secondary" as const,
        cardClass:
          "opacity-80 border-yellow-200 bg-yellow-50/50 dark:border-yellow-800 dark:bg-yellow-950/20",
      };
    default:
      return {
        icon: Clock,
        label: "Unknown",
        badgeVariant: "outline" as const,
        cardClass: "opacity-70",
      };
  }
};

export default function TransformationCard({
  task,
  onClick,
  isClickable,
}: TransformationCardProps) {
  const statusConfig = getStatusConfig(task.status);
  const StatusIcon = statusConfig.icon;
  const transformationsList = parseTransformations(task.transformations);

  const handleClick = () => {
    if (isClickable && onClick && task.result_image) {
      onClick(task.result_image.toString());
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (isClickable && (event.key === "Enter" || event.key === " ")) {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <Card
      data-testid="transformation-card"
      className={cn(
        // Base styles
        "h-[160px] w-[200px] md:h-[180px] md:w-[240px] lg:h-[200px] lg:w-[280px]",
        "flex cursor-default flex-col transition-all duration-200",
        // Status-specific styles
        statusConfig.cardClass,
        // Clickable styles
        isClickable &&
          "focus:ring-ring cursor-pointer focus:ring-2 focus:ring-offset-2 focus:outline-none",
        // Animation for in-progress
        statusConfig.animated && "animate-pulse"
      )}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={isClickable ? 0 : -1}
      role={isClickable ? "button" : undefined}
      aria-label={
        isClickable
          ? `View results for ${statusConfig.label.toLowerCase()} transformation`
          : undefined
      }
    >
      <CardHeader className="px-3 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <Badge variant={statusConfig.badgeVariant} className="text-xs">
            <StatusIcon
              className={cn("h-3 w-3", statusConfig.animated && "animate-spin")}
            />
            {statusConfig.label}
          </Badge>
          <span className="text-muted-foreground text-xs">
            {task.format.toUpperCase()}
          </span>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col justify-between px-3 pb-3">
        {/* Transformations List */}
        <div className="flex-1 space-y-1">
          <h4 className="text-foreground mb-1 text-sm font-medium">
            Transformations:
          </h4>
          <div className="space-y-0.5">
            {transformationsList.length > 0 ? (
              transformationsList.slice(0, 3).map((transformation, index) => (
                <div
                  key={index}
                  className="text-muted-foreground truncate text-xs"
                  title={transformation}
                >
                  • {transformation}
                </div>
              ))
            ) : (
              <div className="text-muted-foreground text-xs">
                • No transformations
              </div>
            )}
            {transformationsList.length > 3 && (
              <div className="text-muted-foreground text-xs">
                • +{transformationsList.length - 3} more
              </div>
            )}
          </div>
        </div>

        {/* Progress Bar for In-Progress */}
        {task.status === "IN_PROGRESS" && (
          <div className="mt-2 mb-2">
            <Progress value={undefined} className="h-1" />
          </div>
        )}

        {/* Error Message for Failed */}
        {task.status === "FAILED" && task.error_message && (
          <div className="mt-2 mb-2">
            <p
              className="truncate text-xs text-red-600 dark:text-red-400"
              title={task.error_message}
            >
              {task.error_message}
            </p>
          </div>
        )}

        {/* Timestamp */}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-muted-foreground text-xs">
            {formatTimestamp(task.created_at)}
          </span>
          {isClickable && <span className="text-primary text-xs">View →</span>}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Skeleton component for loading states
 */
export function TransformationCardSkeleton() {
  return (
    <Card className="flex h-[160px] w-[200px] flex-col md:h-[180px] md:w-[240px] lg:h-[200px] lg:w-[280px]">
      <CardHeader className="px-3 pt-3 pb-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-8" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col justify-between px-3 pb-3">
        <div className="flex-1 space-y-1">
          <Skeleton className="mb-1 h-4 w-24" />
          <div className="space-y-0.5">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
        <div className="mt-2 flex items-center justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-8" />
        </div>
      </CardContent>
    </Card>
  );
}
