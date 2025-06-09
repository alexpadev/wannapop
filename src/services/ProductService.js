class ProductService {
  async getAll(queryParams = {}) {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      throw new Error("API_URL environment variable is not defined.");
    }

    const url = new URL(`${apiUrl}/products`);
    Object.keys(queryParams).forEach(key => url.searchParams.append(key, queryParams[key]));

    const response = await fetch(url.toString(), {
      headers: {
        "Accept": "application/json"
      },
      method: "GET",
    });

    const data = await response.json();
    if (!data.success) throw new Error("Failed to fetch products.");
    return data.data;
  }

  async getOne(productId) {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      throw new Error("API_URL environment variable is not defined.");
    }

    const url = `${apiUrl}/products/${productId}`;
    
    const response = await fetch(url, {
      headers: {
        "Accept": "application/json"
      },
      method: "GET",
    });

    const data = await response.json();
    if (!data.success) throw new Error("Failed to fetch product.");
    
    return data.data;
  }
}

const productService = new ProductService();
export default productService;