"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getTransformationTask,
  getSourceImageDetails,
  getTransformedImage,
} from "@/lib/api";
import { queryKeys } from "@/lib/query-keys";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Download,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function ResultPage({
  params,
}: {
  params: Promise<{ taskId: string }>;
}) {
  const { taskId } = React.use(params);
  const router = useRouter();
  const taskIdNumber = parseInt(taskId, 10);

  // Fetch transformation task details
  const {
    data: task,
    isLoading: taskLoading,
    error: taskError,
  } = useQuery({
    queryKey: queryKeys.transformation(taskIdNumber),
    queryFn: () => getTransformationTask(taskIdNumber),
    enabled: !isNaN(taskIdNumber),
  });

  // Fetch original image details
  const { data: originalImage, isLoading: originalImageLoading } = useQuery({
    queryKey: queryKeys.image(task?.original_image || 0),
    queryFn: () => getSourceImageDetails(task!.original_image),
    enabled: !!task?.original_image,
  });

  // Fetch transformed image details (only if task is successful and has result_image)
  const { data: transformedImage, isLoading: transformedImageLoading } =
    useQuery({
      queryKey: ["transformedImage", task?.result_image],
      queryFn: () => getTransformedImage(task!.result_image!),
      enabled: !!task?.result_image && task.status === "SUCCESS",
    });

  const handleBackClick = () => {
    if (task?.original_image) {
      router.push(`/image/${task.original_image}`);
    } else {
      router.back();
    }
  };

  const handleDownload = async (imageUrl: string, fileName: string) => {
    try {
      const link = document.createElement("a");
      link.href = imageUrl;
      link.download = fileName;
      link.target = "_blank";
      link.rel = "noopener noreferrer";

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback: open image in new tab if download fails
      window.open(imageUrl, "_blank", "noopener,noreferrer");
    }
  };

  // Parse transformations for display
  const parseTransformations = (
    transformations: Record<string, unknown>
  ): string[] => {
    return Object.entries(transformations)
      .map(([key, value]) => {
        const displayName = key.charAt(0).toUpperCase() + key.slice(1);
        if (typeof value === "boolean") {
          return value ? displayName : null;
        } else if (typeof value === "object" && value !== null) {
          const props = Object.entries(value as Record<string, unknown>)
            .map(([k, v]) => `${k}: ${v}`)
            .join(", ");
          return `${displayName}: ${props}`;
        } else {
          return `${displayName}: ${value}`;
        }
      })
      .filter(Boolean) as string[];
  };

  // Get status configuration
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          icon: Clock,
          label: "Pending",
          variant: "outline" as const,
          color: "text-muted-foreground",
        };
      case "IN_PROGRESS":
        return {
          icon: Loader2,
          label: "Processing",
          variant: "default" as const,
          color: "text-blue-600",
          animated: true,
        };
      case "SUCCESS":
        return {
          icon: CheckCircle,
          label: "Completed",
          variant: "default" as const,
          color: "text-green-600",
        };
      case "FAILED":
        return {
          icon: XCircle,
          label: "Failed",
          variant: "destructive" as const,
          color: "text-red-600",
        };
      case "CANCELLED":
        return {
          icon: AlertCircle,
          label: "Cancelled",
          variant: "secondary" as const,
          color: "text-yellow-600",
        };
      default:
        return {
          icon: Clock,
          label: "Unknown",
          variant: "outline" as const,
          color: "text-muted-foreground",
        };
    }
  };

  // Loading state
  if (taskLoading) {
    return (
      <div className="container mx-auto max-w-6xl p-4">
        <div className="mb-6">
          <Skeleton className="h-10 w-48" />
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="aspect-video w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="aspect-video w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Error state
  if (taskError || !task) {
    return (
      <div className="container mx-auto max-w-4xl p-4">
        <div className="text-center">
          <XCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
          <h1 className="mb-2 text-2xl font-bold">Transformation Not Found</h1>
          <p className="text-muted-foreground mb-4">
            The transformation task you're looking for doesn&apos;t exist or you
            don&apos;t have permission to view it.
          </p>
          <Button onClick={() => router.push("/dashboard")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  const statusConfig = getStatusConfig(task.status);
  const StatusIcon = statusConfig.icon;
  const transformationsList = parseTransformations(task.transformations);

  return (
    <div className="container mx-auto max-w-6xl p-4">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackClick}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Transformation Result</h1>
            <p className="text-muted-foreground">Task #{task.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={statusConfig.variant} className="gap-1">
            <StatusIcon
              className={cn("h-3 w-3", statusConfig.animated && "animate-spin")}
            />
            {statusConfig.label}
          </Badge>
        </div>
      </div>

      {/* Task Details */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Transformation Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div>
              <h4 className="mb-1 font-medium">Format</h4>
              <p className="text-muted-foreground text-sm">
                {task.format.toUpperCase()}
              </p>
            </div>
            <div>
              <h4 className="mb-1 font-medium">Created</h4>
              <p className="text-muted-foreground text-sm">
                {new Date(task.created_at).toLocaleString()}
              </p>
            </div>
            <div>
              <h4 className="mb-1 font-medium">Updated</h4>
              <p className="text-muted-foreground text-sm">
                {new Date(task.updated_at).toLocaleString()}
              </p>
            </div>
          </div>

          {transformationsList.length > 0 && (
            <div className="mt-4">
              <h4 className="mb-2 font-medium">Applied Transformations</h4>
              <div className="flex flex-wrap gap-2">
                {transformationsList.map((transformation, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {transformation}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {task.error_message && (
            <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 dark:border-red-800 dark:bg-red-950/20">
              <h4 className="mb-1 font-medium text-red-800 dark:text-red-200">
                Error Message
              </h4>
              <p className="text-sm text-red-600 dark:text-red-400">
                {task.error_message}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Images Comparison */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Original Image */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Original Image
              {originalImage && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleDownload(originalImage.file, originalImage.fileName)
                  }
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {originalImageLoading ? (
              <Skeleton className="aspect-video w-full" />
            ) : originalImage ? (
              <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                <Image
                  src={originalImage.file}
                  alt={originalImage.fileName || "Original Image"}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="bg-muted flex aspect-video w-full items-center justify-center rounded-md">
                <p className="text-muted-foreground">
                  Original image not available
                </p>
              </div>
            )}
            {originalImage && (
              <div className="text-muted-foreground mt-2 text-sm">
                <p>{originalImage.fileName}</p>
                {originalImage.description && (
                  <p>{originalImage.description}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transformed Image */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Transformed Image
              {transformedImage && task.status === "SUCCESS" && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    handleDownload(
                      transformedImage.file,
                      transformedImage.fileName
                    )
                  }
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {task.status === "SUCCESS" ? (
              transformedImageLoading ? (
                <Skeleton className="aspect-video w-full" />
              ) : transformedImage ? (
                <div className="relative aspect-video w-full overflow-hidden rounded-md border">
                  <Image
                    src={transformedImage.file}
                    alt={transformedImage.fileName || "Transformed Image"}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </div>
              ) : (
                <div className="bg-muted flex aspect-video w-full items-center justify-center rounded-md">
                  <p className="text-muted-foreground">
                    Transformed image not available
                  </p>
                </div>
              )
            ) : task.status === "IN_PROGRESS" || task.status === "PENDING" ? (
              <div className="bg-muted flex aspect-video w-full flex-col items-center justify-center rounded-md">
                <Loader2 className="text-muted-foreground mb-2 h-8 w-8 animate-spin" />
                <p className="text-muted-foreground">
                  Processing in progress...
                </p>
              </div>
            ) : (
              <div className="bg-muted flex aspect-video w-full flex-col items-center justify-center rounded-md">
                <XCircle className="mb-2 h-8 w-8 text-red-500" />
                <p className="text-muted-foreground">Transformation failed</p>
              </div>
            )}
            {transformedImage && (
              <div className="text-muted-foreground mt-2 text-sm">
                <p>{transformedImage.fileName}</p>
                {transformedImage.description && (
                  <p>{transformedImage.description}</p>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
