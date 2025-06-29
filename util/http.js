import axios from "axios";

// ✅ Environment variables
const ENV = import.meta.env;

// ✅ Axios instance
const http = axios.create({
  baseURL: ENV.VITE_SERVER || "https://snap-pdf-backend.vercel.app", // fallback
  withCredentials: true, // send cookies if using auth tokens in cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Refresh token function
const refreshAccessToken = async () => {
  try {
    await http.get("/api/user/refresh-token");
    console.log("✅ Silent token refresh");
  } catch (err) {
    const message =
      err.response?.data?.message || err.message || "Token refresh failed";
    console.error("🔒 Periodic token refresh failed:", message);
    if (typeof logoutUser === "function") {
      logoutUser();
    } else {
      console.warn("⚠️ logoutUser function is not defined");
    }
  }
};

// ✅ Call refresh every 13 minutes
setInterval(refreshAccessToken, 13 * 60 * 1000); // 13 minutes

// ✅ Export axios instance
export default http;
