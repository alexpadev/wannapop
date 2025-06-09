import logger from '../../lib/logger';
import router from '../../lib/router';
import flasher from '../../lib/flasher';
import { renderString } from 'nunjucks';
import page from './products.html?raw';
import template from './productsRead.html?raw';
import productService from '../../services/ProductService';
import OrderService from '../../services/OrderService';

function hacerOferta(productID) {
  let inputPrecio = prompt("Introduce el precio de la nueva oferta.").replace(",", ".");
  while (isNaN(inputPrecio)) {
    inputPrecio = prompt("ERROR! Debes introducir un número. Prueba de nuevo").replace(",", ".");
  }

  let precio = parseFloat(inputPrecio).toFixed(2);
  precio = precio == 0.00 ? 0.01 : precio;
  let session = JSON.parse(sessionStorage.getItem("wannapop_session")) || {};

  OrderService.makeOffer(productID, precio, session.token)
    .then((data) => {
      if (data.success) {
        let elementoPadre = document.getElementById("list-items");
        let nuevoElemento = document.createElement("li");
        nuevoElemento.classList.add("list-group-item")
        nuevoElemento.id = `list-item-orderID-${data.data.id}`
        nuevoElemento.innerHTML = `<button class="btn btn-success text-white" id="updateOfferBtn" onclick="actualizarOferta(${data.data.id})">Actualizar oferta</button>
                                    <button class="btn btn-danger text-white" id="updateOfferBtn" onclick="cancelarOferta(${data.data.id})">Cancelar oferta</button>
                                    <p><strong>Comprador ID:</strong> ${data.data.buyer_id}</p>
                                    <p id="precio-orderID-{{order.id}}"><strong>Oferta:</strong> ${data.data.offer} €</p>
                                    <p><strong>Fecha:</strong> ${data.data.created}</p>`
        elementoPadre.appendChild(nuevoElemento)
        document.getElementById("estatusProducto").innerHTML = `<p class="badge bg-success">Ya has enviado una oferta para este producto.</p>`

        flasher.injectFlash(document.getElementById("flashObjective"), flasher.success("Oferta retirada con éxito!"))
        // document.getElementById(`list-item-orderID-${data.data.id}`).remove()
        // router.navigateTo(`/products/${productID}`, [["success", "Oferta realizada con éxito!"]]); 
      } else {
        flasher.injectFlash(document.getElementById("flashObjective"), flasher.error("Ha habido un error al realizar la oferta."))
      }
    })
    .catch(error => {
      console.error(error)
      logger.error("Error al realizar la oferta:", error);
      flasher.injectFlash(document.getElementById("flashObjective"), flasher.success("Ha habido un error al realizar la oferta."))
    });
}

function cancelarOferta(orderID) {
  let session = JSON.parse(sessionStorage.getItem("wannapop_session")) || {};

  OrderService.deleteOffer(orderID, session.token)
    .then((data) => {
      if (data.success) {
        //  router.navigateTo(window.location.pathname, [["success", "Oferta retirada con éxito!"]]); 
        console.log(data)
        flasher.injectFlash(document.getElementById("flashObjective"), flasher.success("Oferta retirada con éxito!"))
        document.getElementById(`list-item-orderID-${data.data.id}`).remove()
        document.getElementById("estatusProducto").innerHTML = `<button class="btn btn-success text-white" onclick="hacerOferta(${data.data.product_id})">Realizar oferta</button>`
      } else {
        flasher.injectFlash(document.getElementById("flashObjective"), flasher.error("Ha habido un error al eliminar la oferta."))
      }
    })
    .catch(error => {
      console.error(error)
      logger.error("Error al actualizar la oferta:", error);
      flasher.injectFlash(document.getElementById("flashObjective"), flasher.error("Ha habido un error al eliminar la oferta."))
    });
}

function actualizarOferta(orderID) {
  let inputPrecio = prompt("Introduce el nuevo precio de la oferta.").replace(",", ".");
  while (isNaN(inputPrecio)) {
    inputPrecio = prompt("ERROR! Debes introducir un número. Inténtalo de nuevo").replace(",", ".");
  }

  let precio = parseFloat(inputPrecio).toFixed(2);
  let session = JSON.parse(sessionStorage.getItem("wannapop_session")) || {};

  OrderService.updateOffer(orderID, precio, session.token)
    .then((data) => {
      if (data.success) {
        flasher.injectFlash(document.getElementById("flashObjective"), flasher.success("Oferta actualizada con éxito!"))

        document.getElementById(`list-item-orderID-${data.data.id}`).innerHTML = `<button class="btn btn-success text-white" id="updateOfferBtn" onclick="actualizarOferta(${data.data.id})">Actualizar oferta</button>
                                    <button class="btn btn-danger text-white" id="updateOfferBtn" onclick="cancelarOferta(${data.data.id})">Cancelar oferta</button>
                                    <p><strong>Comprador ID:</strong> ${data.data.buyer_id}</p>
                                    <p id="precio-orderID-{{order.id}}"><strong>Oferta:</strong> ${data.data.offer} €</p>
                                    <p><strong>Fecha:</strong> ${data.data.created}</p>`

      } else {
        flasher.injectFlash(document.getElementById("flashObjective"), flasher.error("Ha habido un error al realizar la oferta."))
      }
    })
    .catch(error => {
      console.error(error)
      logger.error("Error al actualizar la oferta:", error);
      flasher.injectFlash(document.getElementById("flashObjective"), flasher.error("Ha habido un error al realizar la oferta."))
    });
}

window.hacerOferta = hacerOferta;
window.actualizarOferta = actualizarOferta;
window.cancelarOferta = cancelarOferta;

export default {
  renderHTML(params) {
    const data = { id: params.id };
    document.querySelector("#content").innerHTML = renderString(page, data);
  },

  async loadScript(params) {
    const id = params.id;
    logger.debug("Product details API request...");

    await productService.getOne(id)
      .then(async (data) => {
        logger.debug("Product details API response OK");

        const content = document.querySelector('#content');
        if (content) {
          let session = JSON.parse(sessionStorage.getItem("wannapop_session")) || {};

          content.innerHTML = renderString(template, { 
            product: data, 
            base_url: process.env.UPLOAD_URL,
            session: session  
          });
        } else {
          logger.warn("Element with ID 'content' not found for rendering.");
        }
      })
      .catch((error) => {
        logger.error("An error occurred while fetching product details:", error);
        // flasher.injectFlash(document.getElementById("flashObjective"), flasher.error("Ha habido un error mientras se intentaban cargar los productos."))
        router.navigateTo('/products', [["error", "Error al intentar cargar el producto."]]);
      });
  }
};