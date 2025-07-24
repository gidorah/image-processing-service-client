import { vi } from "vitest";
import "@testing-library/jest-dom";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));
