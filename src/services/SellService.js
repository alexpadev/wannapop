
class OfferService {
  async acceptOffer(offerId, token) {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      throw new Error("API_URL environment variable is not defined.");
    }

    const url = `${apiUrl}/orders/${offerId}/confirmed`;

    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      },
      method: "POST",
    });

    const data = await response.json();
    if (!data.success) throw new Error("Failed to accept the offer.");
    
    return data;
  }

  async rejectOffer(offerId, token) {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      throw new Error("API_URL environment variable is not defined.");
    }

    const url = `${apiUrl}/orders/${offerId}/confirmed`;

    const response = await fetch(url, {
      headers: {
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      },
      method: "DELETE",
    });

    const data = await response.json();
    if (!data.success) throw new Error("Failed to reject the offer.");
    
    return data;
  }
}

const offerService = new OfferService();
export default offerService;