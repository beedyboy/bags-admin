import axios from "axios";
import Utils from "./shared/localStorage";

const env = {
  local: process.env.REACT_APP_LOCAL_URL,
  production: process.env.REACT_APP_PROD_URL,
  test: process.env.REACT_APP_TEST_URL,
};

const serverUrl = env.local || env.production || env.test;

// Create an Axios instance
const db = axios.create({
  baseURL: `${serverUrl}/api`,
  responseType: "json",
  timeout: 1000 * 50,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // Include credentials (cookies) in requests
});

// Helper function to refresh the token
const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem('refresh_token');

    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await axios.post(`${serverUrl}/api/account/refresh-token`, null, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    const { accessToken } = response.data;

    // Save the new access token (or set it in a cookie)
    document.cookie = `auth_token=${accessToken}; path=/; max-age=900`; // Example of saving token as cookie

    return accessToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    Utils.logout(); // Redirect to login or handle accordingly
    throw error; // Re-throw to handle in the interceptor
  }
};

// Add a response interceptor
db.interceptors.response.use(
  (response) => {
    // Any status code that lie within the range of 2xx cause this function to trigger
    return response;
  },
  async (error) => {
    // Any status codes that fall outside the range of 2xx cause this function to trigger
    const { response } = error;

    if (response && response.status === 401) {
      // Handle 401 Unauthorized errors
      try {
        // Attempt to refresh the token
        const newAccessToken = await refreshToken();

        // Update the Authorization header with the new token
        error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Retry the original request
        return axios(error.config);
      } catch (refreshError) {
        // Handle refresh error
        console.error('Error refreshing token:', refreshError);
        Utils.logout(); // Redirect to login or handle accordingly
      }
    }

    return Promise.reject(error); // Return any other error as is
  }
);

export default db;
