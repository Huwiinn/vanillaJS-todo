const myForm = document.querySelector("#myForm");
const todoInput = document.querySelector(".todo_input");
const listContainer = document.getElementById("list_container");

// const addTask = (e) => {
//   e.preventDefault();

//   if (todoInput.value === "") {
//     alert("할 일을 입력해주세요!");
//   } else {
//     let li = document.createElement("li");
//     li.classList.add("todo");
//     li.innerHTML = todoInput.value;

//     listContainer.appendChild(li);

//     let span = document.createElement("span");
//     span.innerHTML = "\u00d7";
//     li.appendChild(span);
//   }
//   todoInput.value = "";
//   // saveTodo();
// };

// myForm.addEventListener("submit", addTask);

// listContainer.addEventListener("click", (e) => {
// console.log("e : ", e.target.tagName);
// console.log("e : ", e.target.classList);
// console.log("e : ", e.target.classList.toggle("checked"));
// console.log("listContainer.innerHTML : ", listContainer.innerHTML);

//   if (e.target.tagName === "LI") {
//     e.target.classList.toggle("checked");
//     saveTodo();
//   } else if (e.target.tagName === "SPAN") {
//     e.target.parentElement.remove();
//     // saveTodo();
//   }
// });

// const saveTodo = () => {
//   localStorage.setItem("todo", listContainer.innerHTML);
// };

// const showTodoList = () => {
//   listContainer.innerHTML = localStorage.getItem("todo");
// };

// showTodoList();
