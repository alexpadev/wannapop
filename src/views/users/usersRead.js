import logger from '../../lib/logger';
import flasher from '../../lib/flasher';
import router from '../../lib/router';
import { renderString } from 'nunjucks';
import page from './users.html?raw';
import template from './usersRead.html?raw';
import userService from '../../services/UserService';

export default {
  renderHTML(params) {
    const data = { "id": params.id };
    document.querySelector("#content").innerHTML = renderString(page, data);
  },
  
  loadScript(params) {
    const id = params.id;
    logger.debug("User details API request...");

    userService.getOne(id)
      .then((data) => {
        logger.debug("User details API response OK");
        const contentDiv = document.querySelector('#content');
        contentDiv.innerHTML = renderString(template, { 
          user: data,
          base_url: process.env.UPLOAD_URL 
        });
      })
      .catch((error) => {
        logger.debug(error);
        router.navigateTo('/users', [["error", "Error al intentar cargar el usuario."]]);

        // flasher.injectFlash(document.getElementById("flashObjective"), flasher.error("Error al intentar cargar el usuario."))
      });
  }
};
