import AssetsDetails from "./AssetsDetails.mjs";
import SearchBar from "./SearchBar.mjs";
import { loadStaticTemplates } from "./utils.mjs";

loadStaticTemplates();
const search = new SearchBar();
search.init();

const parentElem = document.querySelector("#currencies-container");
const assets = new AssetsDetails(parentElem);
assets.renderHomePageAssets();
