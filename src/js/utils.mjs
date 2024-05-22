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