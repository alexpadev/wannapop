// Import our custom CSS
import './assets/scss/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'

// Configuration
console.log("App environment: " + process.env.APP_ENV)
console.log("Debug mode: " + (process.env.APP_DEBUG ? "on" : "off"))

// Layout
import layout from './views/layouts/base.js'
layout.renderHTML()

// Router
import router from './lib/router.js'

import home from './views/home/page.js'
import login from './views/auth/login.js'
import logout from './views/auth/logout.js'
import counter from './views/counter/page.js'
import authors from './views/authors/page.js'
import users from './views/users/users.js'
import usersRead from './views/users/usersRead.js'
import products from './views/products/products.js'
import productsRead from './views/products/productsRead.js'
import buy from './views/products/buy/buy.js'
import productSell from './views/products/sell/sell.js'
import error404 from './views/layouts/404.js'


const routes = {
    '/': home,
    '/login': login,
    '/logout': logout,
    '/counter': counter,
    '/authors': authors,
    '/users': users,
    '/users/<id>': usersRead,
    '/products': products,
    '/products/<id>': productsRead,
    '/products/buy': buy,
    '/products/sell': productSell,
    "/404": error404,
    "*": error404
}

router.setRoutes(routes)
router.bootup()