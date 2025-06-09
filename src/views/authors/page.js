import logger from '../../lib/logger'
// Nunjucks template engine
import { renderString } from 'nunjucks'
import page from './page.html?raw'
import template from '../table.html?raw'

export default {
  renderHTML() {
    logger.debug("Render authors page")
    document.querySelector("#content").innerHTML = renderString(page)
  },
  loadScript() {
    logger.debug("Render authors page component")
    const authors = [{
      'name': 'Alfons',
      'role': 'Backend'
    },{
      'name': 'Armand',
      'role': 'Frontend'
    },{
      'name': 'Pep',
      'role': 'Full-stack'
    },{
      'name': 'Alex',
      'role': 'Python lover'
    },{
      'name': 'Marc',
      'role': 'Full-noob'
    }]
    const list = document.querySelector('#list')
    list.innerHTML = renderString(template, {items:authors})
  }
}