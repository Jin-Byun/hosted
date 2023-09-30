export default class Word {
  constructor(id, wordContainer, content = "", editable) {
    this.id = id;
    this.content = content;
    wordContainer.appendChild(this.init(editable));
  }
  init(editable) {
    return document.createRange().createContextualFragment(
      `<div class="wordCard" id="${this.id}">
              <div class="editable" ${editable ? "contenteditable" : ""}>${this.content}</div>
              <button id="remove-${this.id}" class="remove">Remove</button>
          </div>`
    );
  }
  updateContent(value = undefined) {
    if (value === undefined) {
      const card = document.getElementById(this.id);
      this.content = card.firstElementChild.innerText;
    } else {
      this.content = value;
    }
  }
  updateDOM() {
    const card = document.getElementById(this.id);
    card.firstElementChild.innerText = this.content;
  }
  remove() {
    document.getElementById(this.id).remove();
  }
}
