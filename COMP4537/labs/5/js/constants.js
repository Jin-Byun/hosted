export const ENDPOINT = "https://lab5-4537-c77337544cde.herokuapp.com/";
export const DEFAULT_PATIENTS = `('Sara Brown', '1901-01-01'),
('John Smith', '1941-01-01'),
('Jack Ma', '1961-01-30'),
('Elon Musk', '1999-01-01')`;
export const TABLE = "patient";
export const COLUMNS = "(name, dateOfBirth)";
export const METHODS = ["insert", "select"];
export const KEY = "query";

export const ERROR_EMPTY = "No Empty query.";
export const ERROR_MULTI_QUERY = "Please send 1 query at a time.";
export const ERROR_INVALID_METHOD = "only insert and select method is valid.";
