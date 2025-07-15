import { describe, it, expect, vi, beforeEach } from "vitest";
import { TransformationTask } from "../types";

// Mock axios and create a mock instance
const mockAxiosInstance = {
  get: vi.fn(),
  post: vi.fn(),
  interceptors: {
    response: {
      use: vi.fn(),
    },
  },
};

// Mock axios.create to return our mock instance
vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => mockAxiosInstance),
  },
}));

// Mock the auth store
vi.mock("@/store/authStore", () => ({
  default: {
    getState: () => ({ isAuthenticated: true, user: null }),
    setState: vi.fn(),
  },
}));

// Import the functions after mocking
const { getImageTransformationTasks, getTransformationTask } = await import(
  "../api"
);

describe("API Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getImageTransformationTasks", () => {
    const mockTasks: TransformationTask[] = [
      {
        id: 1,
        status: "SUCCESS",
        format: "jpeg",
        transformations: { operation: "resize" },
        original_image: 123,
        result_image: 456,
        created_at: "2024-01-01T00:00:00Z",
        updated_at: "2024-01-01T00:01:00Z",
        error_message: null,
      },
      {
        id: 2,
        status: "PENDING",
        format: "png",
        transformations: { operation: "grayscale" },
        original_image: 123,
        result_image: null,
        created_at: "2024-01-01T00:02:00Z",
        updated_at: "2024-01-01T00:02:00Z",
        error_message: null,
      },
      {
        id: 3,
        status: "FAILURE",
        format: "webp",
        transformations: { operation: "blur" },
        original_image: 456, // Different image ID
        result_image: null,
        created_at: "2024-01-01T00:03:00Z",
        updated_at: "2024-01-01T00:03:00Z",
        error_message: "Processing failed",
      },
    ];

    it("should fetch and filter transformation tasks for a specific image", async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: mockTasks });

      const result = await getImageTransformationTasks(123);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/tasks/");
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe(1);
      expect(result[1].id).toBe(2);
      expect(result.every((task) => task.original_image === 123)).toBe(true);
    });

    it("should handle paginated response format", async () => {
      const paginatedResponse = {
        results: mockTasks,
        count: 3,
        next: null,
        previous: null,
      };
      mockAxiosInstance.get.mockResolvedValue({ data: paginatedResponse });

      const result = await getImageTransformationTasks(123);

      expect(result).toHaveLength(2);
      expect(result.every((task) => task.original_image === 123)).toBe(true);
    });

    it("should handle single object response", async () => {
      const singleTask = mockTasks[0];
      mockAxiosInstance.get.mockResolvedValue({ data: singleTask });

      const result = await getImageTransformationTasks(123);

      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(singleTask);
    });

    it("should handle empty response", async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: [] });

      const result = await getImageTransformationTasks(123);

      expect(result).toHaveLength(0);
    });

    it("should handle invalid response format", async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: null });

      const result = await getImageTransformationTasks(123);

      expect(result).toHaveLength(0);
    });

    it("should throw error when API request fails", async () => {
      const error = new Error("Network error");
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(getImageTransformationTasks(123)).rejects.toThrow(
        "Network error"
      );
    });
  });

  describe("getTransformationTask", () => {
    const mockTask: TransformationTask = {
      id: 1,
      status: "SUCCESS",
      format: "jpeg",
      transformations: { operation: "resize" },
      original_image: 123,
      result_image: 456,
      created_at: "2024-01-01T00:00:00Z",
      updated_at: "2024-01-01T00:01:00Z",
      error_message: null,
    };

    it("should fetch a specific transformation task by ID", async () => {
      mockAxiosInstance.get.mockResolvedValue({ data: mockTask });

      const result = await getTransformationTask(1);

      expect(mockAxiosInstance.get).toHaveBeenCalledWith("/tasks/1/");
      expect(result).toEqual(mockTask);
    });

    it("should throw error when task is not found", async () => {
      const error = new Error("Task not found");
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(getTransformationTask(999)).rejects.toThrow(
        "Task not found"
      );
    });

    it("should throw error when API request fails", async () => {
      const error = new Error("Server error");
      mockAxiosInstance.get.mockRejectedValue(error);

      await expect(getTransformationTask(1)).rejects.toThrow("Server error");
    });
  });
});
