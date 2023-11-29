import {
  ENDPOINT,
  DEFAULT_PATIENTS,
  TABLE,
  COLUMNS,
  METHODS,
  KEY,
  ERROR_EMPTY,
  ERROR_INVALID_METHOD,
  ERROR_MULTI_QUERY,
} from "./constants.js";

document.getElementById("default_patients").addEventListener("click", () => {
  addDefaultPatients();
});

document.getElementById("send").addEventListener("click", () => {
  sendQuery();
});
document.getElementById("query").addEventListener("keydown", (event) => {
  if (event.key === "Enter" && event.ctrlKey) {
    document.getElementById("query").value += "\n";
    return;
  }
  if (event.key !== "Enter") return;
  event.preventDefault();
  sendQuery();
});

async function addDefaultPatients() {
  const defaultQuery = `${KEY}=INSERT INTO ${TABLE} ${COLUMNS} VALUES ${DEFAULT_PATIENTS};`;
  const response = await fetch(ENDPOINT, {
    method: "POST",
    body: defaultQuery,
  });
  if (!response.ok) {
    const errorMsg = `Error ${response.status} : ${await response.text()}`;
    displayMessage(errorMsg);
    return;
  }
  const { rowCount } = await response.json();
  displayInsertMessage(rowCount);
}

const validatedQuery = () => {
  const raw_query = document.getElementById("query").value.trim();
  if (raw_query === "") return displayMessage(ERROR_EMPTY);

  const queries = raw_query.split(";").filter((query) => query !== "");
  if (queries.length > 1) return displayMessage(ERROR_MULTI_QUERY);

  const [query] = queries;
  if (!METHODS.includes(query.slice(0, 6).toLowerCase())) {
    return displayMessage(ERROR_INVALID_METHOD);
  }
  return query;
};

async function sendQuery() {
  const query = validatedQuery();
  if (!query) return;

  const [insert] = METHODS;
  let response;
  if (query.slice(0, 6).toLowerCase() === insert) {
    response = await fetch(ENDPOINT, {
      method: "POST",
      body: `${KEY}=${query};`,
    });
  } else {
    response = await fetch(`${ENDPOINT}?${KEY}=${query};`);
  }
  if (!response.ok) {
    const errorMsg = `Error ${response.status} : ${await response.text()}`;
    displayMessage(errorMsg);
    return;
  }
  // Insert output
  const data = await response.json();
  if (data.rowCount) {
    displayInsertMessage(data.rowCount);
    return;
  }
  // Select output
  displayMessage(`<pre>${JSON.stringify(data, null, 2)}</pre>`);
}

function displayInsertMessage(count) {
  const message = `Inserted ${count} ${
    count > 1 ? "items" : "item"
  } into ${TABLE}.`;
  displayMessage(message);
}

function displayMessage(message) {
  display.innerHTML = message;
}
