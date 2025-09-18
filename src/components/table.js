import { cloneTemplate } from "../lib/utils.js";

export function initTable(settings, onAction) {
  const { tableTemplate, rowTemplate, before, after } = settings;
  const root = cloneTemplate(tableTemplate);

  // ✅ Шаблоны до и после таблицы
  before.reverse().forEach((subName) => {
    root[subName] = cloneTemplate(subName);
    root.container.prepend(root[subName].container);
  });

  after.forEach((subName) => {
    root[subName] = cloneTemplate(subName);
    root.container.append(root[subName].container);
  });

  // ✅ Обработчики событий
  root.container.addEventListener("change", () => {
    onAction();
  });

  root.container.addEventListener("reset", () => {
    setTimeout(onAction);
  });

  root.container.addEventListener("submit", (e) => {
    e.preventDefault();
    onAction(e.submitter);
  });

  const render = (data) => {
    const nextRows = data.map((item) => {
      const row = cloneTemplate(rowTemplate);

      Object.keys(item).forEach((key) => {
        if (row.elements[key]) {
          const element = row.elements[key];
          const value = item[key];

          // ✅ УЛУЧШЕННАЯ ПРОВЕРКА ТИПОВ ЭЛЕМЕНТОВ:
          if (
            element.tagName === "INPUT" ||
            element.tagName === "SELECT" ||
            element.tagName === "TEXTAREA"
          ) {
            // Для полей ввода используем value
            element.value = value !== null && value !== undefined ? value : "";
          } else if (element.tagName === "IMG") {
            // Для изображений используем src
            element.src = value || "";
          } else if (element.tagName === "A" && element.hasAttribute("href")) {
            // Для ссылок используем href
            element.href = value || "#";
            element.textContent = value || "";
          } else if (
            element.tagName === "CHECKBOX" ||
            element.type === "checkbox"
          ) {
            // Для чекбоксов используем checked
            element.checked = Boolean(value);
          } else {
            // Для остальных элементов используем textContent
            element.textContent =
              value !== null && value !== undefined ? value : "";
          }
        }
      });

      return row.container;
    });

    root.elements.rows.replaceChildren(...nextRows);
  };

  return { ...root, render };
}
