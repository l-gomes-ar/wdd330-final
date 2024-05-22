import AssetsDetails from "./AssetsDetails.mjs";
import { loadStaticTemplates } from "./utils.mjs";

loadStaticTemplates();

const parentElem = document.querySelector("#home-currencies-container");
const assets = new AssetsDetails(parentElem);
assets.init(assets.renderHomePageAssets);
