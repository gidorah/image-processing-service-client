import useAuthStore from "@/store/authStore";
import axios, { AxiosError } from "axios";
import { SourceImageType, TransformationTask, User } from "./types";
import { TransformRequest } from "./validators";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api",
  withCredentials: true,
});

/**
 * Response interceptor to handle authentication errors globally
 *
 * This interceptor catches 401 Unauthorized responses and automatically:
 * - Checks if the user is currently authenticated
 * - Logs them out by updating the auth store
 * - Redirects to the login page
 *
 * Only runs on the client side to avoid SSR issues with window.location
 */
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      console.log("401 Unauthorized on response interceptor: ", error.response);
      // Ensure we're on the client side before accessing browser APIs
      if (typeof window !== "undefined") {
        const { isAuthenticated } = useAuthStore.getState();

        // Only logout and redirect if user was previously authenticated
        // This prevents unnecessary redirects for unauthenticated requests
        if (isAuthenticated) {
          useAuthStore.setState({ isAuthenticated: false, user: null });
        }
      }
    }

    return Promise.reject(error);
  }
);

/**
 * Logs out the current user by sending a POST request to the logout endpoint
 *
 * This function calls the server's logout endpoint which typically:
 * - Invalidates the current session/token on the server
 * - Clears any server-side authentication state
 * - Returns a success response when logout is complete
 *
 * Note: The actual client-side logout (clearing auth store, redirecting)
 * is handled by the response interceptor when it receives a 401 response
 *
 * @returns {Promise<AxiosResponse>} Promise that resolves when logout request completes
 * @throws {AxiosError} If the logout request fails (network error, server error, etc.)
 */
export const logoutUser = () => api.post("/auth/logout/");

/**
 * Checks if the user is authenticated by making a GET request to the user endpoint
 *
 * @returns {Promise<AxiosResponse<User>>} Promise that resolves to the user data if authenticated, otherwise rejects with an error
 */
export const checkAuthStatus = () => api.get<User>("/auth/user/");

export const uploadImage = async (image: File): Promise<{ id: string }> => {
  const formData = new FormData();
  formData.append("file", image);
  formData.append("description", "TODO");

  const response = await api.post("/images/upload/", formData);

  return response.data;
};

/**
 * Fetches the details of a source image by its ID.
 *
 * @param {number} id - The ID of the source image to fetch.
 * @returns {Promise<SourceImageType>} A promise that resolves to the source image details.
 */
export const getSourceImageDetails = async (
  id: number
): Promise<SourceImageType> => {
  const response = await api.get(`/images/${id}/`);
  return response.data;
};

/**
 * Triggers a transformation task on API by posting
 * list transformations on the source image by its ID.
 * @param id - The ID of the source image to transformed.
 * @param data - Transformations that will be applied and output format.
 * @returns {Promise<TransformationTask>} - A promise that resolves to the created transformation task details.
 */

export const transformImage = async ({
  id,
  data,
}: {
  id: number;
  data: TransformRequest;
}): Promise<TransformationTask> => {
  const response = await api.post(`/images/${id}/transform/`, data);
  return response.data;
};

/**
 * Fetches all transformation tasks associated with a source image by its ID.
 * @param imageId - The ID of the source image to fetch transformations for.
 * @returns  {Promise<TransformationTask[]>} - A promise that resolves to an array of transformation tasks.
 */
export const getImageTransformations = async (
  imageId: number
): Promise<TransformationTask[]> => {
  const response = await api.get("/tasks/");
  const results = response.data.results as TransformationTask[];

  // Since tasks endpoint returns all tasks of user
  // we should filter them by source image
  return results.filter((task) => task.original_image === imageId);
};

/**
 * Fetches the details of a transformation task by its ID.
 * @param taskId - The ID of the transformation task to fetch.
 * @returns {Promise<TransformationTask>} - A promise that resolves to the transformation task details.
 */
export const getTransformationTask = async (
  taskId: number
): Promise<TransformationTask> => {
  const response = await api.get(`/tasks/${taskId}/`);
  return response.data;
};

export default api;
