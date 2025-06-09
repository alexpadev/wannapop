class BuyService {
  async getProductsToBuy(token) {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      throw new Error("API_URL environment variable is not defined.");
    }

    const url = `${apiUrl}/products/buy`;

    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      },
      method: "GET",
    });

    const data = await response.json();
    if (!data.success) throw new Error("Failed to fetch products available for purchase.");

    return data.data;
  }
}

const buyService = new BuyService();
export default buyService;