import http from "./http";

const fetcher = async (url) => {
  try {
    const { data } = await http.get(url);
    return data;
  } catch (err) {
    // Agar backend se response mila hai
    if (err.response) {
      throw new Error(err.response.data?.message || "Server Error");
    } else if (err.request) {
      throw new Error("No response from server");
    } else {
      throw new Error(err.message || "Request failed");
    }
  }
};

export default fetcher;
