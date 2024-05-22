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
    const url = baseUrl + "assets";
    const data = await getData(url);
    return data;
  }

  async getAssetById(id) {
    const url = baseUrl + `assets/${id}`;
    const data = await getData(url);
    return data;
  }
}
