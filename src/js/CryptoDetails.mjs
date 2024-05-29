import RetrieveData from "./RetrieveData.mjs";
import { getLocalStorage, setLocalStorage } from "./utils.mjs";

function renderAssetInfoTemplate(asset) {
    const nameString = `${asset.name} (${asset.symbol}) <em>#${asset.rank}</em>`;
    const priceString = (asset.priceUsd) ? `$${parseFloat(asset.priceUsd).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$--.--";

    let change24HrHtml;
    if (asset.changePercent24Hr) {
        if (asset.changePercent24Hr[0] === "-") {
            change24HrHtml = `<span class="negative-change">${parseFloat(asset.changePercent24Hr).toFixed(2)}% (1d)</span>`;
        } else {
            change24HrHtml = `<span class="positive-change">${parseFloat(asset.changePercent24Hr).toFixed(2)}% (1d)</span>`;
        }
    } else {
        change24HrHtml = "";
    }

    const marketCapString = (asset.marketCapUsd) ? `$${parseFloat(asset.marketCapUsd).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$--.--";
    const volume24HrString = (asset.vwap24Hr) ? `$${parseFloat(asset.vwap24Hr).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$--.--";
    const supplyString = (asset.supply) ? `${parseFloat(asset.supply).toLocaleString("en-US")} ${asset.symbol}` : `--.-- ${asset.symbol}`;
    const maxSupplyString = (asset.maxSupply) ? `${parseFloat(asset.maxSupply).toLocaleString("en-US")} ${asset.symbol}` : `--.-- ${asset.symbol}`;

    let watchlistBtnHtml;
    if (getLocalStorage("watchlist").includes(asset.id)) {
        watchlistBtnHtml = `<span class="removeFromWatchlistBtn"> <img src="/images/star-icon.png" alt="Black Star, Watchlist Icon"> Remove from watchlist</span>`
    } else {
        watchlistBtnHtml = `<span class="addToWatchlistBtn"> <img src="/images/star-icon.png" alt="Black Star, Watchlist Icon"> Add to watchlist</span>`
    }

    let html = 
    `<div class="asset-info">
        <div class="name">
            <p><b>${nameString}</b></p>
            <img src="https://assets.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png" alt=" ${asset.name} icon">
        </div>
        <p class="price">${priceString} ${change24HrHtml}</p>
        <p><b>Market Cap: </b>${marketCapString}</p>
        <p><b>Volume (24h): </b>${volume24HrString}</p>
        <p><b>Total Supply: </b>${supplyString}</p>
        <p><b>Max Supply: </b>${maxSupplyString}</p>
        ${watchlistBtnHtml}
    </div>`;

    return html;
}


export default class CryptoDetails {
    constructor(assetId) {
        this.assetId = assetId;
        this.asset;
    }
    async init() {
        const headingElem = document.querySelector("h2");
        try {
            this.asset = await new RetrieveData().getAssetById(this.assetId);
            headingElem
                .textContent = this.asset.name + " Details";
            this.renderAssetInfo();
        } catch (err) {
            if (err.message === 404) {
                headingElem
                    .textContent = "Could not find asset: " + this.assetId;
            } else {
                headingElem
                    .textContent = "Error loading asset details." + err;
            }
        }
    }
    listenToWatchlistBtns() {
        if (document.querySelector(".addToWatchlistBtn")) {
            document
                .querySelector(".addToWatchlistBtn")
                .addEventListener("click", () => this.addToWatchlistHandler());
        } else {
            document
                .querySelector(".removeFromWatchlistBtn")
                .addEventListener("click", () => this.removeFromWatchlistHandler());
        }
    }
    removeFromWatchlistHandler() {
        
        let watchlist = getLocalStorage("watchlist").filter((asset) => asset !== this.asset.id);
        setLocalStorage("watchlist", watchlist);
        this.renderAssetInfo();
    }
    addToWatchlistHandler() {
        if (getLocalStorage("watchlist")) {
            let watchlist = getLocalStorage("watchlist");
            if (!watchlist.includes(this.asset.id))
                watchlist.push(this.asset.id);
            setLocalStorage("watchlist", watchlist);
        } else {
            setLocalStorage("watchlist", [this.asset.id]);
        }
        this.renderAssetInfo();
    }
    renderAssetInfo() {
        const html = renderAssetInfoTemplate(this.asset);
        document.querySelector("#details-container").innerHTML = html;
        this.listenToWatchlistBtns();
    }
}