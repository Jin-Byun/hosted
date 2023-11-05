import {
  ROOT,
  LANGUAGE_EP,
  WORD_EP,
  ADD_BUTTON_TEXT,
  ONLY_LETTERS_AND_NUMBERS,
  ERR_MSG,
  ADD,
  UPDATE,
} from "./constants.js";

const modal = document.getElementById("patch-modal");
let data = {};
document.getElementById("add").addEventListener("click", addDefinition);
modal.querySelector("#update").addEventListener("click", updateDefinition);

const update_language_select = async () => {
  const wordSelect = document.getElementById("word-lang");
  const definitionSelect = document.getElementById("def-lang");
  if (wordSelect.children.length > 1 && definitionSelect.children.length > 1) {
    return;
  }
  const resp = await fetch(`${ROOT}/${LANGUAGE_EP}`)
  if (!resp.ok) {
    console.log(resp.text);
    return;
  }
  const {message, entry} = await resp.json();
  console.log(message);
  for (const {name} of entry) {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    wordSelect.appendChild(opt.cloneNode(true));
    definitionSelect.appendChild(opt);
  }
};

update_language_select();

function addDefinition(e) {
  const word = document.getElementById("word").value.trim();
  const definition = document.getElementById("definition").value.trim();
  const wordLanguage = document.getElementById("word-lang").value;
  const definitionLanguage = document.getElementById("def-lang").value;
  data = {
    word,
    definition,
    "word-language": wordLanguage,
    "definition-language": definitionLanguage
  };
  if (word === "" || definition === "") {
    alert(ERR_MSG.bothEmpty);
    return;
  }
  if (wordLanguage === "" || definitionLanguage === "") {
    alert(ERR_MSG.language);
    return;
  }
  if (!ONLY_LETTERS_AND_NUMBERS.test(word)) {
    alert(ERR_MSG.regex);
    return;
  }
  let statusCode = "Status ";
  fetch(`${ROOT}/${WORD_EP}`, {
    method: "POST",
    mode: "cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
  .then(res => {
    statusCode += res.status;
    if (res.ok) return res.json();
    return Promise.reject(res);
  })
  .then(({message, total}) => {
    console.log(message);
    displaySuccess(statusCode, word, total);
  })
  .catch(res => {
    res.json().then(({error, total}) => {
      modal.querySelector("h2").textContent = error
      modal.querySelector("p").textContent = `"${statusCode}: ${word}" exists in dictionary of ${total}.`;
      modal.showModal();
    });
  });
}

async function updateDefinition(e) {
  const {word} = data;
  const res = await fetch(`${ROOT}/${WORD_EP}/${word}`, {
    method: "PATCH",
    mode: "cors",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
  const statusCode = `Status: ${res.status}`;
  const {message, total} = await res.json();
  console.log(message);
  displaySuccess(statusCode, word, total, true);
  modal.close();
}

function displaySuccess(status, word, total, isUpdate = false) {
  const button = document.getElementById("add");
  button.className = "success";
  button.innerText = `"${status}: ${word}" ${isUpdate ? UPDATE : ADD} dictionary of ${total}`;
  setTimeout(() => {
    document.getElementById("word").value = "";
    document.getElementById("definition").value = "";
    button.className = "";
    button.innerText = ADD_BUTTON_TEXT;
  }, 3000);
}