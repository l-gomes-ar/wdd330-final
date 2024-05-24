import { loadTemplate } from "./utils.mjs";
import AssetsDetails from "./AssetsDetails.mjs";
import RetrieveData from "./RetrieveData.mjs";

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

        if (window.location.pathname === "/") {
            new AssetsDetails(document.querySelector("#home-currencies-container"))
                .renderHomePageSearchResults(results);
        }
    }
    
    listenSearch() {
        document.querySelector("#search").addEventListener("keyup", (ev) => {
            if (ev.target.value !== "") {
                const search = ev.target.value.trim();
                document.querySelector("h2").textContent = `Search Results: "${search}"`
                this.renderSearchResults(search);
            } else if (window.location.pathname === "/") {
                document.querySelector("h2").textContent = "Top 10 Cryptocurrencies";
                document
                    .querySelector("#home-currencies-container")
                    .innerHTML = new AssetsDetails(document.querySelector("#home-currencies-container")).renderHomePageAssets();
            }
        })
    }
}