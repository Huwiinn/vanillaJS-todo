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

        let div = document.createElement("div");
        div.classList.add("icon_wrap");
        li.appendChild(div);

        let span = document.createElement("span");
        span.classList.add("closeBtn");
        span.innerHTML = "\u00d7";

        let editBtn = document.createElement("span");
        editBtn.classList.add("todoEdit");
        editBtn.innerHTML = "&#9999"; // 연필 모양의 유니코드 이스케이프 시퀸스 문자
        div.appendChild(editBtn);

        // 수정 이벤트 리스너 연결
        editBtn.addEventListener("click", editTodoHandler);

        // 삭제 이벤트 리스너 연결
        span.addEventListener("click", () => removeTodo(todo.id));
        div.appendChild(span);
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

// Todo 수정 이벤트 리스너 설정해야함.
const editTodoHandler = (e) => {
  // console.log("e : ", e.target.parentElement.parentElement);

  let editInput = document.createElement("input");

  editInput.classList.add("editInput");
  editInput.setAttribute("type", "text"); // 지정된 요소의 속성 값을 설정 (name, value)

  if (e.target.parentElement.parentElement) {
    e.target.parentElement.parentElement.remove();
  }

  // 수정 버튼을 클릭하면, li 요소는 사라지고 Input 요소가 들어와야 함. 최초 클릭시, 기존에 li에 있던 텍스트 value를 기본값으로 둬야할 것.
  // 토글 형식으로 한 번 클릭하면 input, 두 번 클릭시 기존으로 돌아가도록.

  listContainer.appendChild(editInput);
};

// 로그인 시도 함수
const signInWithGithub = async () => {
  const { data, error } = await client.auth.signInWithOAuth({
    provider: "github",
    options: {
      redirectTo: "http://127.0.0.1:5500",
    },
  });

  console.log("oauth data : ", data);
};

document.querySelector("#login").addEventListener("click", signInWithGithub);

// 로그인 상태 확인
const checkLogin = async () => {
  const authInfo = await client.auth.getSession();
  const session = authInfo.data.session;

  document.querySelector("#login").style.display = "none";
  document.querySelector("#logout").style.display = "none";

  console.log("session : ", session);

  if (session === null) {
    document.querySelector("#login").style.display = "block";
  } else {
    document.querySelector("#logout").style.display = "block";
  }
};

checkLogin();

// 로그아웃
const signOut = async () => {
  const { error } = await client.auth.signOut();
  checkLogin(); // 로그아웃 후에 상태변화 업데이트
};

document.querySelector("#logout").addEventListener("click", signOut);

const refreshHistory = async () => {
  let { data: record, error } = await client.from("page").select("*");
  let tag = "";

  console.log(record);

  for (let i = 0; i < record.length; i++) {
    tag += `<div style="margin:20px 0"><h2>${record[i].title}</h2>${record[i].body}
    <p><input type="button" value="delete" onclick="deleteRecord(${record[i].id})" /></p>
    <p><input type="button" value="update" onclick="updateRecord(${record[i].id})" /></p>
</div>`;
  }
  document.querySelector("#history").innerHTML = tag;
};

refreshHistory();

const createPost = async () => {
  const { data, error } = await client
    .from("page")
    .insert([{ title: prompt("title?"), body: prompt("body?") }]);

  refreshHistory();
};

document.querySelector("#create_btn").addEventListener("click", createPost);

const deleteRecord = async (id) => {
  const { data, error } = await client.from("page").delete().eq("id", id);
  refreshHistory();
};
