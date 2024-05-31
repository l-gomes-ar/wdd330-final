const baseUrl = import.meta.env.VITE_SERVER_URL;

async function getData(url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      const data = await response.json();
      return data.data;
    }
    throw response.status;
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

  async getAssetsByIds(listIds) {
    const url = baseUrl + `assets/?ids=${listIds}`;
    const data = await getData(url);
    return data;
  }

  async getHistoryByAsset(asset, history) {
    let start;
    let end;
    let interval;

    if (history === "1Y") { // Change this for the actual required time later
      start = new Date().getTime() - 3.156e+10; // Current date minus one year in miliseconds
      end = new Date().getTime();
      interval = "d1";
    } else if (history === "1W") {
      start = new Date().getTime() - 6.048e+8; // Current date minus one week in miliseconds
      end = new Date().getTime();
      interval = "d1";
    } else if (history === "1M") {
      start = new Date().getTime() - 2.628e+9; // Current date minus one month in miliseconds
      end = new Date().getTime();
      interval = "d1";
    } else if (history === "1D") {
      start = new Date().getTime() - 8.64e+7; // Current date minus one day in miliseconds 8.64e+7
      end = new Date().getTime();
      interval = "m1";
    }

    const url = baseUrl + `assets/${asset.id}/history?interval=${interval}&start=${start}&end=${end}`;
    const data = await getData(url);
    return data;
  }
}
