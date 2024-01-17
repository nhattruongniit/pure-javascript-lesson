
function fakeApi(data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      fetch(data).then(res => res.json()).then(data => resolve(data))
    }, 1000)
  })
}

async function fetchQuestions() {
  const questions = await fakeApi('dataQuestion.json');
  return questions;
}

async function fetchSubmissions() {
  const submissions = await fakeApi('dataSubmissions.json');
  return submissions;
}


async function fetchQuestionsAndSubmissions() {
  const [questions, submissions] = await Promise.all([fetchQuestions(), fetchSubmissions()]);
  return { questions, submissions };
}

function getQuestionByCategory(questions) {
  const questionsByCategory = {};
  questions.forEach(question => {
    if(questionsByCategory.hasOwnProperty(question.category)) {
      questionsByCategory[question.category].push(question);
    } else {
      questionsByCategory[question.category] = [question];
    }
  });

  return questionsByCategory;
}

function getSubmissionById(submissions) {
  const submissionsById = {};
  submissions.forEach(submission => {
    submissionsById[submission.questionId] = submission.status;
  })
  return submissionsById;
} 

function createCategory(category, questions, submissionsById) {
  const columnDiv = document.createElement('div');
  columnDiv.classList.add('column');
  const h2 = document.createElement('h2');
  h2.textContent = category;
  columnDiv.appendChild(h2);

  questions.forEach(question => {
    const boardsDiv = document.createElement('div');
    boardsDiv.classList.add('boards');

    const questionDiv = document.createElement('div');
    questionDiv.classList.add('question');

    const questionStatusDiv = document.createElement('div');
    questionStatusDiv.classList.add('question__status');
    const statusClass = submissionsById[question.id] ? `question__status--${submissionsById[question.id].toLowerCase()}` : 'question__status--none';
    questionStatusDiv.classList.add(statusClass)

    const questionTitle = document.createElement('h2');
    questionTitle.classList.add('question__title');
    questionTitle.textContent = question.name;

    questionDiv.appendChild(questionStatusDiv);
    questionDiv.appendChild(questionTitle);
    boardsDiv.appendChild(questionDiv);  
    columnDiv.appendChild(boardsDiv);
  })

  return columnDiv;
}

async function fetchAndAppendQuestions() {
  const { questions, submissions } = await fetchQuestionsAndSubmissions();
  const questionByCategory = getQuestionByCategory(questions);
  const submissionsById = getSubmissionById(submissions);
  const question_board = document.getElementById('question_board');
  for(const [key, value] of Object.entries(questionByCategory)) {
    const categoryElement = createCategory(key, value, submissionsById);
    question_board.appendChild(categoryElement);
  }
}

fetchAndAppendQuestions()