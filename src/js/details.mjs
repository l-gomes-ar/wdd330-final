import AssetsDetails from "./AssetsDetails.mjs";
import SearchBar from "./SearchBar.mjs";
import { loadStaticTemplates } from "./utils.mjs";
import { getParams } from "./utils.mjs";

loadStaticTemplates();
const search = new SearchBar();
search.init();

const parentElem = document.querySelector("#home-currencies-container");
const assets = new AssetsDetails(parentElem);
// assets.renderHomePageAssets();

// const test = getParams("test");
// console.log(test) ==> This gets "null"

// Pages functionality
const mainElem = document.querySelector("main");
const divElem = document.createElement("div");
divElem.setAttribute("class", "page-btns-container")


const nextPageBtn = document.createElement("a");
nextPageBtn.textContent = "Next Page";
nextPageBtn.setAttribute("class", "page-btn");

const previousPageBtn = document.createElement("a");
previousPageBtn.textContent = "Previous Page";
previousPageBtn.setAttribute("class", "page-btn");

if (getParams("page") === null) { // Add functionality for checking for single detail page VS all assets details
    assets.renderDetailsPageAssets(1);
    nextPageBtn.href = "/details/?page=2";
    divElem.append(nextPageBtn);
    mainElem.append(divElem);
} else {
    let pageNumber = parseInt(getParams("page"));
    assets.renderDetailsPageAssets(pageNumber);
    previousPageBtn.href = `/details/?page=${pageNumber - 1}`;
    nextPageBtn.href = `/details/?page=${pageNumber + 1}`;
    if (pageNumber < 23) {
        divElem.append(previousPageBtn);
        divElem.append(nextPageBtn);
        mainElem.append(divElem);
    } else {
        divElem.append(previousPageBtn);
        mainElem.append(divElem);
    }
}