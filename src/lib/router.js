import flasher from './flasher'
import error404 from '../views/layouts/404.js'
export class Router {
    
  constructor(nav, routes={}) {
    this.nav = nav
    this.routes = routes
  }

  setNav() {
    this.nav = nav
  }

  setRoutes(routes) {
    this.routes = routes
  }
  
  async renderContent(route, flashes) {
    let matchedRoute = undefined;
    let params = {};

    // Comprovar si la ruta existeix com a clau (rutes estàtiques)
    if (this.routes[route]) {
      matchedRoute = this.routes[route];
    } else {
      // Comprovar rutes dinàmiques
      for (let pattern in this.routes) {
        if (pattern.includes('<')) {
          // Convertir la ruta dinàmica en expressió regular
          const regexPattern = pattern.replace(/<(\w+)>/g, "(?<$1>\\w+)");
          const regex = new RegExp(`^${regexPattern}$`);
          // Comprovar coincidència amb la ruta actual
          const match = route.match(regex);
          if (match) {
            matchedRoute = this.routes[pattern];
            params = match.groups; // Extreure els paràmetres dinàmics
            break; // Sortir del bucle en trobar la coincidència
          }
        }
      }
    }

    // Si es troba una ruta coincident
    if (matchedRoute) {
      // Renderitzar el HTML
      if (matchedRoute.renderHTML) {
        await matchedRoute.renderHTML(params); // Passar els paràmetres si n'hi ha
        await this.registerNavLinks(); // Refrescar esdeveniments de navegació
        if (flashes) {
          for (let flash of flashes) {
            flasher.injectFlash(
              document.getElementById("flashObjective"),
              flasher[flash[0]](flash[1]) // jijijiji
            )
          }
        }
      }
      // Executar el JavaScript
      if (matchedRoute.loadScript) {
        await matchedRoute.loadScript(params); // Passar els paràmetres si n'hi ha
        if (flashes) {
          for (let flash of flashes) {
            flasher.injectFlash(
              document.getElementById("flashObjective"),
              flasher[flash[0]](flash[1]) // jijijiji
            )
          }
        }
      }
    } else {
      console.error(`Route not found: ${route}`);
      error404.renderHTML();
    }
  }  
  
  navigateTo(route, flashes=[]) {
    window.history.pushState({}, "", route)
    this.renderContent(route, flashes)
  }

  registerNavLinks() {
    const self = this
    const links = document.querySelectorAll(this.nav)
    for(let i=0; i<links.length; i++) {
      if (!links[i].dataset.eventAdded) {
        links[i].addEventListener("click", (e) => {
            e.preventDefault()
            const { href } = e.target
            window.history.pushState({}, "", href)
            self.navigateTo(e.target.pathname)
        })
        // Avoid duplicated events
        links[i].dataset.eventAdded = true
      }
    }
  }

  registerBrowserBackAndForth = () => {
    const self = this
    window.onpopstate = function (e) {
      const route = window.location.pathname
      self.renderContent(route)
    }
  }

  renderInitialPage() {
    const route = window.location.pathname
    this.renderContent(route)
  }

  bootup() {
    this.registerBrowserBackAndForth()
    this.renderInitialPage()        
  }
}

const router = new Router('a[route]')

export default router