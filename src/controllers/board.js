// функции для отрисовки
import {remove, render} from "../utils/render";
import TaskController from "../controllers/task";
// import TaskComponent from "../components/task";
import NoTasksComponent from "../components/no-tasks";
import SortComponent, {SortType} from "../components/sort";
import TasksComponent from "../components/tasks";
import LoadMoreButtonComponent from "../components/load-more-button";

import {Count} from "../const";


const renderTasks = (taskListElement, tasks, onDataChange, onViewChange) => {
  return tasks.map((task) => {
    const taskController = new TaskController(taskListElement, onDataChange, onViewChange);

    taskController.render(task);

    return taskController;
  });
};

const getSortedTasks = (tasks, sortType, from, to) => {
  const sortedTasks = tasks.slice();

  switch (sortType) {
    case SortType.DATE_UP:
      sortedTasks.sort((a, b) => a.dueDate - b.dueDate);
      break;
    case SortType.DATE_DOWN:
      sortedTasks.sort((a, b) => b.dueDate - a.dueDate);
      break;
    case SortType.DEFAULT:
      break;
  }

  return sortedTasks.slice(from, to);
};

export default class BoardController {
  constructor(container) {
    this._container = container;
    this._tasks = [];
    this._showedTaskControllers = [];
    this._showingTasksCount = Count.SHOWING_ON_START;

    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new LoadMoreButtonComponent();
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  render(tasks) {
    this._tasks = tasks;

    const isAllTasksArchived = this._tasks.every((task) => task.isArchive);
    if (isAllTasksArchived) {
      render(this._container.getElement(), this._noTasksComponent);
      return;
    }

    render(this._container.getElement(), this._sortComponent);
    render(this._container.getElement(), this._tasksComponent);

    // рендеринг первой пачки карточек
    const newTasks = renderTasks(this._tasksComponent.getElement(), this._tasks.slice(0, this._showingTasksCount), this._onDataChange, this._onViewChange);
    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

    this._renderLoadMoreButton();
  }

  _renderLoadMoreButton() {
    if (this._showingTasksCount >= this._tasks.length) {
      return;
    }

    render(this._container.getElement(), this._loadMoreButtonComponent);

    this._loadMoreButtonComponent.setClickHandler(() => {
      const prevTasksCount = this._showingTasksCount;

      this._showingTasksCount = this._showingTasksCount + Count.SHOWING_BY_BUTTON;

      // использую сортировку
      const sortedTasks = getSortedTasks(this._tasks, this._sortComponent.getSortType(), prevTasksCount, this._showingTasksCount);
      const newTasks = renderTasks(this._tasksComponent.getElement(), sortedTasks, this._onDataChange, this._onViewChange);
      this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

      if (this._showingTasksCount >= this._tasks.length) {
        remove(this._loadMoreButtonComponent);
      }
    });
  }

  _onSortTypeChange(sortType) {
    this._showingTasksCount = Count.SHOWING_ON_START;

    const sortedTasks = getSortedTasks(this._tasks, sortType, 0, this._showingTasksCount);

    this._tasksComponent.getElement().innerHTML = ``;

    this._showedTaskControllers = renderTasks(this._tasksComponent.getElement(), sortedTasks);
    this._renderLoadMoreButton();
  }

  _onDataChange(taskController, oldData, newData) {
    const index = this._tasks.findIndex((it) => it === oldData);

    if (index === -1) {
      return;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), newData, this._tasks.slice(index + 1));

    taskController.render(this._tasks[index]);
  }

  _onViewChange() {
    this._showedTaskControllers.forEach((it) => it.setDefaultView());
  }
}
