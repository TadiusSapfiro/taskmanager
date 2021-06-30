import BoardComponent from "./components/board.js";
import FilterComponent from "./components/filter.js";
import LoadMoreButtonComponent from "./components/load-more-button.js";
import NoTasksComponent from "./components/no-tasks.js";
import TaskEditComponent from "./components/task-edit.js";
import TaskComponent from "./components/task.js";
import TasksComponent from "./components/tasks.js";
import SiteMenuComponent from "./components/site-menu.js";
import SortComponent from "./components/sort.js";
import {generateTasks} from "./mock/task.js";
import {generateFilters} from "./mock/filter.js";
import {render} from "./utils.js";

import {Count} from "./const.js";

// функции для отрисовки
const renderTask = (taskListElement, task) => {
  const replaceTaskToEdit = () => {
    taskListElement.replaceChild(taskEditComponent.getElement(), taskComponent.getElement());
  };

  const replaceEditToTask = () => {
    taskListElement.replaceChild(taskComponent.getElement(), taskEditComponent.getElement());
  };

  const onEscKeyDown = (evt) => {
    const isEscKey = evt.key === `Escape` || evt.key === `Esc`;

    if (isEscKey) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const taskComponent = new TaskComponent(task);
  const editButton = taskComponent.getElement().querySelector(`.card__btn--edit`);
  editButton.addEventListener(`click`, () => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  const taskEditComponent = new TaskEditComponent(task);
  const editForm = taskEditComponent.getElement().querySelector(`form`);
  editForm.addEventListener(`submit`, (evt) => {
    evt.preventDefault();
    replaceEditToTask();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(taskListElement, taskComponent.getElement());
};


const renderBoard = (boardComponent, tasks) => {
  const isAllTasksArchived = tasks.every((task) => task.isArchive);
  if (isAllTasksArchived) {
    render(boardComponent.getElement(), new NoTasksComponent().getElement());
    return;
  }

  const sortComponent = new SortComponent();
  render(boardComponent.getElement(), sortComponent.getElement());

  const tasksComponent = new TasksComponent();
  render(boardComponent.getElement(), tasksComponent.getElement());

  let showingTasksCount = Count.SHOWING_ON_START;
  tasks.slice(0, showingTasksCount)
    .forEach((task) => {
      renderTask(tasksComponent.getElement(), task);
    });

  const loadMoreButtonComponent = new LoadMoreButtonComponent();
  render(boardComponent.getElement(), loadMoreButtonComponent.getElement());

  loadMoreButtonComponent.getElement().addEventListener(`click`, () => {
    const prevTasksCount = showingTasksCount;
    showingTasksCount = showingTasksCount + Count.SHOWING_ON_START;

    tasks.slice(prevTasksCount, showingTasksCount)
      .forEach((task) => renderTask(tasksComponent.getElement(), task));

    if (showingTasksCount >= tasks.length) {
      loadMoreButtonComponent.getElement().remove();
      loadMoreButtonComponent.removeElement();
    }
  });
};

// мок-данные
const filters = generateFilters();
const tasks = generateTasks(Count.TASK);

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

render(siteHeaderElement, new SiteMenuComponent().getElement());
render(siteMainElement, new FilterComponent(filters).getElement());

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent.getElement());
renderBoard(boardComponent, tasks);

