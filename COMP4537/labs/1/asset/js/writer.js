import { WEB_STORAGE_KEY, ADD_BUTTON_ID } from "./constant.js";
import {
  parseToWordObject,
  isEmpty,
  stringifyToIdContentPairs,
  updateCounter,
  addWordCard,
} from "./utils.js";

const words = {};
parseToWordObject(localStorage.getItem(WEB_STORAGE_KEY), words);

updateWriter();

document.getElementById(ADD_BUTTON_ID).addEventListener("click", () => {
  addWordCard(words);
});

/**
 * Stores the Words created every 2 seconds.
 */
function updateWriter() {
  setTimeout(() => {
    for (const word of Object.values(words)) {
      word.updateContent();
    }
    if (!isEmpty(words)) {
      updateCounter();
      const idContentPair = stringifyToIdContentPairs(words);
      localStorage.setItem(WEB_STORAGE_KEY, idContentPair);
    }
    updateWriter();
  }, 2000);
}
