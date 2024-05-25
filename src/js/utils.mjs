function hamburgerMenu() {
  document.querySelector("#hamburgerMenu").addEventListener("click", (ev) => {
    document.querySelector("nav").classList.toggle("show");
    ev.target.closest("span").classList.toggle("show");
  });
}

export async function loadTemplate(path) {
  const html = await fetch(path);
  const htmlString = await html.text();
  return htmlString;
}

export async function loadStaticTemplates() {
  const headerTemp = await loadTemplate("../partials/header.html");
  const navTemp = await loadTemplate("../partials/nav.html");
  const footerTemp = await loadTemplate("../partials/footer.html");

  document.querySelector("header").innerHTML = headerTemp;
  document.querySelector("nav").innerHTML = navTemp;
  document.querySelector("footer").innerHTML = footerTemp;

  hamburgerMenu();
}

export async function loadAndGetSearchBar() {
  const searchBarTemp = await loadTemplate("../partials/search-bar.html");
  document.querySelector(".searchbar").innerHTML = searchBarTemp;
}

export function generateCurrenciesContainerTemplate(asset) {
  let html = `<div class="home-currency">
                <i class="cf cf-${asset.symbol.toLowerCase()}"></i>
                <div>
                    <h3>${asset.name}<sup>${asset.symbol}</sup></h3>
                    <p>$${parseFloat(asset.priceUsd).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}`;
  if (asset.changePercent24Hr) {
    html +=  `<span`;
    if (asset.changePercent24Hr[0] === "-") html += ` class="negative-change" `;
    else html += ` class="positive-change" `;
    html += `>${parseFloat(asset.changePercent24Hr).toFixed(2)}%</span>`
  }
  html += `</p>
        </div>
        <a class="view-details-btn" href="#">View</a>
      </div>`;

  return html;
}

export function renderFromTemplate(data, template, parentElem) {
  parentElem
    .innerHTML = data.map(template).join("");
}

export function getParams(params) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const productId = urlParams.get(params);
  
  return productId;
}