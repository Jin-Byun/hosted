import {ROOT, ENDPOINT, ONLY_ABC} from "./constants.js";

async function getDefinition() {
    const word = document.getElementById("word").value.trim();
    if (word === "") {
        alert("Require input in word.");
        return;
    }
    if (!ONLY_ABC.test(word)) {
        alert("Only alphabets for word.");
        return;
    }
    const display = document.getElementById("display");
    display.innerHTML = "";
    const response = await fetch(`${ROOT}/${ENDPOINT}/?word=${word}`);
    if (response.status === 200) {
        const definition = await response.text();
        display.innerText = `"${word}": ${definition}`;
        return;
    }
    display.innerText = `Error: "${word}" not found.`;
}

document.getElementById("search").addEventListener("click", () => {getDefinition()});