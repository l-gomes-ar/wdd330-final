import AssetsDetails from "./AssetsDetails.mjs";
import CryptoDetails from "./CryptoDetails.mjs";
import { loadStaticTemplates, getParams } from "./utils.mjs";


loadStaticTemplates();

const assetId = getParams("a");
new CryptoDetails(assetId).init();
    