/* api
url: https://tony-json-server.herokuapp.com/api/users
github: https://github.com/nhattruongniit/tony-json-server
*/

let listTodo;


const getUser = window.localStorage.getItem('users');
const user = JSON.parse(getUser);

fetch(`https://tony-json-server.herokuapp.com/api/todos`, {
    method: 'GET',
  })
  .then(res => res.json())
  .then(res => {
    listTodo = res.data;
    fetchTodos(res.data);
  })



// add new todo
const todoForm = document.getElementById('issueInputForm');
todoForm.addEventListener('submit', function(e) {
  e.preventDefault();
  const description = document.getElementById('description').value;
  const severity = document.getElementById('severity').value;

  // add todo
  const newTodo = {
    id: Date.now().toString(),
    description,
    severity,
    status: 'open'
  }
  fetch("https://tony-json-server.herokuapp.com/api/todos", {
    method: "POST",
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(newTodo)
  })
  .then(_ => {
    todoForm.reset();
    listTodo.push(newTodo);
    fetchTodos(listTodo);
  })
})

// update todo open->closed
function setStatus(todoId) {
  const status = document.getElementsByClassName("status");
  for (const index in listTodo) { 
    if (listTodo[index].id === todoId) {
      if(listTodo[index].status === 'open') {
        fetch(`https://tony-json-server.herokuapp.com/api/todos/${todoId}`, {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                status: "close"
            })
        })
        listTodo[index].status = "close";
        status[index].textContent = "close";
      } else {
        fetch(`https://tony-json-server.herokuapp.com/api/todos/${todoId}`, {
          method: "PATCH",
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              status: "open"
          })
        })
        listTodo[index].status = "open";
        status[index].textContent = "open";
      }
      fetchTodos(listTodo);
    }
  }
}

//filter status: open/closed
// const filterOptions = document.getElementById("filter");
// filterOptions.addEventListener("change", filterTodos);
// function filterTodos(e) {
//   const option = e.target.value;
//   // clone list todos
//   switch (e.target.value) {
//     case "open": {
//       const newTodos = listTodo.filter(todo => todo.status === option)
//       fetchTodos(newTodos);
//       break;
//     }
//     case "close": {
//       const newTodos = listTodo.filter(todo => todo.status === option)
//       fetchTodos(newTodos);
//       break;
//     }
//     default: {
//       fetchTodos(listTodo);
//       break;
//     }
//   }
// } 

// delete todo
function deleteTodo(todoId) {
  fetch(`https://tony-json-server.herokuapp.com/api/todos/${todoId}`, {
    method: 'DELETE'
  })
  .then(_ => {
    for (const index in listTodo) {
      if(listTodo[index].id === todoId) {
        listTodo.splice(index, 1);
        fetchTodos(listTodo);
      }
    }
  })
}

// fetch list todo
function fetchTodos(list) {
  const issuesList = document.getElementById('issuesList');
  issuesList.innerHTML = '';
  
  for (const index in list) {
    issuesList.innerHTML += `
      <div class="card">
        <div class="card-header d-flex align-items-center">
          ${list[index].id} <span class="badge badge-secondary status" style="display:inline-block; margin-left: 5px;">${list[index].status}</span>
        </div>
        <div class="card-body">
          <h5 class="card-title">${list[index].description}</h5>
          <p class="card-text"><span class="badge badge-primary">${list[index].severity}</span></p>
          <div class="d-flex justify-content-end">
            <button type="submit" class="btn btn-primary" style="margin-right: 10px;" onclick="setStatus(\'${list[index].id}\')">Close</button>
            <button type="submit" class="btn btn-danger" onclick="deleteTodo(\'${list[index].id}\')">Delete</button>
          </div>
        </div>
      </div>
      <br />
    `
  }
}
