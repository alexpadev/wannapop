import logger from '../../lib/logger'
import { renderString } from 'nunjucks'
import page from './login.html?raw'
import flasher from '../../lib/flasher'
import router from '../../lib/router'
import layout from '../layouts/base.js'
import sessionService from '../../services/SessionService'
import authService from '../../services/AuthService'
import userService from '../../services/UserService'

export default {
  renderHTML() {
    logger.debug("Render login page");
    document.querySelector("#content").innerHTML = renderString(page);

    const session = sessionService.getSessionData();
    if (session) {
      router.navigateTo('/', [["error", "Error! Ja has inicat la sessió!"]]);
    }
  },
  loadScript() {
    logger.debug("Login page");
    let form = document.querySelector('#loginForm');
    form.addEventListener('submit', async function(event) {
      logger.debug("Login form submit...");
      event.preventDefault();
      
      const formData = new FormData(event.target);
      const email = formData.get('email');
      const password = formData.get('password');

      try {
        const sessionData = await authService.login(email, password); 
        userService.getOne(sessionData.id) // No pienso hacer una petición por página
          .then((data) => {
            console.log(data)
            logger.debug("User details (login version) API response OK");
            sessionData.username = data.name;

            sessionService.createSession(sessionData); 

            layout.renderHTML();
            router.navigateTo('/', [["success", "Sessió iniciada correctament!"]]);
          })
          .catch((error) => {
            logger.debug(error);
            router.navigateTo('/login', [["error", "Error al intentar cargar el usuario actual."]]);
          });

      } catch (error) {
        logger.error("Login error:", error);
        console.error(error);
        flasher.injectFlash(document.getElementById("flashObjective"), flasher.error("No se ha podido iniciar sesión correctamente."))
      }
    });
  }
}
