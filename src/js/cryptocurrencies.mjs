import SearchBar from "./SearchBar.mjs";
import { loadStaticTemplates } from "./utils.mjs";
import CryptoList from "./CryptoList.mjs";

loadStaticTemplates();
const search = new SearchBar();
search.init();

new CryptoList().loadPage();