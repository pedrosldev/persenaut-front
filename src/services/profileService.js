const API_USER_PROFILE = import.meta.env.VITE_API_USER_PROFILE;

export const getProfile = async () => {
  try {
    const response = await fetch(`${API_USER_PROFILE}/profile`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error getting profile:", error);
    throw error;
  }
};

export const updateProfile = async (profileData) => {
  try {
    const response = await fetch(`${API_USER_PROFILE}/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(profileData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
};

export const changePassword = async (passwordData) => {
  try {
    const response = await fetch(`${API_USER_PROFILE}/change-password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(passwordData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error changing password:", error);
    throw error;
  }
};

export const deleteAccount = async (password) => {
  try {
    const response = await fetch(`${API_USER_PROFILE}/account`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `Error ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting account:", error);
    throw error;
  }
};
