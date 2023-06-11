





























// api
const backendAPI = 'https://tony-json-server.herokuapp.com';

// an empty array store backend data
let dataIssues = [];

// get elements
const signoutBtn = document.getElementById('signout');

const issuesList = document.getElementById('issuesList');
const addForm = document.getElementById('issueInputForm');
const issueDescriptionInput = document.getElementById('inputIssueDescription');
const issueSeveritySelect = document.getElementById('severity-status');
const searchBox = document.getElementById('search-box');
const filterAllBtn = document.getElementById('all-status');
const filterOpenBtn = document.getElementById('open-status');
const filterCloseBtn = document.getElementById('close-status');
const filterAll = filterAllBtn.value;
const filterOpen = filterOpenBtn.value;
const filterClose = filterCloseBtn.value;
const orderBy = document.getElementById('sort-value');

const loading = document.getElementById('loadingSpinnerContainer');
const showError = document.getElementById('error-mess');

//// redirect if local storage empty
// const userEmail = localStorage.getItem('user');
// if (userEmail === null) {
//   window.location.href = '../../loginPage.html';
// }

//// logout
signoutBtn.addEventListener('click', function () {
  localStorage.removeItem('user');
  window.location.href = '../../loginPage.html';
});

// enable autoReload
autoReload();

// call api
function callApi(callback) {
  fetch(`https://jsonplaceholder.typicode.com/todos?_limit=10&_page=1`)
    .then((response) => response.json())
    .then(callback)
    .catch((error) => {
      console.log('error!');
      console.error(error);
      return;
    });
}

// autoReload
function autoReload() {
  callApi((responseData) => {
    // console.log('day la issue: ', responseData);
    renderData(responseData);
  });
}

// renderData
function renderData(issues) {

  // map data from mock api
  const mapIssue = issues.map(issue => {
    return {
      id: issue.id,
      title: issue.title,
      description: issue.title,
      severity: issue.completed ? 'close' : 'new',
      status: issue.completed ? 'close' : 'new',
    }
  })
  issuesList.innerHTML = '';

  dataIssues = mapIssue;

  mapIssue.forEach((issue) => {
    issuesList.innerHTML += `
        <li id="issue-list-item--${issue.id}" class="issue-list-item">
            <div class="list-item-header">
                <div for="" class="list-item-title">Title</div>
                <div id="issueStatus" class="list-item-status">
                    ${issue.status}
                </div>
            </div>
            <div class="list-item-content">
                <h3 class="issue-name">${issue.description}</h3>
                <div class="list-item-severity">${issue.severity}</div>
                <div class="list-item-group-tabc">
                  <div class="list-item-group-author">
                    <img src="https://i.pravatar.cc/150?img=3" />
                    <img src="https://i.pravatar.cc/150?img=3" />
                  </div>
                  <div class="list-item-group-btn">
                    <button 
                        id="changeSttBtn" 
                        class="btn btn--close" 
                        onclick="updateIssueStt('${issue.id}', 
                            '${issue.status}')"
                    >
                        ${issue.status === 'new' ? 'Close' : 'Open'}
                    </button>
                    <button 
                        class="btn btn--delete" 
                        onclick="deleteIssue('${issue.id}')"
                    >Delete</button>
                  </div>
                </div>
            </div>
        </li>
        <br>
    `;
  });
}

// form add issue event
addForm.addEventListener('submit', function (event) {
  event.preventDefault();
  loading.style.display = 'flex';
  addIssue();
});

// add new issue
function addIssue() {
  const issueDescription = issueDescriptionInput.value;
  const issueSeverity = issueSeveritySelect.value;
  const createIssueId = new Date();

  // check validate description input
  if (issueDescription === '') {
    setTimeout(() => {
      loading.style.display = 'none';
      showError.style.display = 'flex';
      showError.style.animation = 'animation: popUpError 1.2s';
      showError.innerHTML = 'Please enter Issue Description';
    }, 500);

    setTimeout(() => {
      showError.style.display = 'none';
    }, 3000);
    return;
  }

  // example data template
  const newIssue = {
    id: createIssueId,
    title: 'Learn React',
    description: issueDescription,
    severity: issueSeverity,
    status: 'new',
  };

  // Post issue to server
  fetch(`${backendAPI}/api/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newIssue),
  }).then(autoReload);

  setTimeout(() => {
    loading.style.display = 'none';
    issueDescriptionInput.value = '';
  }, 1000);
}

// delete issue
function deleteIssue(id) {
  fetch(`${backendAPI}/api/todos/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(autoReload);
}

// change issue's status
function changeIssueStt(stt) {
  let newStt = '';
  if (stt === 'close') {
    newStt = 'new';
  }
  if (stt === 'new') {
    newStt = 'close';
  }
  return newStt;
}

// update issue's status
function updateIssueStt(id, stt) {
  if (!id) {
    setTimeout(() => {
      loading.style.display = 'none';
      showError.style.display = 'flex';
      showError.style.animation = 'animation: popUpError 1.2s';
      showError.innerHTML = 'Can not update issue';
    }, 1000);

    setTimeout(() => {
      showError.style.display = 'none';
    }, 4000);
    return;
  }

  // new status
  const updateStt = changeIssueStt(stt);

  // example update data template
  const updateIssue = {
    status: updateStt,
  };

  fetch(`${backendAPI}/api/todos/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updateIssue),
  });

  const newIssues = JSON.parse(JSON.stringify(dataIssues)); // clone deep array  (! super important)

  const issueIndex = newIssues.findIndex((issue) => issue.id === id);

  newIssues[issueIndex].status = updateStt;
  // console.log('newIssues: ', newIssues)

  renderData(newIssues);
}

//// debounce text search
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

// search feature
searchBox.addEventListener(
  'keyup',
  debounce(function (event) {
    searchIssue(event);
  })
);

function searchIssue(event) {
  const searchString = event.target.value.toLowerCase();
  // console.log(searchString)
  //   console.log('dataIssues: ', dataIssues);

  const issues = dataIssues;
  //   console.log('issues moi:', issues);
  issuesList.innerHTML = '';
  const matchedIssues = issues.filter((issue) => {
    return issue.description.toLowerCase().includes(searchString);
  });
  matchedIssues.forEach((issue) => {
    issuesList.innerHTML += `
            <li id="issue-list-item--${issue.id}" class="issue-list-item">
                <div class="list-item-header">
                    <div for="" class="list-item-title">Title</div>
                    <div id="issueStatus" class="list-item-status">
                        ${issue.status}
                    </div>
                </div>
                <div class="list-item-content">
                    <h3 class="issue-name">${issue.description}</h3>
                    <div class="list-item-severity">${issue.severity}</div>
                    <div>
                      <div class="list-item-group-author">
                        <img src="https://i.pravatar.cc/150?img=3" />
                      </div>
                      <div class="list-item-group-btn">
                        <button 
                            id="changeSttBtn" 
                            class="btn btn--close" 
                            onclick="updateIssueStt('${issue.id}', 
                                '${issue.status}')"
                        >
                            ${issue.status === 'new' ? 'Close' : 'Open'}
                        </button>
                        <button 
                            class="btn btn--delete" 
                            onclick="deleteIssue('${issue.id}')"
                        >Delete</button>
                      </div>
                    </div>
                </div>
            </li>
            <br>
        `;
  });
}

// filter btn event
filterAllBtn.addEventListener('click', function () {
  filterManual(filterAll);
});

filterOpenBtn.addEventListener('click', function () {
  filterManual(filterOpen);
});

filterCloseBtn.addEventListener('click', function () {
  filterManual(filterClose);
});

// filter issue
function filterManual(value) {
  const issues = dataIssues;
  // console.log(issues)
  issuesList.innerHTML = '';
  const filteredIssues = issues.filter((issue) => {
    if (value === 'open') return issue.status.toLowerCase() === 'new';
    if (value === 'close') return issue.status.toLowerCase() === value;
    if (value === 'all')
      return (
        issue.status.toLowerCase() === 'new' ||
        issue.status.toLowerCase() === 'close'
      );
  });
  filteredIssues.forEach((issue) => {
    issuesList.innerHTML += `
                <li id="issue-list-item--${issue.id}" class="issue-list-item">
                    <div class="list-item-header">
                        <div for="" class="list-item-title">${issue.id}</div>
                        <div id="issueStatus" class="list-item-status">${
                          issue.status
                        }</div>
                    </div>
                    <div class="list-item-content">
                        <h3 class="issue-name">${issue.description}</h3>
                        <div class="list-item-severity">${issue.severity}</div>
                        <div class="list-item-group-btn">
                        
                            <button id="changeSttBtn" class="btn btn--close" onclick="updateIssueStt('${
                              issue.id
                            }', '${issue.status}')">
                                ${issue.status === 'new' ? 'Close' : 'Open'}
                            </button>
                            <button class="btn btn--delete" onclick="deleteIssue('${
                              issue.id
                            }')">Delete</button>
                        </div>
                    </div>
                </li>
                <br>
            `;
  });
}

// order by event
orderBy.addEventListener('change', function () {
  if (orderBy.value === '') autoReload();

  if (orderBy.value === 'asc') {
    renderData(sortAsc(dataIssues));
  }
  if (orderBy.value === 'desc') {
    renderData(sortDesc(dataIssues));
  }
});

// sort order asc
function sortAsc(dataIssues) {
  const allData = dataIssues;
  return allData.sort((a, b) => {
    if (a.description < b.description) return -1;
  });
}

// sort order desc
function sortDesc(dataIssues) {
  const allData = dataIssues;
  return allData.sort((a, b) => {
    if (a.description > b.description) return -1;
  });
}



// fetch data -> implement DOM -> update -> DOM -> render UI
// initial:  fetch data -> render UI 
// updat/delete option 1: filter data -> fetch api -> render UI  (user wait 5s to view new UI)
// updat/delete option 2: filter data -> render UI ->  fetch api background