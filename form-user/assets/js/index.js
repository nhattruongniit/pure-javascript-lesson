const submitForm = document.getElementById("submitForm");
const tableUser = document.getElementById("tableUser");

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
  console.log("submitForm: ");

  // 1 username
  const firstName = getValue("firstName");
  if (
    firstName == "" ||
    firstName.length < 5 ||
    !/^[a-zA-Z0-9]+$/.test(firstName)
  ) {
    showError("firstName", "Vui lòng kiểm tra lại first name");
  }

  renderUser([1]); // demo
});

function renderUser(dataSource) {
  tableUser.innerHTML = "";

  dataSource.forEach((user, index) => {
    tableUser.innerHTML += `
    <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">First Name</th>
        <th scope="col">Last Name</th>
        <th scope="col">Email</th>
        <th scope="col">Gender</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th scope="row">1</th>
        <td>Mark</td>
        <td>Otto</td>
        <td>tony@gmail.com</td>
        <td>Male</td>
      </tr>
    </tbody>
  `;
  });
}
