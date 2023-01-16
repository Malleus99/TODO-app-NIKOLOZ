"use strict";
import { SVG_PATH_FAV_NO, SVG_PATH_FAV_YES } from "./supplementary.js";
/*QUERY SELECTORS */
// TODOS
const todoInput = document.querySelector(".todolist-input");
const todoSubmit = document.querySelector(".todolist-submit");
const todoContainer = document.getElementById("todo-container");
const addTodoContainer = document.querySelector(".addtodo-container");

// NAVIGATION
const todoListBtn = document.querySelector(".TODO-list");
const importantBtn = document.querySelector(".important-TODO-list");
///////////////////////////////////////////////////////////////////////////

let profileTodo = {
  username: "Cooper Anderson",
  todoList: [
    {
      todo: "Fold laundry",
      important: false,
    },
  ],
};
let currentNavigationSpace;
const updateLocalStorage = function () {
  localStorage.setItem("profileTodo", JSON.stringify(profileTodo));
};

const renderTodo = function () {
  todoContainer.innerHTML = "";
  addTodoContainer.classList.remove("hidden");
  const reverse = profileTodo.todoList.slice(0).reverse();
  const todos = reverse.map(
    (inst) => `
  <div class="todo-instance">
    <div class="todo-description">${inst.todo}</div>
      <div class="todo-important-mark">
        <svg class="svg-icon-favorite" viewBox="0 0 20 20">
          ${inst.important ? SVG_PATH_FAV_YES : SVG_PATH_FAV_NO}
        </svg>
      </div>
  </div>`
  );
  const finalTodos = todos.join("");
  todoContainer.insertAdjacentHTML("afterbegin", finalTodos);
  currentNavigationSpace = "TODO-list";
  updateLocalStorage();
};

const renderFavorite = function () {
  todoContainer.innerHTML = "";
  addTodoContainer.classList.add("hidden");
  let favorites = [];
  const favoritesFilter = function () {
    profileTodo.todoList.map((el) => {
      if (el.important) favorites.push(el);
    });
  };
  favoritesFilter();

  const reverse = favorites.slice(0).reverse();
  const todos = reverse.map(
    (inst) => `
  <div class="todo-instance">
    <div class="todo-description">${inst.todo}</div>
      <div class="todo-important-mark">
        <svg class="svg-icon-favorite" viewBox="0 0 20 20">
        ${inst.important ? SVG_PATH_FAV_YES : SVG_PATH_FAV_NO}
        </svg>
      </div>
  </div>`
  );
  const finalTodos = todos.join("");
  todoContainer.insertAdjacentHTML("afterbegin", finalTodos);
  currentNavigationSpace = "Important";
  updateLocalStorage();
};

// Fired on page load to retrieve data from localstorage, assaign it to profileTodo variable and render it.
const loadEffect = function () {
  const retrievedProfileTodo = JSON.parse(localStorage.getItem("profileTodo"));
  profileTodo = retrievedProfileTodo;
  renderTodo();
};

// Finds in which navigation panel you currently are and renders corresponding page
const spaceFinder = function () {
  if (currentNavigationSpace === "TODO-list") renderTodo();
  if (currentNavigationSpace === "Important") renderFavorite();
};

const createNewTodo = function (e) {
  e.preventDefault();
  if (todoInput.value < 3) {
    window.alert("TODO too short, TODO needs to be at least 3 letters long.");
  } else if (profileTodo.todoList.find((el) => el.todo === todoInput.value)) {
    window.alert("TODO with same name already exist");
  } else {
    const input = { todo: todoInput.value, important: false };
    profileTodo.todoList.push(input);
    renderTodo();
    todoInput.value = "";
  }
};

// Toggles {important:false/true} property on selected element
const markFavorite = function (e) {
  if (
    e.target.classList.contains("todo-important-mark") ||
    e.target.classList.contains("svg-icon-favorite")
  ) {
    const finder = e.target
      .closest(".todo-instance")
      .querySelector(".todo-description").innerHTML;
    const selectedTodo = profileTodo.todoList.find((el) => el.todo === finder);
    selectedTodo.important = !selectedTodo.important;
    spaceFinder();
  }
};

const removeTodo = function (e) {
  if (e.target.classList.contains("todo-description")) {
    const finder = e.target.innerHTML;
    const index = profileTodo.todoList.findIndex((el) => el.todo === finder);
    profileTodo.todoList.splice(index, 1);
    spaceFinder();
  }
};

/* EVENT LISTENERS */
// TODO LIST
todoSubmit.addEventListener("click", createNewTodo);

// Fired on favorite button click (toggles important: property)
todoContainer.addEventListener("click", markFavorite);

// Fired when clicked on todo-description area (excluding favorite button)
todoContainer.addEventListener("click", removeTodo);

// NAVIGATION BUTTONS
todoListBtn.addEventListener("click", renderTodo);
importantBtn.addEventListener("click", renderFavorite);

// PAGE LOAD
window.addEventListener("load", loadEffect);
