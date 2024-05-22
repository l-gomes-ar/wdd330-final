function hamburgerMenu() {
  document.querySelector("#hamburgerMenu").addEventListener("click", (ev) => {
    document.querySelector("nav").classList.toggle("show");
    ev.target.closest("span").classList.toggle("show");
  });
}

async function loadTemplate(path) {
  const html = await fetch(path);
  const htmlString = await html.text();
  return htmlString;
}

export async function loadStaticTemplates() {
  const headerTemp = await loadTemplate("../partials/header.html");
  const navTemp = await loadTemplate("../partials/nav.html");
  const searchBarTemp = await loadTemplate("../partials/search-bar.html");
  const footerTemp = await loadTemplate("../partials/footer.html");

  const headerElem = document.querySelector("header");
  const navElem = document.querySelector("nav");
  const searchBarElem = document.querySelector(".searchbar");
  const footerElem = document.querySelector("footer");

  renderTemplate(headerTemp, headerElem);
  renderTemplate(navTemp, navElem);
  renderTemplate(searchBarTemp, searchBarElem);
  renderTemplate(footerTemp, footerElem);

  hamburgerMenu();
}

function renderTemplate(template, parentElement) {
  parentElement.insertAdjacentHTML("afterbegin", template);
}
