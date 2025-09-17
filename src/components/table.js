import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    // @todo: #1.2 — добавить шаблоны до и после таблицы
before.reverse().forEach(subName => {
    // Клонируем шаблон и сохраняем объект в root
    root[subName] = cloneTemplate(subName);
    // Добавляем ДО таблицы (в начало контейнера)
    root.container.prepend(root[subName].container);
});

after.forEach(subName => {
    // Клонируем шаблон и сохраняем объект в root
    root[subName] = cloneTemplate(subName);
    // Добавляем ПОСЛЕ таблицы (в конец контейнера)
    root.container.append(root[subName].container);
});

    // @todo: #1.3 — добавить обработчики событий
root.container.addEventListener('change', () => {
    onAction(); // Вызываем onAction без аргументов
});

root.container.addEventListener('reset', () => {
    setTimeout(onAction); // Отложенный вызов с небольшой задержкой
});

root.container.addEventListener('submit', (e) => {
    e.preventDefault(); // Предотвращаем стандартное поведение формы
    onAction(e.submitter); // Передаем сабмиттер в onAction
});

    const render = (data) => {
    // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
    const nextRows = data.map(item => {
        const row = cloneTemplate(rowTemplate);
        
        // Перебираем ключи объекта item
        Object.keys(item).forEach(key => {
            // Проверяем, существует ли элемент с таким ключом в row.elements
            if (row.elements[key]) {
                // Устанавливаем текстовое содержимое элемента
                row.elements[key].textContent = item[key];
            }
        });
        
        return row.container; // Возвращаем DOM-элемент строки
    });
    
    root.elements.rows.replaceChildren(...nextRows);
}

    return {...root, render};
}