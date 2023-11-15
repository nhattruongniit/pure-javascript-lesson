const submitForm = document.getElementById("submitForm");
const tableUser = document.getElementById("tableUser");

const dataUsers = [];

// get value of input
function getValue(id) {
  return document.getElementById(id).value.trim();
}
// Hiển thị lỗi
function showError(key, mess) {
  document.getElementById(key + "_error").innerHTML = mess;
}

submitForm.addEventListener("submit", function (e) {
  e.preventDefault();

  // firstName
  const firstName = getValue("firstName");
  if (!firstName || !/^[a-zA-Z0-9]+$/.test(firstName)) {
    showError("firstName", "Please enter first name");
    return;
  } else {
    showError("firstName", "");
  }

  // lastName
  const lastName = getValue("lastName");
  if (!lastName || !/^[a-zA-Z0-9]+$/.test(lastName)) {
    showError("lastName", "Please enter last name");
    return;
  } else {
    showError("lastName", "");
  }

  // lastName
  const email = getValue("email");
  const mailformat =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  if (!email || !mailformat.test(email)) {
    showError("email", "Email wrong format");
    return;
  } else {
    showError("email", "");
  }

  const userItem = {
    id: Date.now(),
    firstName,
    lastName,
    email,
    gender: getValue("gender"),
  };

  dataUsers.push(userItem);

  renderUser(dataUsers); // demo
});

function renderUser(dataSource) {
  tableUser.innerHTML = "";

  dataSource.forEach((user) => {
    tableUser.innerHTML += `
      <tr>
        <th scope="row">${user.id}</th>
        <td>${user.firstName}</td>
        <td>${user.lastName}</td>
        <td>${user.email}</td>
        <td>${user.gender}</td>
      </tr>
  `;
  });
}
