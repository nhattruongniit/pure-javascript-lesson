// api
const backendAPI = "https://tony-json-server.herokuapp.com";

// an empty array store backend data
let dataIssues = [];

// get elements
const signoutBtn = document.getElementById("signout");
const issuesList = document.getElementById("issuesList");
const addForm = document.getElementById("issueInputForm");
const issueTitleInput = document.getElementById("inputIssueTitle");
const issueSeveritySelect = document.getElementById("severity-status");
const searchBox = document.getElementById("search-box");
const filterAllBtn = document.getElementById("all-status");
const filterOpenBtn = document.getElementById("open-status");
const filterCloseBtn = document.getElementById("close-status");
const orderBy = document.getElementById("sort-value");
const loading = document.getElementById("loadingSpinnerContainer");
const showError = document.getElementById("error-mess");

//// redirect if local storage empty
// const userEmail = localStorage.getItem('user');
// if (userEmail === null) {
//   window.location.href = '../../loginPage.html';
// }

// debounce text search
function debounce(callbackFn) {
  let timer;
  return (...args) => {
    if (timer) {
      clearTimeout(timer);
    }

    timer = setTimeout(() => {
      callbackFn.apply(null, args);
    }, 700);
  };
}

//// logout
signoutBtn.addEventListener("click", function () {
  localStorage.removeItem("user");
  window.location.href = "../../loginPage.html";
});

// fetch issues
function fetchIssues() {
  fetch(`https://jsonplaceholder.typicode.com/todos?_limit=10&_page=1`)
    .then((response) => response.json())
    .then((data) => {
      renderData(data);
    })
    .catch((error) => {
      console.log("error!");
      console.error(error);
      return;
    });
}

fetchIssues();

// render issues
function renderData(issues) {
  // map data from mock api
  const mapIssue = issues.map((issue) => {
    return {
      id: issue.id,
      title: issue.title,
      severity: issue.severity || "low",
      status: issue.status || "new",
    };
  });
  issuesList.innerHTML = "";

  dataIssues = mapIssue;

  console.log("mapIssue: ", mapIssue);

  mapIssue.forEach((issue) => {
    issuesList.innerHTML += `
        <li id="issue-list-item--${issue.id}" class="issue-list-item">
            <div class="list-item-header">
                <div for="" class="list-item-title">${issue.id}</div>
                <div id="issueStatus" class="list-item-status">
                    ${issue.status}
                </div>
            </div>
            <div class="list-item-content">
                <h3 class="issue-name">${issue.title}</h3>
                <div class="list-item-severity">${issue.severity}</div>
                <div class="list-item-group-btn">
                  <button
                      id="changeSttBtn"
                      class="btn btn--close"
                      onclick="closeIssue('${issue.id}','${issue.status}')"
                  >
                      ${issue.status === "new" ? "Close" : "Open"}
                  </button>
                  <button
                      class="btn btn--delete"
                      onclick="deleteIssue('${issue.id}')"
                  >Delete</button>
                </div>
            </div>
        </li>
        <br>
    `;
  });
}

// // form add issue event
addForm.addEventListener("submit", function (event) {
  event.preventDefault();
  loading.style.display = "flex";
  const title = issueTitleInput.value;
  const severity = issueSeveritySelect.value;
  const issueItem = {
    id: Date.now(),
    title,
    severity,
    status: "new",
  };
  const issues = [issueItem, ...dataIssues];

  setTimeout(() => {
    loading.style.display = "none";
    renderData(issues);
  }, 500);
});

// delete issue
function deleteIssue(id) {
  loading.style.display = "flex";
  const issuesFiltered = dataIssues.filter((issue) => issue.id !== Number(id));
  setTimeout(() => {
    loading.style.display = "none";
    renderData(issuesFiltered);
  }, 500);
}

// search issues
searchBox.addEventListener(
  "keyup",
  debounce(function (event) {
    loading.style.display = "flex";
    const searchString = event.target.value.toLowerCase();
    const issuesFiltered = dataIssues.filter((issue) =>
      issue.title.toLowerCase().includes(searchString)
    );
    setTimeout(() => {
      loading.style.display = "none";
      renderData(issuesFiltered);
    }, 500);
  })
);

// order by issues
orderBy.addEventListener("change", function (e) {
  const { value } = e.target;
  if (!value) {
    renderData(dataIssues);
  }

  if (value === "asc") {
    renderData(sortAsc(dataIssues));
  }
  if (value === "desc") {
    renderData(sortDesc(dataIssues));
  }
});

// sort order asc
function sortAsc(dataIssues) {
  const newIssues = JSON.parse(JSON.stringify(dataIssues)); // clone deep array  (! super important)
  return newIssues.sort((a, b) => {
    if (a.title < b.title) return -1;
  });
}

// sort order desc
function sortDesc(dataIssues) {
  const newIssues = JSON.parse(JSON.stringify(dataIssues)); // clone deep array  (! super important)
  return newIssues.sort((a, b) => {
    if (a.title > b.title) return -1;
  });
}

// filter issues
filterAllBtn.addEventListener("click", function (e) {
  renderData(dataIssues);
});

filterOpenBtn.addEventListener("click", function () {
  const issuesFiltered = dataIssues.filter((issue) => issue.status === "new");
  renderData(issuesFiltered);
});

filterCloseBtn.addEventListener("click", function () {
  console.log("dataIssues", dataIssues);
  const issuesFiltered = dataIssues.filter((issue) => issue.status === "close");
  renderData(issuesFiltered);
});

function closeIssue(id, status) {
  const issuesIndex = dataIssues.findIndex((issue) => issue.id === Number(id));

  if (issuesIndex !== -1) {
    const newIssues = JSON.parse(JSON.stringify(dataIssues)); // clone deep array  (! super important)
    const newStatus = status === "new" ? "close" : "new";
    newIssues[issuesIndex].status = newStatus;
    renderData(newIssues);
  }
}
