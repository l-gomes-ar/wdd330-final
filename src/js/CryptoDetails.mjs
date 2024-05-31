import RetrieveData from "./RetrieveData.mjs";
import { getLocalStorage, setLocalStorage } from "./utils.mjs";
import Chart from "chart.js/auto"

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

    const marketCapString = (asset.marketCapUsd) ? `$${parseFloat(asset.marketCapUsd).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$--";
    const volume24HrString = (asset.vwap24Hr) ? `$${parseFloat(asset.vwap24Hr).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : "$--";
    const supplyString = (asset.supply) ? `${parseFloat(asset.supply).toLocaleString("en-US")} ${asset.symbol}` : `-- ${asset.symbol}`;
    const maxSupplyString = (asset.maxSupply) ? `${parseFloat(asset.maxSupply).toLocaleString("en-US")} ${asset.symbol}` : `-- ${asset.symbol}`;

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
    `<div class="name">
            <p><b>${nameString}</b></p>
            <img src="https://assets.coincap.io/assets/icons/${asset.symbol.toLowerCase()}@2x.png" alt=" ${asset.name} icon">
    </div>
    <p class="price">${priceString} ${change24HrHtml}</p>
    <p><b>Market Cap: </b>${marketCapString}</p>
    <p><b>Volume (24h): </b>${volume24HrString}</p>
    <p><b>Total Supply: </b>${supplyString}</p>
    <p><b>Max Supply: </b>${maxSupplyString}</p>
    ${watchlistBtnHtml}`;

    return html;
}

function getChartXYValues(data, history) {
    const yValues = data.map((point) => parseFloat(point.priceUsd));
    const xValues = data.map((point) =>  {
        if (history === "1Y") {
            return new Date(point.time)
                .toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric"
                });
        } else if (["1M", "1W"].includes(history)) {
            return new Date(point.time)
                .toLocaleDateString("en-US", {
                    day: "2-digit",
                    month: "short"
                });
        } else {
            return new Date(point.time).getHours() + "h";
        }

    });

    return { xValues, yValues };
}

function getChartColors(yValues) {
    if (yValues[0] < yValues[yValues.length - 1]) {
        return {
            backgroundColor: "rgba(0, 255, 0, .3)",
            borderColor: "rgba(0, 255, 0)"
        }
    } else {
        return {
            backgroundColor: "rgba(255, 0, 0, .3)",
            borderColor: "rgba(255, 0, 0)"
        }
    }
}

function updateHistorySummary(yValues) {

    let max, min, sum, average, change;

    if (yValues.length > 0) {
        max = Math.max.apply(Math, yValues).toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
        min = Math.min.apply(Math, yValues).toLocaleString("en-US", { maximumFractionDigits: 2,  minimumFractionDigits: 2 });
        sum = yValues.reduce((sum, value) => sum + value, 0);
        average = parseFloat(sum / yValues.length).toLocaleString("en-US", { maximumFractionDigits: 2,  minimumFractionDigits: 2 });
        change = ((100 * yValues[yValues.length - 1] / yValues[0]) - 100).toFixed(2);
    } else {
        max = min = sum = average = change = "--";
    }

    console.log(yValues)
    const summaryElem = document.querySelector(".history-summary");
    summaryElem.innerHTML = 
    `
    <p>HIGH <span>$${max}</span></p>
    <p>LOW <span>$${min}</span></p>
    <p>AVERAGE <span>$${average}</span></p>
    <p>CHANGE <span>${change}%</span></p>
    `;
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
            this.renderChart();
            this.listenToChartBtns();
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
        document.querySelector(".asset-info").innerHTML = html;
        this.listenToWatchlistBtns();
    }

    listenToChartBtns() {
        console.log()
        document
            .querySelectorAll(".change-chart")
            .forEach(btn => {
                btn.addEventListener("click", (ev) => {
                    // Remove all "selected"
                    document.querySelectorAll(".change-chart").forEach(btn => btn.classList.remove("selected"));
                    btn.classList.add("selected");
                    const history = ev.target.dataset.history;
                    document.querySelector("canvas").remove();
                    this.renderChart(history);    
                })
            });
    }

    async renderChart(history="1D") {
        const data = await new RetrieveData().getHistoryByAsset(this.asset, history);
  
        const { xValues, yValues } = getChartXYValues(data, history);
        const { backgroundColor, borderColor } = getChartColors(yValues);
        updateHistorySummary(yValues);

        const canvasElem = document.createElement("canvas");
        canvasElem.id = "asset-info";

        document.querySelector(".chart").append(canvasElem);

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
                maintainAspectRatio: false,
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