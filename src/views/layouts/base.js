import logger from '../../lib/logger'
// Nunjucks template engine
import { renderString } from 'nunjucks'
import layout from './base.html?raw'
import template from './_user.html?raw'

export default {
  renderHTML() {
    logger.debug("Render layout...")
    let session = JSON.parse(sessionStorage.getItem("wannapop_session")) || {};
    const datosLogin = {
      "developer": "Profes DAW",
      "username": session.username ?? (session.email ?? "")
    }
    console.log(datosLogin)
    document.querySelector("#app").innerHTML = renderString(layout, datosLogin)
  },
  refreshUser() {
    logger.debug("Refresh layout using Nunjucks...")
    const userDiv = document.querySelector('#user')
    let session = JSON.parse(sessionStorage.getItem("wannapop_session")) || {};
    const datosLogin = {
      "developer": "Profes DAW",
      "username": session.email ?? ""
    }
    userDiv.innerHTML = renderString(template, datosLogin)    
  }
}