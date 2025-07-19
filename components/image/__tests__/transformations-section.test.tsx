import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TransformationsSection from "../transformations-section";
import { TransformationTask } from "@/lib/types";

// Mock transformation tasks for testing
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
  {
    id: 2,
    status: "IN_PROGRESS",
    format: "png",
    transformations: { resize: { width: 400, height: 300 } },
    original_image: 1,
    result_image: null,
    created_at: "2024-01-01T11:00:00Z",
    updated_at: "2024-01-01T11:02:00Z",
    error_message: null,
  },
  {
    id: 3,
    status: "FAILED",
    format: "webp",
    transformations: { blur: 5 },
    original_image: 1,
    result_image: null,
    created_at: "2024-01-01T12:00:00Z",
    updated_at: "2024-01-01T12:01:00Z",
    error_message: "Processing failed due to invalid parameters",
  },
];

describe("TransformationsSection", () => {
  it("renders loading state correctly", () => {
    render(
      <TransformationsSection
        imageId="1"
        transformations={[]}
        isLoading={true}
      />
    );

    expect(screen.getByText("Loading transformations...")).toBeInTheDocument();
    expect(screen.getByTestId("transformations-section")).toBeInTheDocument();
  });

  it("renders empty state when no transformations exist", () => {
    render(
      <TransformationsSection
        imageId="1"
        transformations={[]}
        isLoading={false}
      />
    );

    expect(
      screen.getByText("Transform your image to see processing tasks here")
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("transformations-empty-state")
    ).toBeInTheDocument();
    expect(screen.getByText("No transformations yet")).toBeInTheDocument();
  });

  it("renders transformations correctly", () => {
    render(
      <TransformationsSection
        imageId="1"
        transformations={mockTransformations}
        isLoading={false}
      />
    );

    expect(screen.getByText("3 transformations")).toBeInTheDocument();
    expect(screen.getAllByTestId("transformation-card")).toHaveLength(3);
  });

  it("calls onRefresh when refresh button is clicked", () => {
    const mockOnRefresh = vi.fn();

    render(
      <TransformationsSection
        imageId="1"
        transformations={mockTransformations}
        isLoading={false}
        onRefresh={mockOnRefresh}
      />
    );

    const refreshButton = screen.getByLabelText("Refresh transformations");
    fireEvent.click(refreshButton);

    expect(mockOnRefresh).toHaveBeenCalledTimes(1);
  });

  it("calls onCardClick when a completed transformation card is clicked", () => {
    const mockOnCardClick = vi.fn();

    render(
      <TransformationsSection
        imageId="1"
        transformations={mockTransformations}
        isLoading={false}
        onCardClick={mockOnCardClick}
      />
    );

    // Find the completed transformation card (SUCCESS status)
    const cards = screen.getAllByTestId("transformation-card");
    const completedCard = cards.find((card) =>
      card.textContent?.includes("Completed")
    );

    if (completedCard) {
      fireEvent.click(completedCard);
      expect(mockOnCardClick).toHaveBeenCalledWith("1");
    }
  });

  it("displays correct transformation count", () => {
    render(
      <TransformationsSection
        imageId="1"
        transformations={[mockTransformations[0]]}
        isLoading={false}
      />
    );

    expect(screen.getByText("1 transformation")).toBeInTheDocument();
  });

  it("disables refresh button when loading", () => {
    const mockOnRefresh = vi.fn();

    render(
      <TransformationsSection
        imageId="1"
        transformations={[]}
        isLoading={true}
        onRefresh={mockOnRefresh}
      />
    );

    const refreshButton = screen.getByLabelText("Refresh transformations");
    expect(refreshButton).toBeDisabled();
  });
});
