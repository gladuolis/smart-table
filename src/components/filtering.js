export function initFiltering(elements) {
  const updateIndexes = (indexes) => {
    Object.keys(indexes).forEach((elementName) => {
      elements[elementName].append(
        ...Object.values(indexes[elementName]).map((name) => {
          const option = document.createElement("option");
          option.value = name;
          option.textContent = name;
          return option;
        })
      );
    });
  };

  const applyFiltering = (query, state, action) => {
    // @todo: #4.2 — обработать очистку поля
    if (action && action.name === "clear") {
      const field = action.dataset.field;
      const input =
        elements[field] || document.querySelector(`[name="${field}"]`);

      if (input) {
        input.value = ""; // Очищаем поле
        state[field] = "";
      }
    }

    // @todo: #4.5 — формируем параметры фильтрации
    const filter = {};
    Object.keys(elements).forEach((key) => {
      if (
        elements[key] &&
        ["INPUT", "SELECT"].includes(elements[key].tagName) &&
        elements[key].value
      ) {
        filter[`filter[${elements[key].name}]`] = elements[key].value;
      }
    });

    return Object.keys(filter).length
      ? Object.assign({}, query, filter)
      : query;
  };

  return {
    updateIndexes,
    applyFiltering,
  };
}
