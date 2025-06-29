
import axios from "axios";

const ENV = import.meta.env

const http = axios.create({
    baseURL: ENV.VITE_SERVER,
    withCredentials: true
})


const refreshAccessToken = async () => {
  try {
    await http.get("/api/user/refresh-token"); // will use cookie
    console.log("✅ Silent token refresh");
  } catch (err) {
    console.error("🔒 Periodic token refresh failed:", err);
    logoutUser();
  }
};

setInterval(refreshAccessToken, 13 * 60 * 1000); // 14 minutes


export default http