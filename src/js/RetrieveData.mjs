const baseUrl = import.meta.env.VITE_SERVER_URL;

async function getData(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.data;
  } catch (err) {
    throw { name: "error", message: err };
  }
}

export default class RetrieveData {
  constructor() {}

  async getAssets() {
    const url = baseUrl + "assets/?limit=2000";
    const data = await getData(url);
    return data;
  }

  async getTop10Assets() {
    const url = baseUrl + "assets/?limit=10";
    const data = await getData(url);
    return data;
  }

  async get100AssetsByPage(pageNumber) {
    let offset = 0;
    for (let i = 1; i < pageNumber; i++) {
      offset += 100;
    }

    const url = baseUrl + `assets/?limit=100&offset=${offset}`;
    const data = await getData(url);
    return data;
  }

  async searchAssets(search) {
    const url = baseUrl + "assets/?search=" + search;
    const data = await getData(url);
    return data;
  }

  async getAssetById(id) {
    const url = baseUrl + `assets/${id}`;
    const data = await getData(url);
    return data;
  }
}
