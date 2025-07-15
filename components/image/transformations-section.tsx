"use client";

import { useQuery, useQueries, type Query } from "@tanstack/react-query";
import { getImageTransformationTasks, getTransformationTask } from "@/lib/api";
import TransformationTaskCard from "./transformation-task-card";
import { Loader2 } from "lucide-react";
import { TransformationTask } from "@/lib/types";
import { useMemo } from "react";
import { useRouter } from "next/navigation";

interface TransformationsSectionProps {
  imageId: number;
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-gray-100 p-3 dark:bg-gray-800">
        <svg
          className="h-6 w-6 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
        No transformations yet
      </h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        Apply transformations to this image to see them here.
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="flex items-center space-x-2">
        <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
        <span className="text-sm text-gray-500 dark:text-gray-400">
          Loading transformations...
        </span>
      </div>
    </div>
  );
}

function ErrorState({ error }: { error: Error }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
        <svg
          className="h-6 w-6 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
        Failed to load transformations
      </h3>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
        {error.message ||
          "An error occurred while fetching transformation tasks."}
      </p>
    </div>
  );
}

export default function TransformationsSection({
  imageId,
}: TransformationsSectionProps) {
  const router = useRouter();

  // Initial fetch of all transformation tasks for the image
  const {
    data: initialTasks,
    isLoading: isLoadingInitial,
    error: initialError,
  } = useQuery({
    queryKey: ["image-transformation-tasks", imageId],
    queryFn: () => getImageTransformationTasks(imageId),
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  // Create polling queries for each pending task
  const pendingTaskIds = useMemo(() => {
    if (!initialTasks) return [];
    return initialTasks
      .filter((task) => task.status === "PENDING")
      .map((task) => task.id);
  }, [initialTasks]);

  // Use useQueries to poll individual pending tasks
  const pollingQueries = useQueries({
    queries: pendingTaskIds.map((taskId) => ({
      queryKey: ["transformation-task", taskId],
      queryFn: () => getTransformationTask(taskId),
      refetchInterval: (
        query: Query<
          TransformationTask,
          Error,
          TransformationTask,
          readonly unknown[]
        >
      ) => {
        // Only poll if status is still PENDING
        return query.state.data?.status === "PENDING" ? 2000 : false;
      },
      refetchIntervalInBackground: true,
      retry: (failureCount: number) => {
        // Exponential backoff: retry up to 3 times with increasing delays
        return failureCount < 3;
      },
      retryDelay: (attemptIndex: number) => {
        // Exponential backoff: 1s, 2s, 4s
        return Math.pow(2, attemptIndex) * 1000;
      },
      staleTime: 0, // Always consider polling data stale to ensure fresh updates
    })),
  });

  // Merge initial tasks with polled task updates
  const mergedTasks = useMemo(() => {
    if (!initialTasks) return [];

    const polledTasksMap = new Map<number, TransformationTask>();
    pollingQueries.forEach((query) => {
      if (query.data) {
        polledTasksMap.set(query.data.id, query.data);
      }
    });

    // Replace initial tasks with polled versions if available
    return initialTasks.map((task) => {
      const polledTask = polledTasksMap.get(task.id);
      return polledTask || task;
    });
  }, [initialTasks, pollingQueries]);

  // Check if any polling queries have errors
  const pollingErrors = pollingQueries
    .filter((query) => query.error)
    .map((query) => query.error);

  const handleViewResult = (taskId: number) => {
    // Navigate to the result page for the specific task
    router.push(`/result/${taskId}`);
  };

  if (isLoadingInitial) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Transformations
        </h2>
        <LoadingState />
      </div>
    );
  }

  if (initialError) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Transformations
        </h2>
        <ErrorState error={initialError as Error} />
      </div>
    );
  }

  if (!mergedTasks || mergedTasks.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
          Transformations
        </h2>
        <EmptyState />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
        Transformations
      </h2>
      {pollingErrors.length > 0 && (
        <div className="rounded-md bg-yellow-50 p-3 dark:bg-yellow-900/20">
          <div className="text-sm text-yellow-700 dark:text-yellow-300">
            Some tasks may not be updating in real-time due to connection
            issues.
          </div>
        </div>
      )}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {mergedTasks.map((task) => (
          <TransformationTaskCard
            key={task.id}
            task={task}
            onViewResult={handleViewResult}
          />
        ))}
      </div>
    </div>
  );
}
