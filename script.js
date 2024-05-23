const myForm = document.querySelector("#myForm");
const todoInput = document.querySelector(".todo_input");
const listContainer = document.getElementById("list_container");

const addTask = (e) => {
  e.preventDefault();

  if (todoInput.value === "") {
    alert("할 일을 입력해주세요!");
  } else {
    let li = document.createElement("li");
    li.classList.add("todo");
    li.innerHTML = todoInput.value;

    listContainer.appendChild(li);

    todoInput.value = "";
  }
};

myForm.addEventListener("submit", addTask);
