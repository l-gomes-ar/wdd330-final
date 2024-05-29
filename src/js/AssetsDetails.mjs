import RetrieveData from "./RetrieveData.mjs";
import { generateCurrenciesContainerTemplate, renderFromTemplate, getLocalStorage } from "./utils.mjs";
const retrieve = new RetrieveData();

export default class AssetsDetails {
  constructor(parentElem) {
    this.parentElem = parentElem;
  }
  
  async renderHomePageAssets() {
    const assets = await retrieve.getTop10Assets();
    renderFromTemplate(assets, generateCurrenciesContainerTemplate, this.parentElem);
  }

  renderSearchResultAssets(assets) {
    renderFromTemplate(assets, generateCurrenciesContainerTemplate, this.parentElem);
  }
  
  async renderAssetsList(pageNumber) {
    document
      .querySelector("h2")
      .textContent = `Cryptocurrencies (Page ${pageNumber} of 23)`
    const assets = await retrieve.get100AssetsByPage(pageNumber);
    renderFromTemplate(assets, generateCurrenciesContainerTemplate, this.parentElem);
  }

  async renderWatchlist() {
    let listIds = getLocalStorage("watchlist");
    listIds = listIds.join(",");
    const assets = await retrieve.getAssetsByIds(listIds);
    renderFromTemplate(assets, generateCurrenciesContainerTemplate, this.parentElem);
  }
}
