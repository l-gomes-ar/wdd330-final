import { loadTemplate } from "./utils.mjs";
import AssetsDetails from "./AssetsDetails.mjs";
import RetrieveData from "./RetrieveData.mjs";

async function getAllData() {
    const retrieve = new RetrieveData();
    const data = await retrieve.getAssets();
    return data;
}

export default class SearchBar {
    constructor() {
        this.possibleResults;
    }

    async init() {
        const searchBarTemp = await loadTemplate("../partials/search-bar.html");
        document.querySelector(".searchbar").innerHTML = searchBarTemp;
        this.possibleResults = await getAllData();
        this.listenSearch();        
    }

    getSearchResults(search) {
        const searchResults = this.possibleResults.filter((asset) => (asset.name).toLowerCase().includes(search.toLowerCase()));
        this.renderSearchResults(searchResults)
    }

    renderSearchResults(results) {
        const assetDetails = new AssetsDetails();
        if (window.location.pathname === "/") {
            assetDetails.renderHomePageSearchResults(results, document.querySelector("#home-currencies-container"));
        }
    }
    
    listenSearch() {
        const originalHeading = document.querySelector("h2").textContent;
        const originalContent = document.querySelector("#home-currencies-container").innerHTML;
        document.querySelector("#search").addEventListener("keyup", (ev) => {
            if (ev.target.value !== "") {
                const search = ev.target.value.trim();
                document.querySelector("h2").textContent = `Search Results: "${search}"`
                this.getSearchResults(search);
            } else {
                document.querySelector("h2").textContent = originalHeading;
                document.querySelector("#home-currencies-container").innerHTML = originalContent;
            }
        })
    }
}