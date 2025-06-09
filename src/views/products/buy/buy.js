import logger from '../../../lib/logger';
import flasher from '../../../lib/flasher';
import router from '../../../lib/router';
import { renderString } from 'nunjucks';
import page from './_buy.html?raw';
import page2 from './buy.html?raw';
import buyService from '../../../services/BuyService';

export default {
  renderHTML(productId) {
    const content = document.querySelector("#content");
    if (content) {
      content.innerHTML = renderString(page2);
    } else {
      logger.warn("Element with ID 'content' not found.");
    }
  },

  async loadScript() {
    let session = JSON.parse(sessionStorage.getItem("wannapop_session")) || {};
    const current_user = session.user || {};

    if (session.id == undefined) {
      router.navigateTo('/login', [["error", "Encara no has iniciat sessió!"]]);
      return;
    }

    try {
      const products = await buyService.getProductsToBuy(session.token);
      const content = document.querySelector("#content");
      if (content) {
        content.innerHTML = renderString(page, { 
          products: products, 
          base_url: process.env.UPLOAD_URL,
          current_user: current_user
        });
        const list = document.querySelector('#products');
        if (list) {
          logger.debug("#products table rendered successfully.");
        } else {
          logger.warn("Element with ID 'products' not found after rendering products.");
        }
      } else {
        logger.warn("Element with ID 'content' not found for re-rendering.");
      }
    } catch (error) {
      logger.error("Error loading products for purchase:", error);
      flasher.injectFlash(document.getElementById("flashObjective"), flasher.error("Error al cargar productos."))
    }
  }
};
