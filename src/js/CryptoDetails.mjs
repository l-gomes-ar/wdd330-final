import RetrieveData from "./RetrieveData.mjs";
import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import Chart, { Title } from "chart.js/auto"

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
    if (getLocalStorage("watchlist")) {
        if (getLocalStorage("watchlist").includes(asset.id)) {
            watchlistBtnHtml = `<span class="removeFromWatchlistBtn"> <img src="/images/star-icon.png" alt="Black Star, Watchlist Icon"> Remove from watchlist</span>`
        } else {
            watchlistBtnHtml = `<span class="addToWatchlistBtn"> <img src="/images/star-icon.png" alt="Black Star, Watchlist Icon"> Add to watchlist</span>`
        }
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
                .textContent = "Asset Details: " + this.asset.symbol;
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
        this.renderChart();
    }

    async renderChart() {
        const data = await new RetrieveData().getHistoryByAsset(this.asset);
  
        const yValues = data.map((point) => parseFloat(point.priceUsd));
        const xValues = data.map((point) =>  {
            return new Date(point.time)
                .toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric"
                });
        });

        const max = Math.max.apply(Math, yValues).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
        const min = Math.min.apply(Math, yValues).toLocaleString("en-US", { maximumFractionDigits: 2,  minimumFractionDigits: 2 });
        const sum = yValues.reduce((sum, value) => sum + value, 0);
        const average = parseFloat(sum / yValues.length).toLocaleString("en-US");
        const change = (100 * yValues[yValues.length - 1] / yValues[0]) - 100;

        let backgroundColor;
        let borderColor;

        if (yValues[0] < yValues[yValues.length - 1]) {
            backgroundColor = "rgba(0, 255, 0, .3)";
            borderColor = "rgba(0, 255, 0)";
        } else {
            backgroundColor = "rgba(255, 0, 0, .3)";
            borderColor = "rgba(255, 0, 0)";
        }

        const canvasContainer = document.createElement("div");
        canvasContainer.setAttribute("class", "graph-container");

        const h3Elem = document.createElement("h3");
        h3Elem.textContent = `History (1y)`;

        const summaryElem = document.createElement("div");
        summaryElem.setAttribute("class", "history-summary");
        summaryElem.innerHTML = 
        `
        <p>HIGH <span>$${max}</span></p>
        <p>LOW <span>$${min}</span></p>
        <p>AVERAGE <span>$${average}</span></p>
        <p>CHANGE <span>${change.toFixed(2)}%</span></p>
        `;

        canvasContainer.append(h3Elem);
        canvasContainer.append(summaryElem);

        const canvasElem = document.createElement("canvas");
        canvasElem.id = "asset-info";

        canvasContainer.append(canvasElem);

        document.querySelector("#details-container").appendChild(canvasContainer);

        new Chart("asset-info", {
            type: "line",
            data: {
                labels: xValues,
                datasets: [{
                    pointRadius: 0,
                    backgroundColor: backgroundColor,
                    borderColor: borderColor,
                    borderWidth: 1,
                    label: `${this.asset.symbol} Price in USD`,
                    data: yValues,
                    fill: true
                }]
            },
            options: {
                scales: {
                    y: {
                        ticks: {
                            callback: (value, index, ticks) => {
                                return "$" + value;
                            }
                        }
                    }
                }
            }
        })
    }
}