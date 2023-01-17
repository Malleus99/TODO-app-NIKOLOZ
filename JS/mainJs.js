'use strict';
import { SVG_PATH_FAV_NO, SVG_PATH_FAV_YES } from './supplementary.js';
/*QUERY SELECTORS */
// TODOS
const todoInput = document.querySelector('.todolist-input');
const todoSubmit = document.querySelector('.todolist-submit');
const todoContainer = document.getElementById('todo-container');
const addTodoContainer = document.querySelector('.addtodo-container');

// NAVIGATION
const todoListBtn = document.querySelector('.TODO-list');
const importantBtn = document.querySelector('.important-TODO-list');
///////////////////////////////////////////////////////////////////////////

let profileTodo = {
  username: 'Cooper Anderson',
  todoList: [],
};

let currentNavigationSpace;

const updateLocalStorage = function () {
  localStorage.setItem('profileTodo', JSON.stringify(profileTodo));
};

// Used by renderTodo / renderFavorite functions
const generateTodo = function (todo) {
  const todoMarkup = todo
    .map(
      inst => `
  <div class="todo-instance">
    <div class="todo-description">${inst.todo}</div>
      <div class="btn-todo-initiation hidden">
        <button class="btn-delete btn-selector">✔</button>
        <button class="btn-disregard btn-selector">✖</button>
      </div>
      <div class="todo-important-mark">
        <svg class="svg-icon-favorite" viewBox="0 0 24 24">
          ${inst.important ? SVG_PATH_FAV_YES : SVG_PATH_FAV_NO}
        </svg>
      </div>
  </div>`
    )
    .join('');
  return (todoContainer.innerHTML = todoMarkup);
};

const renderTodo = function () {
  addTodoContainer.classList.remove('hidden');
  const reverse = profileTodo.todoList.slice(0).reverse();
  generateTodo(reverse);
  currentNavigationSpace = 'TODO-list';
  updateLocalStorage();
};

const renderFavorite = function () {
  addTodoContainer.classList.add('hidden');
  let favorites = [];
  profileTodo.todoList.map(el => {
    if (el.important) favorites.push(el);
  });
  const reverse = favorites.slice(0).reverse();
  generateTodo(reverse);
  currentNavigationSpace = 'Important';
  updateLocalStorage();
};

// Fired on page load to retrieve data from localstorage, assaign it to profileTodo variable and render it.
const loadEffect = function () {
  const retrievedProfileTodo = JSON.parse(localStorage.getItem('profileTodo'));
  if (retrievedProfileTodo) profileTodo = retrievedProfileTodo;
  renderTodo();
};

// Finds in which navigation panel you currently are and renders corresponding page
const spaceFinder = function () {
  if (currentNavigationSpace === 'TODO-list') renderTodo();
  if (currentNavigationSpace === 'Important') renderFavorite();
};

const createNewTodo = function (e) {
  e.preventDefault();
  if (todoInput.value.length < 3) {
    window.alert('TODO too short, TODO needs to be at least 3 letters long.');
    return;
  }
  if (profileTodo.todoList.find(el => el.todo === todoInput.value)) {
    window.alert('TODO with same name already exist');
    return;
  }
  const input = { todo: todoInput.value, important: false };
  profileTodo.todoList.push(input);
  renderTodo();
  todoInput.value = '';
};

// Toggles {important:false/true} property on selected element
const markFavorite = function (e) {
  if (
    e.target.classList.contains('todo-important-mark') ||
    e.target.classList.contains('svg-icon-favorite') ||
    e.target.classList.contains('svg-path')
  ) {
    const finder = e.target
      .closest('.todo-instance')
      .querySelector('.todo-description').innerHTML;
    const selectedTodo = profileTodo.todoList.find(el => el.todo === finder);
    selectedTodo.important = !selectedTodo.important;
    spaceFinder();
  }
};

// Auxillary function for initiateRemoval function
const resetTodoPanel = function () {
  const allTodoInstances = document.querySelectorAll('.todo-instance');
  allTodoInstances.forEach(el => el.classList.remove('removal-effect'));
  const allBtnsActive = document.querySelectorAll('.btn-todo-initiation');
  allBtnsActive.forEach(el => el.classList.add('hidden'));
};

// Auxillary function for initiateRemoval function
const removeTodo = function (e) {
  const finder = e.target;
  const index = profileTodo.todoList.findIndex(el => el.todo === finder);
  profileTodo.todoList.splice(index, 1);
  spaceFinder();
};

const initiateRemoval = function (e) {
  resetTodoPanel();
  if (e.target.classList.contains('todo-description')) {
    const parentEl = e.target.closest('.todo-instance');
    parentEl.classList.add('removal-effect');

    const btnsContainer = parentEl.querySelector('.btn-todo-initiation');
    btnsContainer.classList.remove('hidden');

    const btnDelete = btnsContainer.querySelector('.btn-delete');
    const btnDisregard = btnsContainer.querySelector('.btn-disregard');

    btnDelete.addEventListener('click', removeTodo);

    btnDisregard.addEventListener('click', resetTodoPanel);
  }
};

/* EVENT LISTENERS */
// TODO LIST
todoSubmit.addEventListener('click', createNewTodo);

// Fired on favorite button click (toggles important: property)
todoContainer.addEventListener('click', markFavorite);

// Fired when clicked on todo-description area (excluding favorite button)
todoContainer.addEventListener('click', initiateRemoval);

// NAVIGATION BUTTONS
todoListBtn.addEventListener('click', renderTodo);
importantBtn.addEventListener('click', renderFavorite);

// PAGE LOAD
window.addEventListener('load', loadEffect);
