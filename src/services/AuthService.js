class AuthService {
  async login(email, password) {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      throw new Error("API_URL environment variable is not defined.");
    }

    const credentials = btoa(`${email}:${password}`);
    const url = `${apiUrl}/tokens`;

    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "Authorization": `Basic ${credentials}`
      },
      method: "POST",
    });
    
    const data = await response.json();
    if (!data.success) throw new Error("Login failed.");
    
    return {
      token: data.data.token,
      id: data.data.id,
      email
    };
  }

  async logout(token) {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      throw new Error("API_URL environment variable is not defined.");
    }

    const url = `${apiUrl}/tokens`;

    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      },
      method: "DELETE",
    });

    const data = await response.json();
    if (!data.success) throw new Error("Logout failed.");

    return data;
  }
}

const authService = new AuthService();
export default authService;