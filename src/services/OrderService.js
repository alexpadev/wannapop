const OrderService = {
  makeOffer(productID, offerPrice, token) {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      throw new Error("API_URL environment variable is not defined.");
    }

    const url = `${apiUrl}/orders`;

    return fetch(url, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        product_id: productID,
        offer: offerPrice
      }),
      method: "POST",
    }).then(response => response.json());
  },

  updateOffer(orderID, offerPrice, token) {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      throw new Error("API_URL environment variable is not defined.");
    }

    const url = `${apiUrl}/orders/${orderID}`;

    return fetch(url, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ offer: offerPrice }),
      method: "PUT",
    }).then(response => response.json());
  },

  deleteOffer(orderID, token) {
    const apiUrl = process.env.API_URL;
    if (!apiUrl) {
      throw new Error("API_URL environment variable is not defined.");
    }

    const url = `${apiUrl}/orders/${orderID}`;

    return fetch(url, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      method: "DELETE",
    }).then(response => response.json());
  }
};

export default OrderService;