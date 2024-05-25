import AssetsDetails from "./AssetsDetails.mjs";
import { getParams } from "./utils.mjs";

const parentElem = document.querySelector("#currencies-container");
const assets = new AssetsDetails(parentElem);

const mainElem = document.querySelector("main");
const paginationContainer = document.createElement("div");
paginationContainer.setAttribute("class", "page-btns-container");

export default class CryptoList {
    constructor() {
    }

    loadPage() {
        let pageNumber = (getParams("p") === null) ? null : parseInt(getParams("p"));
        if (pageNumber === null || pageNumber === 1) {
            assets.renderAssetsList(1);
            paginationContainer.innerHTML = `<a class="page-btn" href="/cryptocurrencies/?p=2">Next Page</a>`;
            this.addPaginationContainer();
        } else {
            if (pageNumber > 1 && pageNumber < 23) {
                assets.renderAssetsList(pageNumber);
                paginationContainer.innerHTML = `
                <a class="page-btn" href="/cryptocurrencies/?p=${pageNumber - 1}">Previous Page</a>
                <a class="page-btn" href="/cryptocurrencies/?p=${pageNumber + 1}">Next Page</a>`;
                this.addPaginationContainer();   
            } else if (pageNumber === 23) {
                assets.renderAssetsList(pageNumber);
                paginationContainer.innerHTML = `<a class="page-btn" href="/cryptocurrencies/?p=${pageNumber - 1}">Previous Page</a>`;
                this.addPaginationContainer();
            } else {
                document
                  .querySelector("h2")
                  .textContent = "Not a valid page number!"
            }
        }
    }
    addPaginationContainer() {
        mainElem.append(paginationContainer);
    }
    removePaginationContainer() {
        mainElem.remove(divElem);
    }
}