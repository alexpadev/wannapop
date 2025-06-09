import logger from '../../lib/logger'
// Nunjucks template engine
import { renderString } from 'nunjucks'
import page from './page.html?raw'
// Router
import router from '../../lib/router'

export default {
  renderHTML() {
    logger.debug("Render counter page")
    document.querySelector("#content").innerHTML = renderString(page)
  },
  loadScript() {
    logger.debug("Render counter page component")
    const element = document.querySelector('#counter')
    let counter = 0
    const setCounter = (count) => {
      counter = count
      element.innerHTML = `count is ${counter}`
      if (count >= 3) {
        router.navigateTo('/')
      }
    }
    element.addEventListener('click', () => setCounter(counter + 1))
    setCounter(0)
  }
}