import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TransformationTaskCard from "../transformation-task-card";
import { TransformationTask } from "@/lib/types";

describe("TransformationTaskCard", () => {
  const baseMockTask: TransformationTask = {
    id: 1,
    status: "SUCCESS",
    format: "jpeg",
    transformations: { operation: "resize" },
    original_image: 123,
    result_image: 456,
    created_at: "2024-01-01T12:00:00Z",
    updated_at: "2024-01-01T12:01:00Z",
    error_message: null,
  };

  describe("Task Status Display", () => {
    it("should display SUCCESS status with correct styling", () => {
      const task = { ...baseMockTask, status: "SUCCESS" as const };
      render(<TransformationTaskCard task={task} />);

      const badge = screen.getByText("Complete");
      expect(badge).toBeInTheDocument();
      expect(badge.closest(".border-green-200")).toBeInTheDocument();
    });

    it("should display PENDING status with loading spinner", () => {
      const task = { ...baseMockTask, status: "PENDING" as const };
      render(<TransformationTaskCard task={task} />);

      const badge = screen.getByText("Processing");
      expect(badge).toBeInTheDocument();
      expect(badge.closest(".border-blue-200")).toBeInTheDocument();

      // Check for loading spinner
      const spinner = document.querySelector(".animate-spin");
      expect(spinner).toBeInTheDocument();
    });

    it("should display FAILURE status with error styling", () => {
      const task = {
        ...baseMockTask,
        status: "FAILURE" as const,
        error_message: "Processing failed",
      };
      render(<TransformationTaskCard task={task} />);

      const badge = screen.getByText("Failed");
      expect(badge).toBeInTheDocument();

      // Check for error message display
      expect(screen.getByText("Processing failed")).toBeInTheDocument();
    });
  });

  describe("Task Information Display", () => {
    it("should display task format correctly", () => {
      const task = { ...baseMockTask, format: "png" };
      render(<TransformationTaskCard task={task} />);

      expect(screen.getByText("PNG Image")).toBeInTheDocument();
    });

    it("should display formatted transformations", () => {
      const task = {
        ...baseMockTask,
        transformations: { operation: "resize" },
      };
      render(<TransformationTaskCard task={task} />);

      expect(screen.getByText("Resize")).toBeInTheDocument();
    });

    it("should handle complex transformations", () => {
      const task = {
        ...baseMockTask,
        transformations: {
          operation: "resize",
          grayscale: true,
          blur: { radius: 5 },
        },
      };
      render(<TransformationTaskCard task={task} />);

      const transformationsText = screen.getByText(/Resize/);
      expect(transformationsText).toBeInTheDocument();
    });

    it("should display formatted creation date", () => {
      const task = { ...baseMockTask, created_at: "2024-01-15T14:30:00Z" };
      render(<TransformationTaskCard task={task} />);

      // The exact format may vary based on locale, but should contain date elements
      expect(screen.getByText(/Jan|15|2:30|PM/)).toBeInTheDocument();
    });

    it("should handle invalid date gracefully", () => {
      const task = { ...baseMockTask, created_at: "invalid-date" };
      render(<TransformationTaskCard task={task} />);

      expect(screen.getByText("Invalid Date")).toBeInTheDocument();
    });
  });

  describe("Action Buttons", () => {
    it('should display "View Result" button for successful tasks with result image', () => {
      const mockOnViewResult = vi.fn();
      const task = {
        ...baseMockTask,
        status: "SUCCESS" as const,
        result_image: 456,
      };
      render(
        <TransformationTaskCard task={task} onViewResult={mockOnViewResult} />
      );

      const button = screen.getByText("View Result");
      expect(button).toBeInTheDocument();
      expect(button).not.toBeDisabled();
    });

    it('should not display "View Result" button for successful tasks without result image', () => {
      const task = {
        ...baseMockTask,
        status: "SUCCESS" as const,
        result_image: null,
      };
      render(<TransformationTaskCard task={task} />);

      expect(screen.queryByText("View Result")).not.toBeInTheDocument();
    });

    it('should display "Error Details" button for failed tasks', () => {
      const task = {
        ...baseMockTask,
        status: "FAILURE" as const,
        error_message: "Processing failed",
      };
      render(<TransformationTaskCard task={task} />);

      const button = screen.getByText("Error Details");
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });

    it('should display "Processing..." button for pending tasks', () => {
      const task = { ...baseMockTask, status: "PENDING" as const };
      render(<TransformationTaskCard task={task} />);

      const button = screen.getByText("Processing...");
      expect(button).toBeInTheDocument();
      expect(button).toBeDisabled();
    });

    it('should call onViewResult when "View Result" button is clicked', () => {
      const mockOnViewResult = vi.fn();
      const task = {
        ...baseMockTask,
        status: "SUCCESS" as const,
        result_image: 456,
      };
      render(
        <TransformationTaskCard task={task} onViewResult={mockOnViewResult} />
      );

      const button = screen.getByText("View Result");
      fireEvent.click(button);

      expect(mockOnViewResult).toHaveBeenCalledWith(1);
    });

    it("should not call onViewResult for tasks without result image", () => {
      const mockOnViewResult = vi.fn();
      const task = {
        ...baseMockTask,
        status: "SUCCESS" as const,
        result_image: null,
      };
      render(
        <TransformationTaskCard task={task} onViewResult={mockOnViewResult} />
      );

      // No button should be rendered
      expect(screen.queryByText("View Result")).not.toBeInTheDocument();
      expect(mockOnViewResult).not.toHaveBeenCalled();
    });
  });

  describe("Card Styling", () => {
    it("should apply hover styling for successful tasks", () => {
      const task = { ...baseMockTask, status: "SUCCESS" as const };
      render(<TransformationTaskCard task={task} />);

      const card = screen.getByText("JPEG Image").closest(".hover\\:shadow-md");
      expect(card).toBeInTheDocument();
    });

    it("should apply error styling for failed tasks", () => {
      const task = {
        ...baseMockTask,
        status: "FAILURE" as const,
        error_message: "Processing failed",
      };
      render(<TransformationTaskCard task={task} />);

      const card = screen.getByText("JPEG Image").closest(".border-red-200");
      expect(card).toBeInTheDocument();
    });

    it("should have fixed width for consistent layout", () => {
      render(<TransformationTaskCard task={baseMockTask} />);

      const card = screen.getByText("JPEG Image").closest(".w-80");
      expect(card).toBeInTheDocument();
    });
  });

  describe("Error Message Display", () => {
    it("should display error message for failed tasks", () => {
      const task = {
        ...baseMockTask,
        status: "FAILURE" as const,
        error_message: "Custom error message",
      };
      render(<TransformationTaskCard task={task} />);

      expect(screen.getByText("Error")).toBeInTheDocument();
      expect(screen.getByText("Custom error message")).toBeInTheDocument();
    });

    it("should not display error section for successful tasks", () => {
      const task = { ...baseMockTask, status: "SUCCESS" as const };
      render(<TransformationTaskCard task={task} />);

      expect(screen.queryByText("Error")).not.toBeInTheDocument();
    });

    it("should not display error section for pending tasks", () => {
      const task = { ...baseMockTask, status: "PENDING" as const };
      render(<TransformationTaskCard task={task} />);

      expect(screen.queryByText("Error")).not.toBeInTheDocument();
    });
  });

  describe("Transformation Formatting", () => {
    it("should handle empty transformations object", () => {
      const task = { ...baseMockTask, transformations: {} };
      render(<TransformationTaskCard task={task} />);

      expect(screen.getByText("Custom transformations")).toBeInTheDocument();
    });

    it("should handle null transformations", () => {
      const task = { ...baseMockTask, transformations: null as any };
      render(<TransformationTaskCard task={task} />);

      expect(screen.getByText("No transformations")).toBeInTheDocument();
    });

    it("should format operation names correctly", () => {
      const task = {
        ...baseMockTask,
        transformations: { operation: "resize_and_crop" },
      };
      render(<TransformationTaskCard task={task} />);

      expect(screen.getByText("Resize and crop")).toBeInTheDocument();
    });

    it("should handle boolean transformation flags", () => {
      const task = {
        ...baseMockTask,
        transformations: { grayscale: true, sepia: false },
      };
      render(<TransformationTaskCard task={task} />);

      expect(screen.getByText("Grayscale")).toBeInTheDocument();
      expect(screen.queryByText("Sepia")).not.toBeInTheDocument();
    });
  });
});
