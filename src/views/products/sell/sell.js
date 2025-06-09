import logger from '../../../lib/logger';
import { renderString } from 'nunjucks';
import page from './sell.html?raw';
import template from './_sell.html?raw';
import offerService from '../../../services/SellService';
import router from '../../../lib/router'
import flasher from '../../../lib/flasher'

async function accionOferta(oferta, aceptar) {
  let session = JSON.parse(sessionStorage.getItem("wannapop_session")) || {};

  try {
    if (aceptar) {
      offerService.acceptOffer(oferta, session.token).then((data)=> {
        console.log(data)

        let listaOfertas = document.getElementById(`lista-ofertas-${data.data.order.product_id}`);
        let listaOfertasReal = listaOfertas.getElementsByTagName("li");
        console.log(listaOfertasReal)
        Array.from(listaOfertasReal).forEach(elementoOferta => {
          elementoOferta.getElementsByTagName('div')[1].innerHTML = ""
        })

        let ofertaModificada = document.getElementById(`div-oferta-${oferta}`);
        ofertaModificada.getElementsByTagName('div')[1].innerHTML = `<button type="button" class="btn btn-danger" onclick="accionOferta(${oferta}, false)">Rechazar</button>`
        flasher.injectFlash(document.getElementById("flashObjective"), flasher.success("Oferta aceptada con éxito!"))
      });


    } else {
      offerService.rejectOffer(oferta, session.token).then((data)=> {
        console.log(data)

        let listaOfertas = document.getElementById(`lista-ofertas-${data.data.order.product_id}`);
        let listaOfertasReal = listaOfertas.getElementsByTagName("li");
        Array.from(listaOfertasReal).forEach(elementoOferta => {
          console.log(elementoOferta)
          elementoOferta.getElementsByTagName('div')[1].innerHTML = `<button type="button" class="btn btn-success" onclick="accionOferta(${(elementoOferta.getAttribute("id")).split("div-oferta-")[1]}, true)">Confirmar</button>`
        })
        flasher.injectFlash(document.getElementById("flashObjective"), flasher.success("Oferta aceptada con éxito!"))
      });
    }

  } catch (error) {
    logger.error("Error handling offer action:", error);
    flasher.injectFlash(document.getElementById("flashObjective"), flasher.error("Error al procesar la oferta."))
  }
}

window.accionOferta = accionOferta;

export default {
  renderHTML() {
    document.querySelector("#content").innerHTML = renderString(page);
  },
  async loadScript() {
    logger.debug("Product details API request...");
    let session = JSON.parse(sessionStorage.getItem("wannapop_session")) || {};
    if (session.id == undefined) {
      router.navigateTo('/login', [["error", "Encara no has iniciat sessió!"]]);
      return;
    }

    const url = process.env.API_URL + `/products/sell`;

    try {
      const response = await fetch(url, {
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${session.token}`
        },
        method: "GET",
      });

      const data = await response.json();
      logger.debug("Product details API response OK");
      const content = document.querySelector('#content');
      if (content) {
        content.innerHTML = renderString(template, { 
          products: data.data, 
          base_url: process.env.UPLOAD_URL 
        });
      } else {
        logger.warn("Element with ID 'content' not found for rendering.");
      }
    } catch (error) {
      logger.error("An error occurred while fetching product details:", error);
      flasher.injectFlash(document.getElementById("flashObjective"), flasher.error("Error al intentar cargar los productos."))
    }
  }
};
