import { getPages } from "../lib/utils.js";

export const initPagination = (
  { pages, fromRow, toRow, totalRows },
  createPage
) => {
  const pageTemplate = pages.firstElementChild.cloneNode(true);
  pages.firstElementChild.remove();

  let pageCount;

  const applyPagination = (query, state, action) => {
    // @todo: #2.1 — посчитать количество страниц, объявить переменные и константы
    const rowsPerPage = state.rowsPerPage;
    let page = state.page;

    // @todo: #2.6 — обработать действия
    if (action)
      switch (action.name) {
        case "prev":
          page = Math.max(1, page - 1);
          break;
        case "next":
          page = Math.min(pageCount, page + 1);
          break;
        case "first":
          page = 1;
          break;
        case "last":
          page = pageCount;
          break;
      }

    return Object.assign({}, query, {
      limit: rowsPerPage,
      page: page,
    });
  };

  const updatePagination = (total, { page, limit }) => {
    // @todo: #2.4 — получить список видимых страниц и вывести их
    pageCount = Math.ceil(total / limit);
    const visiblePages = getPages(page, pageCount, 5);
    pages.replaceChildren(
      ...visiblePages.map((pageNumber) => {
        const el = pageTemplate.cloneNode(true);
        return createPage(el, pageNumber, pageNumber === page);
      })
    );

    // @todo: #2.5 — обновить статус пагинации
    fromRow.textContent = (page - 1) * limit + 1;
    toRow.textContent = Math.min(page * limit, total);
    totalRows.textContent = total;
  };

  return {
    applyPagination,
    updatePagination,
  };
};
