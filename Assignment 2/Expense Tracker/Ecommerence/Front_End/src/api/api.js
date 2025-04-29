const API_BASE_URL = "https://fakestoreapi.com"; // FakeStoreAPI

export const login = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Login failed" };
  }
};

export const register = async (username, password) => {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    return await response.json();
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Registration failed" };
  }
};

// Guest login (Placeholder for guest mode)
export const loginAsGuest = async () => {
  return { token: "guest_token", user: { username: "Guest" } };
};
