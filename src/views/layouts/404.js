import logger from '../../lib/logger';
import flasher from '../../lib/flasher';
import { renderString } from 'nunjucks';
import page from './404.html?raw';

export default {
  renderHTML() {
    logger.warn("Rendering 404 error page");
    document.querySelector("#content").innerHTML = renderString(page);
    flasher.injectFlash(document.getElementById("flashObjective"), flasher.error("Página no encontrada."))
  }
};
