import {
  ENDPOINT,
  DEFAULT_PATIENTS,
  TABLE,
  COLUMNS,
  VALID_METHODS,
  KEY,
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
  const { rowCount } = await response.json();
  displayInsertMessage(rowCount);
}

async function sendQuery() {
  const query = validatedQuery();
  if (!query) return;
  let response;
  const [insert] = VALID_METHODS;
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
  const { rowCount } = await response.json();
  if (rowCount) {
    displayInsertMessage(rowCount);
    return;
  }
  const data = await response.json();
  displayMessage(`<pre>${JSON.stringify(data, null, 2)}</pre>`);
}

function validatedQuery() {
  const raw_query = document.getElementById("query").value.trim();
  if (raw_query === "") {
    displayMessage("No Empty query.");
    return "";
  }
  const queries = raw_query.split(";").filter((query) => query !== "");
  if (queries.length > 1) {
    displayMessage("Please send 1 query at a time.");
    return "";
  }
  const [query] = queries;
  if (!VALID_METHODS.includes(query.slice(0, 6).toLowerCase())) {
    displayMessage("only insert and select method is valid.");
    return "";
  }
  return query;
}

function displayInsertMessage(count) {
  const message = `Inserted ${count} ${
    count > 1 ? "items" : "item"
  } into ${TABLE}.`;
  displayMessage(message);
}

function displayMessage(message) {
  console.log(message);
  display.innerHTML = message;
}
