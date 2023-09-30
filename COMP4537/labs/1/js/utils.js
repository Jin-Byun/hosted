import { WORD_CONTAINER_ID, COUNTER_ID, WEB_STORAGE_KEY } from "./constant.js";
import Word from "./word.js";

/**
 * Add new word card from add button click.
 * @param {Object(id: Word) | {}}} words
 */
export function addWordCard(words) {
  const id = Date.now().toString(16);
  const wordContainer = document.getElementById(WORD_CONTAINER_ID);
  words[id] = new Word(id, wordContainer);
}

/**
 * Remove word from DOM and Object reference.
 * @param {Element} removeButton
 * @param {Object(id: Word) | {}} words
 */
export function removeCard(removeButton, words) {
  const card = removeButton.parentElement;
  const id = card.id;
  words[id].remove();
  delete words[id];
  const idContentPair = stringifyToIdContentPairs(words);
  localStorage.setItem(WEB_STORAGE_KEY, idContentPair);
  updateCounter();
}

/**
 * Convert localStorage string to Object that stores Word.
 * @param {String} jsonString from localStorage
 * @param {Object(id: Word) | {}} wordObj
 */
export function parseToWordObject(jsonString, wordObj, editable = true) {
  if (!jsonString || jsonString === "{}") return;
  const wordContainer = document.getElementById(WORD_CONTAINER_ID);
  const IdContentPairs = JSON.parse(jsonString);
  Object.entries(IdContentPairs).forEach(([id, content]) => {
    wordObj[id] = new Word(id, wordContainer, content, editable);
    document.getElementById(`remove-${id}`).addEventListener("click", (e) => {
      removeCard(e.target, wordObj);
    });
  });
}

/**
 * Create Id: Content pair object and stringify it.
 * @param {Object(id: Word) | {}} wordObject
 * @returns Stringified id: content pairs
 */
export function stringifyToIdContentPairs(wordObject) {
  if (isEmpty(wordObject)) return JSON.stringify({});
  const idContentPair = {};
  for (const { id, content } of Object.values(wordObject)) {
    idContentPair[id] = content;
  }
  return JSON.stringify(idContentPair);
}

/**
 * Check whether the object is empty (no properties).
 * @param {object} obj
 * @returns true if empty, false if not.
 */
export function isEmpty(obj) {
  for (const prop in obj) {
    if (Object.hasOwn(obj, prop)) {
      return false;
    }
  }
  return true;
}

/**
 * Update the counter to display when the content is stored/refreshed.
 */
export function updateCounter() {
  const currentTime = new Date().toLocaleTimeString();
  document.getElementById(COUNTER_ID).innerText = currentTime;
}
