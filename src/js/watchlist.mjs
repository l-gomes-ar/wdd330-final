import AssetsDetails from "./AssetsDetails.mjs";
import { loadStaticTemplates, getLocalStorage } from "./utils.mjs";

loadStaticTemplates();

const watchlist = getLocalStorage("watchlist");

if (watchlist) {
    new AssetsDetails(document.querySelector("#currencies-container"))
        .renderWatchlist()
} else {
    document
        .querySelector("h2")
        .textContent = "Empty Watchlist";
}