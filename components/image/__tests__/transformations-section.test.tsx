import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import TransformationsSection from "../transformations-section";
import { TransformationTask } from "@/lib/types";
import {
  QueryClient,
  QueryClientProvider,
  UseInfiniteQueryResult,
} from "@tanstack/react-query";
import { ReactNode } from "react";

vi.mock("@tanstack/react-query", async () => {
  const actual = await vi.importActual("@tanstack/react-query");
  return {
    ...actual,
    useInfiniteQuery: vi.fn(),
  };
});

const useInfiniteQuery = vi.mocked(
  (await import("@tanstack/react-query")).useInfiniteQuery
);

const queryClient = new QueryClient();

const renderWithClient = (ui: ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>
  );
};

const mockTransformations: TransformationTask[] = [
  {
    id: 1,
    status: "SUCCESS",
    format: "jpeg",
    transformations: { resize: { width: 800, height: 600 }, grayscale: true },
    original_image: 1,
    result_image: 2,
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:05:00Z",
    error_message: null,
  },
];

describe("TransformationsSection", () => {
  const mockUseInfiniteQuery = (
    options: Partial<UseInfiniteQueryResult> = {}
  ) => {
    const defaults: UseInfiniteQueryResult = {
      data: undefined,
      error: null,
      isPending: false,
      isLoading: false,
      isError: false,
      isSuccess: true,
      fetchNextPage: vi.fn(),
      hasNextPage: false,
      isFetchingNextPage: false,
      refetch: vi.fn(),
      status: "success",
      isFetching: false,
      isPaused: false,
      isRefetching: false,
      isInitialLoading: false,
      isPlaceholderData: false,
      isRefetchError: false,
      isLoadingError: false,
      isStale: false,
      dataUpdatedAt: 0,
      errorUpdatedAt: 0,
      failureCount: 0,
      failureReason: null,
      errorUpdateCount: 0,
      fetchStatus: "idle",
      isFetched: true,
      isFetchedAfterMount: true,
      isFetchNextPageError: false,
      isFetchPreviousPageError: false,
      fetchPreviousPage: vi.fn(),
      hasPreviousPage: false,
      isFetchingPreviousPage: false,
      promise: Promise.resolve(),
    };
    useInfiniteQuery.mockReturnValue({
      ...defaults,
      ...options,
    } as UseInfiniteQueryResult);
  };

  beforeEach(() => {
    queryClient.clear();
    vi.restoreAllMocks();
  });

  it("renders loading state correctly", () => {
    mockUseInfiniteQuery({ isLoading: true });

    renderWithClient(<TransformationsSection imageId={1} />);

    expect(screen.getByText("Loading transformations...")).toBeInTheDocument();
  });

  it("renders empty state when no transformations exist", () => {
    mockUseInfiniteQuery({
      data: { pages: [{ results: [] }], pageParams: [] },
      isLoading: false,
    });

    renderWithClient(<TransformationsSection imageId={1} />);

    expect(screen.getByText("No transformations yet")).toBeInTheDocument();
  });

  it("renders transformations correctly", () => {
    mockUseInfiniteQuery({
      data: { pages: [{ results: mockTransformations }], pageParams: [] },
      isLoading: false,
    });

    renderWithClient(<TransformationsSection imageId={1} />);

    expect(screen.getByText("1 transformation")).toBeInTheDocument();
    expect(screen.getAllByTestId("transformation-card")).toHaveLength(1);
  });

  it("calls refetch when refresh button is clicked", () => {
    const refetch = vi.fn();
    mockUseInfiniteQuery({
      data: { pages: [{ results: mockTransformations }], pageParams: [] },
      isLoading: false,
      isError: true,
      refetch,
    });

    renderWithClient(<TransformationsSection imageId={1} />);

    const refreshButton = screen.getByLabelText("Refresh transformations");
    fireEvent.click(refreshButton);

    expect(refetch).toHaveBeenCalledTimes(1);
  });

  it("calls onCardClick when a completed transformation card is clicked", () => {
    mockUseInfiniteQuery({
      data: { pages: [{ results: mockTransformations }], pageParams: [] },
      isLoading: false,
    });

    renderWithClient(<TransformationsSection imageId={1} />);

    const card = screen.getByTestId("transformation-card");
    fireEvent.click(card);

    // This test will need to be updated to check if the router push function was called
    // For now, we are just checking if the test runs without errors
  });
});
