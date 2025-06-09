import logger from '../../lib/logger'
import { renderString } from 'nunjucks'
import page from './logout.html?raw'
import router from '../../lib/router'
import layout from '../layouts/base.js'
import sessionService from '../../services/SessionService'
import authService from '../../services/AuthService'
import flasher from '../../lib/flasher'

export default {
  renderHTML() {
    logger.debug("Render logout page");
    document.querySelector("#content").innerHTML = renderString(page);

    const session = sessionService.getSessionData();
    if (!session) {
      router.navigateTo('/', [["error", "Error :( no hi ha cap sessió iniciada."]]);
    }

  },
  loadScript() {
    let cancelBtn = document.querySelector('#cancelLogout');
    cancelBtn.addEventListener('click', function(event) {
      logger.debug("Cancel logout...");
      router.navigateTo('/');
    });

    let confirmBtn = document.querySelector('#confirmLogout');
    confirmBtn.addEventListener('click', async function(event) {
      logger.debug("Confirm logout...");

      const session = sessionService.getSessionData();
      if (!session) {
        return flasher.injectFlash(document.getElementById("flashObjective"), flasher.error("Error :( no hi ha cap sessió iniciada."))
      }

      try {
        await authService.logout(session.token);
        sessionService.destroySession();

        layout.renderHTML();
        router.navigateTo('/', [["info", "Sessió tancada amb éxit!"]]);

      } catch (error) {
        logger.error("Logout error:", error);
        if(confirm("Error :( No s'ha pogut tancar sessió correctament. Vols tancar sessió de forma forçada?")) {
          sessionService.destroySession();
          layout.renderHTML();
          router.navigateTo('/', [["warn", "Sessió tancada (de forma forçosa)"]]);
        }
      }
    });
  }
}
