import logger from '../../lib/logger';
import flasher from '../../lib/flasher';
import { renderString } from 'nunjucks';
import page from './users.html?raw';
import rowUser from './_users.html?raw';
import userService from '../../services/UserService';

export default {
  renderHTML() {
    const content = document.querySelector("#content");
    if (content) {
      content.innerHTML = renderString(page, { users: [] });
    } else {
      logger.warn("Element with ID 'content' not found.");
    }
  },

  loadScript() {
    logger.debug("Setting up users page with search functionality...");

    const searchForm = document.getElementById('user-search-form');
    if (searchForm) {
      searchForm.addEventListener('submit', (event) => {
        event.preventDefault();

        const name = event.target.name.value;
        const url = new URL(window.location.href);
        const queryParams = new URLSearchParams(url.search);
        queryParams.set('name', name);
        window.history.replaceState({}, '', `${url.pathname}?${queryParams}`);

        this.loadUsers();
      });
    }

    this.loadUsers();
  },

  loadUsers() {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const queryParams = Object.fromEntries(urlSearchParams.entries());

    userService.getAll()
      .then(async (data) => {
        logger.debug("Users list API response OK");

        // Simula un pequeño retraso para la carga
        const delay = ms => new Promise(res => setTimeout(res, ms));
        await delay(1000);

        let usersFiltrados = data;

        // Filtrar por nombre si se proporciona en los parámetros de consulta
        if (queryParams.name) {
          usersFiltrados = usersFiltrados.filter(user => 
            user.name.toLowerCase().includes(queryParams.name.toLowerCase())
          );
        }

        const content = document.querySelector("#content");
        if (content) {
          content.innerHTML = renderString(rowUser, { 
            users: usersFiltrados, 
            base_url: process.env.UPLOAD_URL 
          });
        }
      })
      .catch((error) => {
        logger.error("An error occurred while fetching users:", error);
        flasher.injectFlash(document.getElementById("flashObjective"), flasher.error("Ha habido un error al cargar la lista de usuarios."));
      });
  }
};
