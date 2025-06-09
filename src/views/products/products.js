import logger from '../../lib/logger';
import { renderString } from 'nunjucks';
import page from './products.html?raw';
import rowProduct from './_products.html?raw';
import productService from '../../services/ProductService';

export default {
  renderHTML() {
    const content = document.querySelector("#content");
    if (content) {
      content.innerHTML = renderString(page, { products: [] });
    } else {
      logger.warn("Element with ID 'content' not found.");
    }
  },

  loadScript() {
    logger.debug("Setting up products page with search functionality...");

    const searchForm = document.getElementById('product-search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const title = event.target.title.value;
            const url = new URL(window.location.href);
            const queryParams = new URLSearchParams(url.search);
            queryParams.set('title', title);
            window.history.replaceState({}, '', `${url.pathname}?${queryParams}`);

            this.loadProducts();
        });
    }
    this.loadProducts();
    },

    loadProducts() {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const queryParams = Object.fromEntries(urlSearchParams.entries());

        productService.getAll(queryParams)
            .then(async (data) => {
                logger.debug("Products list API response OK");
                console.log(data)

                const delay = ms => new Promise(res => setTimeout(res, ms));
                await delay(1000);

                let productsFiltrados = data;
                if (queryParams.title) {
                    productsFiltrados = productsFiltrados.filter(x=>((x.title).toLowerCase()).includes((queryParams.title).toLowerCase()))
                }
                if (queryParams.category) {
                    productsFiltrados = productsFiltrados.filter(x=>x.category_id == queryParams.category)
                }
                if (queryParams.price_min) {
                    productsFiltrados = productsFiltrados.filter(x=> parseFloat(x.price) >= parseFloat(queryParams.price_min))
                }
                if (queryParams.price_max) {
                    productsFiltrados = productsFiltrados.filter(x=> parseFloat(x.price) <= parseFloat(queryParams.price_max))
                }
                if (queryParams.sort && queryParams.not_sold == "on") {
                    productsFiltrados = productsFiltrados.filter(x=> !x.confirmed)
                }
                if (queryParams.sort) {
                    productsFiltrados = productsFiltrados.sort((a, b) => new Date(a.created) - new Date(b.created));

                    if (queryParams.sort == "date_asc") {
                        productsFiltrados = productsFiltrados.sort((a, b) => new Date(a.created) - new Date(b.created));
                    } else if (queryParams.sort == "date_desc") {
                        productsFiltrados = productsFiltrados.sort((a, b) => new Date(b.created) - new Date(a.created));
                    } else if (queryParams.sort == "price_asc") {
                        productsFiltrados = productsFiltrados.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
                    } else if (queryParams.sort == "price_desc") {
                        productsFiltrados = productsFiltrados.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
                    }
                }

                const content = document.querySelector("#content");
                if (content) {
                    content.innerHTML = renderString(rowProduct, { 
                        products: productsFiltrados, 
                        base_url: process.env.UPLOAD_URL
                    });
                }
            })
    }
};
