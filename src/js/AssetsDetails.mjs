import RetrieveData from "./RetrieveData.mjs";

//<i class="cf cf-usdc"></i>  <!-- Litecoin -->

function generateHomePageTemplate(asset) {
  let html = `<div class="home-currency">
                <i class="cf cf-${asset.symbol.toLowerCase()}"></i>
                <div>
                    <h3>${asset.name}</h3>
                    <p>$${parseFloat(asset.priceUsd).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })} <span`;
  if (asset.changePercent24Hr[0] === "-") html += ` class="negative-change" `;
  html += `>${parseFloat(asset.changePercent24Hr).toFixed(2)}%</span></p>
        </div>
        <a class="view-details-btn" href="#">View Details</a>
    </div>`;

  return html;
}

export default class AssetsDetails {
  constructor(parentElem) {
    this.parentElem = parentElem;
    this.assets;
  }

  async init(f) {
    const retrieve = new RetrieveData();
    this.assets = await retrieve.getAssets();
    f(this.assets, this.parentElem);
  }

  renderHomePageAssets(assets, parentElem) {
    const topTen = assets.filter((asset) => parseInt(asset.rank) <= 10);
    let html = topTen.map(generateHomePageTemplate);
    html = html.join("");
    parentElem.innerHTML = html;
  }
}
