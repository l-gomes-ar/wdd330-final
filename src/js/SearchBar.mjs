import { loadTemplate, getParams } from "./utils.mjs";
import AssetsDetails from "./AssetsDetails.mjs";
import RetrieveData from "./RetrieveData.mjs";
import CryptoList from "./CryptoList.mjs";

const retrieveData = new RetrieveData();

export default class SearchBar {
    constructor() {
    }

    async init() {
        const searchBarTemp = await loadTemplate("../partials/search-bar.html");
        document.querySelector(".searchbar").innerHTML = searchBarTemp;
        this.listenSearch();        
    }

    async renderSearchResults(search) {
        const results = await retrieveData.searchAssets(search);
        new AssetsDetails(document.querySelector("#currencies-container"))
            .renderSearchResultAssets(results);
    }
    
    listenSearch() {
        document.querySelector("#search").addEventListener("keyup", (ev) => {
            if (ev.target.value !== "") {
                // Remove pagination buttons if necessary
                if (document.querySelector(".page-btns-container")) {
                    document.querySelector(".page-btns-container").innerHTML = "";
                }
                const search = ev.target.value.trim();
                document.querySelector("h2").textContent = `Search Results: "${search}"`
                this.renderSearchResults(search);
            } else if (window.location.pathname === "/") {
                document.querySelector("h2").textContent = "Top 10 Cryptocurrencies";
                document
                    .querySelector("#currencies-container")
                    .innerHTML = new AssetsDetails(document.querySelector("#currencies-container")).renderHomePageAssets();
            } else if (window.location.pathname === "/cryptocurrencies/") {
                new CryptoList().loadPage();
            }
        })
    }
}