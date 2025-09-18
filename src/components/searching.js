// import {createComparison, defaultRules, rules} from "../lib/compare.js";

export function initSearching(searchField) {
  return (query, state, action) => {
    // Если есть поисковый запрос - добавляем в параметры
    return state[searchField]
      ? Object.assign({}, query, {
          search: state[searchField], // серверный параметр поиска
        })
      : query;
  };
}
