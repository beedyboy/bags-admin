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
    console.log({ refreshToken });
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    // Request a new access token using the refresh token
    const response = await axios.get(`${serverUrl}/api/accounts/refresh-token`, null, {
      headers: {
        Authorization: `Bearer ${refreshToken}`,
      },
    });

    const { accessToken } = response.data;

    // Save the new access token (or set it in a cookie)
    localStorage.setItem('access_token', accessToken); // Update localStorage
    document.cookie = `auth_token=${accessToken}; path=/; max-age=900`; // Example of saving token as cookie

    return accessToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    // Utils.logout(); // Redirect to login or handle accordingly
    throw error; // Re-throw to handle in the interceptor
  }
};


db.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { response } = error;

    if (response && response.status === 401) {
      try {
        const newAccessToken = await refreshToken();
        error.config.headers['Authorization'] = `Bearer ${newAccessToken}`;

        // Use the existing axios instance for the retry
        return db(error.config);
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        Utils.logout();
      }
    }

    return Promise.reject(error);
  }
);

export default db;
