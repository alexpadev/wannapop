import logger from '../../lib/logger'
// Nunjucks template engine
import { renderString } from 'nunjucks'
import page from './page.html?raw'

export default {
  renderHTML() {
    logger.debug("Render home page")
    const data = {"app": "Wannapop"}
    logger.warn("Logger de ejemplo")
    document.querySelector("#content").innerHTML = renderString(page, data)
  }
}