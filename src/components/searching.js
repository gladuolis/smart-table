import {createComparison, defaultRules, rules} from "../lib/compare.js"; 

export function initSearching(searchField) {
    // @todo: #5.1 — настроить компаратор
    const compare = createComparison([
        defaultRules.skipEmptyTargetValues, // Пропускаем пустые значения поиска
        rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false) // Ищем по нескольким полям без учета регистра
    ]);

    return (data, state, action) => {
        // @todo: #5.2 — применить компаратор
        return data.filter(row => compare(row, state));
    }
}