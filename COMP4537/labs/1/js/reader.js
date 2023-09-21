import { WEB_STORAGE_KEY, WORD_CONTAINER_ID } from "./constant.js";
import Word from "./word.js";
import { parseToWordObject, updateCounter } from "./utils.js";

const words = {};
parseToWordObject(localStorage.getItem(WEB_STORAGE_KEY), words);
updateReader();

/**
 * Updates the content of the page every 2 seconds.
 */
function updateReader() {
  updateCounter();
  setTimeout(() => {
    const newIdContentPair = JSON.parse(localStorage.getItem(WEB_STORAGE_KEY)) ?? {};
    const newIds = Object.keys(newIdContentPair);
    const wordContainer = document.getElementById(WORD_CONTAINER_ID);
    for (const id of newIds) {
      words[id] ??= new Word(id, wordContainer);
      words[id].updateContent(newIdContentPair[id]);
      words[id].updateDOM();
    }
    for (const id in words) {
      if (newIds.includes(id)) continue;
      words[id].remove();
      delete words[id];
    }
    updateReader();
  }, 2000);
}
