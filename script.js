// js supabase client set
const supabaseUrl = "https://kjjlmfateoqhwftmotbb.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqamxtZmF0ZW9xaHdmdG1vdGJiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY0Nzc0NTEsImV4cCI6MjAzMjA1MzQ1MX0.BYLqlNIaBAMSsFUMpOWnt5Ck6HXGT_0U13DA_NEYJLg";
const client = supabase.createClient(supabaseUrl, supabaseKey);

// TodoList를 업데이트하는 함수
async function refreshTodoList(update = false) {
  let { data: todoList, error } = await client.from("todoList").select("*");
  const listContainer = document.querySelector("#list_container");
  // console.log("todoList : ", todoList)

  if (update === false) {
    const renderTodo = () => {
      // 기존 배열 초기화
      listContainer.innerHTML = "";

      // 배열 업데이트
      todoList.forEach((todo) => {
        let li = document.createElement("li");
        if (todo.success) {
          li.classList.add("checked");
        }
        li.classList.add("todo");
        li.id = todo.id;
        li.innerHTML = todo.title;
        listContainer.appendChild(li);

        let span = document.createElement("span");
        span.classList.add("closeBtn");
        span.innerHTML = "\u00d7";

        // 삭제 이벤트 리스너 연결
        span.addEventListener("click", () => removeTodo(todo.id));
        li.appendChild(span);
      });
    };

    // Todo 상태 업데이트 시에 실행
    if (update === true) {
      const updateRenderTodo = () => {
        // 취소선 요소 업데이트
        todoList.forEach((todo) => {
          if (todo.success) {
            li.classList.add("checked");
          }
        });
      };
      return updateRenderTodo();
    }
    return renderTodo();
  }
}

refreshTodoList();

// Todo를 추가하는 함수
async function addTodoTask(e) {
  e.preventDefault();
  const todoInput = document.querySelector(".todo_input");

  if (todoInput.value === "") {
    return alert("할 일을 작성해주세요.");
  }

  // db에 데이터 추가
  const { data: todoList, error } = await client
    .from("todoList")
    .insert([{ title: todoInput.value }]);

  todoInput.value = "";

  await refreshTodoList();
}

document.querySelector(".add_todo_btn").addEventListener("click", addTodoTask);

// Todo 삭제 함수
async function removeTodo(id) {
  const { error } = await client.from("todoList").delete().eq("id", id);

  if (error) {
    alert("다시 시도해주세요.");
  }

  await refreshTodoList();
}

// Todo 상태 업데이트 함수
const updateTodo = async (id, classList) => {
  let successValue = classList.contains("checked"); // checked가 있는지 확인하여 boolean값 할당;

  const { data, error } = await client
    .from("todoList")
    .update({ success: successValue }) // 'success' 열을 업데이트합니다.
    .eq("id", id) // 해당 id를 가진 행을 선택합니다.
    .select();

  await refreshTodoList(true);
};

const listContainer = document.getElementById("list_container");

listContainer.addEventListener("click", (e) => {
  // 취소선 상태를 어떻게 저장한담? => 변경된 내용을 업데이트 시켜줘야지!
  // 업데이트 함수 만들기

  if (e.target.tagName === "LI") {
    id = e.target.id;
    classList = e.target.classList;

    e.target.classList.toggle("checked");
  }

  updateTodo(id, classList);
});
