import RetrieveData from "./RetrieveData.mjs";
import { generateHomePageTemplate, renderFromTemplate } from "./utils.mjs";
const retrieve = new RetrieveData();

export default class AssetsDetails {
  constructor(parentElem) {
    this.parentElem = parentElem;
  }
  
  async renderHomePageAssets() {
    const assets = await retrieve.getTop10Assets();
    renderFromTemplate(assets, generateHomePageTemplate, this.parentElem);
  }

  renderHomePageSearchResults(assets) {
    renderFromTemplate(assets, generateHomePageTemplate, this.parentElem);
  }
}
