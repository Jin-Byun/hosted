import {ROOT, ENDPOINT, ONLY_ABC, ADD_BUTTON_TEXT} from "./constants.js";

function addDefinition() {
    const term = document.getElementById("terminology").value.trim();
    const definition = document.getElementById("definition").value.trim();
    if (term === "" || definition === "") {
        alert("Require input in both terminology and definition.");
        return;
    }
    if (!ONLY_ABC.test(term)) {
        alert("no number permitted in terminology.");
        return;
    }
    const xhttp = new XMLHttpRequest();
    xhttp.open("POST", `${ROOT}/${ENDPOINT}/`, true);
    xhttp.onreadystatechange = function() {
        if (this.readyState !== 4) return;
        const button = document.getElementById("add");
        if (this.status == 200) {
           button.innerText = this.responseText;
           button.className = "success";
        } else {
            button.innerText = this.responseText;
            button.className = "fail";
        }
        setTimeout(() => {
            if (this.status === 200) {
                document.getElementById("terminology").value = "";
                document.getElementById("definition").value = "";
            }
            button.className = "";
            button.innerText = ADD_BUTTON_TEXT;
        }, 3000);
    };
    xhttp.send(`word=${term}&definition=${definition}`);
}

document.getElementById("add").addEventListener("click", () => {addDefinition()});