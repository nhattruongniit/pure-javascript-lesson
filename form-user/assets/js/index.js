const submitForm = document.getElementById("submitForm");

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
});
