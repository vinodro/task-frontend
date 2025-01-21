import axios, {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  AxiosRequestHeaders,
  AxiosHeaders,
} from "axios";

// Extend AxiosRequestConfig to add the _retry property
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean; // Optional _retry property
  headers: AxiosRequestHeaders; // Ensure headers are always of type AxiosRequestHeaders
}

const axiosInstance: AxiosInstance = axios.create({
  baseURL:
    process.env.REACT_APP_BACKEND_URL ||
    "https://task-backend-eaqu.onrender.com", // Change to your backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Function to refresh the access token
const refreshAccessToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    const response = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/auth/refresh-token` ||
        "https://task-backend-eaqu.onrender.com/auth/refresh-token",
      {
        refreshToken,
      }
    );
    const { accessToken } = response.data;

    // Store the new access token
    localStorage.setItem("accessToken", accessToken);
    return accessToken;
  } catch (error) {
    console.error("Error refreshing access token:", error);
    throw error;
  }
};

// Request interceptor to add token to the headers
axiosInstance.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      // Ensure headers are set properly, using AxiosHeaders if undefined
      if (!config.headers) {
        config.headers = new AxiosHeaders(); // Initialize headers with AxiosHeaders
      }
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration and retry requests
axiosInstance.interceptors.response.use(
  (response) => response, // Return the response if successful
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // Check if originalRequest is defined and the error is a 401 (Unauthorized)
    if (
      originalRequest &&
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      // Avoid retrying the login request
      if (originalRequest.url?.includes("/auth/login")) {
        return Promise.reject(error); // Reject the error for login
      }

      originalRequest._retry = true;

      try {
        // Try to refresh the access token
        const newAccessToken = await refreshAccessToken();

        // Set the new token in the request headers
        if (!originalRequest.headers) {
          originalRequest.headers = new AxiosHeaders(); // Initialize headers with AxiosHeaders
        }
        originalRequest.headers.set(
          "Authorization",
          `Bearer ${newAccessToken}`
        );

        // Retry the original request with the new token
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Handle refresh token failure (e.g., log out user)
        console.error("Refresh token failed:", refreshError);
        // Optionally, redirect to login page or logout
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error); // Reject the error if it's not a token issue
  }
);

export default axiosInstance;
