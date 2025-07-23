"use client";

import React, { useCallback } from "react";
import TransformationCard, {
  TransformationCardSkeleton,
} from "./transformation-card";
import { Button } from "@/components/ui/button";
import { RefreshCw, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useInfiniteQuery } from "@tanstack/react-query";
import { getImageTransformationTasksById } from "@/lib/api";
import { useRouter } from "next/navigation";
import { queryKeys } from "@/lib/query-keys";
import { TransformationTask } from "@/lib/types";

interface TransformationsSectionProps {
  imageId: number;
  onFormSubmissionSuccess?: () => void;
}

/**
 * Main container component that displays transformation tasks in a horizontal scrollable layout
 * Handles loading states, empty states, and responsive behavior
 */
export default function TransformationsSection({
  imageId,
}: TransformationsSectionProps) {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery({
    queryKey: queryKeys.imageTasks(imageId),
    queryFn: ({ pageParam = undefined }: { pageParam?: string }) =>
      getImageTransformationTasksById({ imageId, pageParam }),
    getNextPageParam: (lastPage) => lastPage.next ?? null,
    refetchInterval: (query) => {
      // We only want to poll the first page for updates
      const firstPage = query.state.data?.pages[0];
      if (!firstPage) return false;

      const hasIncomplete = firstPage.results.some(
        (task: TransformationTask) =>
          task.status === "IN_PROGRESS" || task.status === "PENDING"
      );
      return hasIncomplete ? 2000 : false;
    },
    initialPageParam: undefined,
  });

  const handleRefresh = useCallback(async () => {
    try {
      await refetch();
    } catch (error) {
      console.error("Failed to refresh transformations: ", error);
    }
  }, [refetch]);

  const transformations = data?.pages.flatMap((page) => page.results) ?? [];
  const hasTransformations = transformations.length > 0;
  const showScrollIndicators = hasTransformations && transformations.length > 1;

  const router = useRouter();
  const handleCardClick = useCallback(
    (taskId: string) => {
      router.push(`/result/${taskId}`);
    },
    [router]
  );

  return (
    <section
      className="w-full"
      aria-label="Image transformations"
      data-testid="transformations-section"
    >
      {/* Section Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-foreground text-lg font-semibold md:text-xl">
            Transformations
          </h2>
          <p className="text-muted-foreground text-sm">
            {isLoading
              ? "Loading transformations..."
              : hasTransformations
                ? `${transformations.length} transformation${
                    transformations.length === 1 ? "" : "s"
                  }`
                : "Transform your image to see processing tasks here"}
          </p>
        </div>
        {isError && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="gap-2"
            aria-label="Refresh transformations"
          >
            <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            Refresh
          </Button>
        )}
      </div>

      {/* Transformations Container */}
      <div className="relative">
        {/* Scroll Indicators - Left */}
        {showScrollIndicators && (
          <div className="from-background pointer-events-none absolute top-0 left-0 z-10 h-full w-8 bg-gradient-to-r to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        )}

        {/* Scroll Indicators - Right */}
        {showScrollIndicators && (
          <div className="from-background pointer-events-none absolute top-0 right-0 z-10 h-full w-8 bg-gradient-to-l to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        )}

        {/* Scrollable Container */}
        <div
          className={cn(
            "group relative overflow-x-auto",
            // Custom scrollbar styling
            "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-muted-foreground/20 hover:scrollbar-thumb-muted-foreground/40",
            // Touch-friendly scrolling
            "scroll-smooth",
            // Snap scrolling for better UX
            "snap-x snap-mandatory"
          )}
          style={{
            // Ensure horizontal scrolling works on touch devices
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div
            className={cn(
              "flex gap-2 pb-4 md:gap-3 lg:gap-4",
              // Responsive padding
              "px-3 md:px-4 lg:px-6"
            )}
          >
            {/* Loading State */}
            {isLoading && !isFetchingNextPage && (
              <>
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="snap-start">
                    <TransformationCardSkeleton />
                  </div>
                ))}
              </>
            )}

            {/* Transformations List */}
            {!isLoading && hasTransformations && (
              <>
                {hasNextPage && (
                  <div className="snap-start">
                    <Button
                      onClick={() => fetchNextPage()}
                      disabled={isFetchingNextPage}
                    >
                      {isFetchingNextPage ? "Loading more..." : "Load More"}
                    </Button>
                  </div>
                )}
                {transformations.map((task) => (
                  <div key={task.id} className="snap-start">
                    <TransformationCard
                      task={task}
                      onClick={handleCardClick}
                      isClickable={task.status === "SUCCESS"}
                    />
                  </div>
                ))}
              </>
            )}

            {/* Empty State */}
            {!isLoading && !hasTransformations && (
              <div className="flex min-h-[200px] w-full items-center justify-center">
                <EmptyState onRefresh={handleRefresh} />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Empty state component displayed when no transformations exist
 */
function EmptyState({ onRefresh }: { onRefresh?: () => void }) {
  return (
    <div
      className="text-center"
      data-testid="transformations-empty-state"
      role="region"
      aria-label="No transformations available"
    >
      <div className="bg-muted/50 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full">
        <ImageIcon className="text-muted-foreground h-8 w-8" />
      </div>
      <h3 className="text-foreground mb-2 text-lg font-medium">
        No transformations yet
      </h3>
      <p className="text-muted-foreground mb-4 max-w-sm text-sm">
        Transform your image using the form above to see processing tasks appear
        here. You can track the status and access results once they&apos;re
        complete.
      </p>
      {onRefresh && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          className="gap-2"
        >
          <RefreshCw className="h-4 w-4" />
          Check for updates
        </Button>
      )}
    </div>
  );
}
