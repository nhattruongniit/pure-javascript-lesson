# Build an Issue Tracker Application with pure javascript

## Track

- pure javascript
- bootstrap

## Api

use api: https://github.com/nhattruongniit/tony-json-server

## Flow diagram

![Flow](./images/flow.png)

## Tasks

### Register page

- Show msg “not match password & repeat password” when 2 field not match.

- Show msg “This email is taken” when the user input the same email.
- Show loading when calling api.
- Show popup success after user register success. -> It will redirect the login page when the user clicks the “Ok” button.

### Login page

- Khi users click Submit. Thi` navigate to index.html. If ko match vs localstorage. Show msgr error “User doesn’t exist”.

### Contact page

- Update information user.
- Khi user vao lai index page, thi` show cac information user vao trong field tuong ung.
- Khi users click the “logout” clear account trong localstorage & navigate to the Login page.
