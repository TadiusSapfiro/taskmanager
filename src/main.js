import {createSiteMenuTemplate} from "./view/site-menu.js";
import {createFilterTemplate} from "./view/filter.js";
import {createBoardTemplate} from "./view/board.js";
import {createTaskTemplate} from "./view/task.js";
import {createTaskEditTemplate} from "./view/task-edit.js";
import {createLoadMoreButtonTemplate} from "./view/load-more-button.js";
import {Count} from "./const.js";

const render = (container, template, place = `beforeend`) =>{
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, createSiteMenuTemplate());
render(siteMainElement, createFilterTemplate());
render(siteMainElement, createBoardTemplate());

const taskListElement = siteMainElement.querySelector(`.board__tasks`);
const boardElement = siteMainElement.querySelector(`.board`);

render(taskListElement, createTaskEditTemplate());

for (let i = 0; i < Count.TASK; i++) {
  render(taskListElement, createTaskTemplate());
}

render(boardElement, createLoadMoreButtonTemplate());
