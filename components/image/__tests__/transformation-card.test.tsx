import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TransformationCard, {
  TransformationCardSkeleton,
} from "../transformation-card";
import { TransformationTask } from "@/lib/types";

// Mock the lucide-react icons
vi.mock("lucide-react", () => ({
  Clock: () => <div data-testid="clock-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  XCircle: () => <div data-testid="x-circle-icon" />,
  AlertCircle: () => <div data-testid="alert-circle-icon" />,
  Loader2: () => <div data-testid="loader2-icon" />,
}));

const mockTask: TransformationTask = {
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
};

describe("TransformationCard", () => {
  it("renders successfully with basic task data", () => {
    render(<TransformationCard task={mockTask} isClickable={false} />);

    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("JPEG")).toBeInTheDocument();
    expect(screen.getByText("Transformations:")).toBeInTheDocument();
  });

  it("displays transformations correctly", () => {
    render(<TransformationCard task={mockTask} isClickable={false} />);

    expect(
      screen.getByText("• Resize: width: 800, height: 600")
    ).toBeInTheDocument();
    expect(screen.getByText("• Grayscale")).toBeInTheDocument();
  });

  it("handles click events when clickable", () => {
    const mockOnClick = vi.fn();

    render(
      <TransformationCard
        task={mockTask}
        onClick={mockOnClick}
        isClickable={true}
      />
    );

    const card = screen.getByRole("button");
    fireEvent.click(card);

    expect(mockOnClick).toHaveBeenCalledWith("1");
  });

  it("does not handle click events when not clickable", () => {
    const mockOnClick = vi.fn();

    render(
      <TransformationCard
        task={mockTask}
        onClick={mockOnClick}
        isClickable={false}
      />
    );

    const card = screen.getByTestId("transformation-card");
    fireEvent.click(card);

    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it("displays different status states correctly", () => {
    const pendingTask = { ...mockTask, status: "PENDING" as const };
    const { rerender } = render(
      <TransformationCard task={pendingTask} isClickable={false} />
    );

    expect(screen.getByText("Pending")).toBeInTheDocument();
    expect(screen.getByTestId("clock-icon")).toBeInTheDocument();

    const inProgressTask = { ...mockTask, status: "IN_PROGRESS" as const };
    rerender(<TransformationCard task={inProgressTask} isClickable={false} />);

    expect(screen.getByText("Processing")).toBeInTheDocument();
    expect(screen.getByTestId("loader2-icon")).toBeInTheDocument();

    const failedTask = {
      ...mockTask,
      status: "FAILED" as const,
      error_message: "Processing failed",
    };
    rerender(<TransformationCard task={failedTask} isClickable={false} />);

    expect(screen.getByText("Failed")).toBeInTheDocument();
    expect(screen.getByText("Processing failed")).toBeInTheDocument();
    expect(screen.getByTestId("x-circle-icon")).toBeInTheDocument();
  });

  it("handles keyboard navigation when clickable", () => {
    const mockOnClick = vi.fn();

    render(
      <TransformationCard
        task={mockTask}
        onClick={mockOnClick}
        isClickable={true}
      />
    );

    const card = screen.getByRole("button");
    fireEvent.keyDown(card, { key: "Enter" });

    expect(mockOnClick).toHaveBeenCalledWith("1");

    fireEvent.keyDown(card, { key: " " });

    expect(mockOnClick).toHaveBeenCalledTimes(2);
  });
});

describe("TransformationCardSkeleton", () => {
  it("renders skeleton loading state", () => {
    render(<TransformationCardSkeleton />);

    // Check that skeleton elements are present by looking for the skeleton class
    const skeletons = document.querySelectorAll('[data-slot="skeleton"]');
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
