class UserService {
  async getAll(queryParams = {}) {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      throw new Error("API_URL environment variable is not defined.");
    }
  
    const url = new URL(`${apiUrl}/users`);
    Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));
  
    const response = await fetch(url.toString(), {
      headers: {
        "Accept": "application/json"
      },
      method: "GET",
    });
  
    const data = await response.json();
    if (!data.success) throw new Error("Failed to fetch users.");
  
    return data.data;
  }

  async getOne(userId) {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      throw new Error("API_URL environment variable is not defined.");
    }

    const url = `${apiUrl}/users/${userId}`;
    
    const response = await fetch(url, {
      headers: {
        "Accept": "application/json"
      },
      method: "GET",
    });

    const data = await response.json();
    if (!data.success) throw new Error("Failed to fetch user.");
    
    return data.data;
  }
}

const userService = new UserService();
export default userService;