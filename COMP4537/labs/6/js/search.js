import { ROOT, WORD_EP, ONLY_LETTERS_AND_NUMBERS, ERR_MSG } from "./constants.js";
async function getDefinition(e) {
  const word = document.getElementById("word").value.trim();
  if (word === "") {
    alert(ERR_MSG.empty);
    return;
  }
  if (!ONLY_LETTERS_AND_NUMBERS.test(word)) {
    alert(ERR_MSG.regex);
    return;
  }
  const display = document.getElementById("display");
  display.innerHTML = "";
  
  const res = await fetch(`${ROOT}/${WORD_EP}/${word}`);
  const statusCode = `Status: ${res.status}`;
  if (!res.ok) {
    const {error, total} = await res.json();
    display.innerText = `${statusCode} ${error}, "${word}" not in the dictionary of ${total}`;
    return;
  }
  const {message, entry, total} = await res.json();
  console.log(message);
  const definition = entry[0].definition;
  display.innerHTML = `${statusCode} From dictionary of ${total}, "${word}": ${definition}`;
}

document.getElementById("search").addEventListener("click", getDefinition);
