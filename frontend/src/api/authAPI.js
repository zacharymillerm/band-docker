import { handleError, apiClient } from "../utils";

export const login = async (formdata) => {
  try {
    const response = await apiClient.post("/admin/login", formdata, {
      headers: { "Content-Type": "application/json" },
    });
    if (response.status !== 200)
      throw new Error(`Unexpected response status: ${response.status}`);

    const token = response.data.token;
    sessionStorage.setItem("token", token);
    return response.data;
  } catch (err) {
    handleError("Error logging in user:", err);
  }
};

export const logout = async () => {
  try {
    const token = sessionStorage.getItem("token");

    // Ensure token exists before proceeding
    if (!token) {
      console.warn("No token found, redirecting to login.");
      window.location.href = "/admin/login";
      return;
    }

    // Make logout API request
    const response = await apiClient.post("/admin/logout", null, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.status !== 200) {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (err) {
    console.error("Error logging out user:", err);
  } finally {
    // Cleanup & Redirect
    sessionStorage.removeItem("token");
    window.location.href = "/admin/login";
  }
};
