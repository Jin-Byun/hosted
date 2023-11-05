export const ROOT = "https://lab6-4537-39c44597f985.herokuapp.com";
export const LANGUAGE_EP = "api/languages";
export const WORD_EP = "api/dictionary/definition";
export const ADD_BUTTON_TEXT = "ADD Word";
export const ADD = "added to";
export const UPDATE = "definition updated in";
export const ONLY_LETTERS_AND_NUMBERS = /^[\u00BF-\u1FFF\u2C00-\uD7FF\w]+$/;
export const ERR_MSG = {
    regex: "invalid format for word. please do not include special characters.",
    empty: "Require non-whitespace input for word",
    bothEmpty: "Require input in both word and definition.",
    language: "Select language for word and definition from the dropdown."
}