const fs = require("fs");
const path = require("path");

async function fetchAllPages() {
  let page = 1;
  let totalPages = 3;
  let mandiData = [];
  const BASE_URL = "https://api.agmarknet.gov.in/v1/dashboard-data/";
  const PARAMS = "?commodity=[100001]&dashboard=marketwise_price_arrival&date=2026-04-14&district=[100007]&format=json&grades=[4]&group=[100000]&limit=10&market=[100009]&state=100006&variety=100021";
  while (page <= totalPages) {
    const url = `${BASE_URL}${PARAMS}&page=${page}`;

    const res = await fetch(url);
    const json = await res.json();

    if (page === 1) {
      totalPages = json.pagination.total_pages;
    }

    mandiData.push(...json.data.records);
    page++;
  }

  return mandiData;
}

async function saveToFile() {
  const mandiData = await fetchAllPages();

  // build correct path
  const filePath = path.join(__dirname, "..", "src", "data", "mandiData.json");

  fs.writeFileSync(
    filePath,
    JSON.stringify({ mandiData }, null, 2)
  );

  console.log("Saved to src/data/mandiData.json");
}

saveToFile();