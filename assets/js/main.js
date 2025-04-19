const signinDiv = document.getElementById("signin-div");
const signupDiv = document.getElementById("signup-div");
const signupLink = document.getElementById("signup-link");
const signinLink = document.getElementById("signin-link");
const signinPIcon = document.getElementById("signin-p-icon");
const signupPIcon = document.getElementById("signup-p-icon");
const signinPassword = document.getElementById("signin-password");
const signupPassword = document.getElementById("signup-password");
const confirmSignUpPassword = document.getElementById(
  "confirm-signup-password"
);
const confirmSignupPIcon = document.getElementById("confirm-signup-p-icon");

signupLink.addEventListener("click", () => {
  signinDiv.classList.add("hidden");
  signupDiv.classList.remove("hidden");
});
signinLink.addEventListener("click", () => {
  signinDiv.classList.remove("hidden");
  signupDiv.classList.add("hidden");
});

let a = 0;
signinPIcon.addEventListener("click", () => {
  if (a === 0) {
    signinPIcon.innerHTML = `<i class="fa-solid fa-eye-slash"></i>`;
    signinPassword.setAttribute("type", "text");
    a = 1;
  } else {
    signinPIcon.innerHTML = `<i class="fa-solid fa-eye"></i>`;
    signinPassword.setAttribute("type", "password");
    a = 0;
  }
});
signupPIcon.addEventListener("click", () => {
  if (a === 0) {
    signupPIcon.innerHTML = `<i class="fa-solid fa-eye-slash"></i>`;
    signupPassword.setAttribute("type", "text");
    a = 1;
  } else {
    signupPIcon.innerHTML = `<i class="fa-solid fa-eye"></i>`;
    signupPassword.setAttribute("type", "password");
    a = 0;
  }
});
confirmSignupPIcon.addEventListener("click", () => {
  if (a === 0) {
    confirmSignUpPassword.innerHTML = `<i class="fa-solid fa-eye-slash"></i>`;
    confirmSignUpPassword.setAttribute("type", "text");
    a = 1;
  } else {
    confirmSignupPIcon.innerHTML = `<i class="fa-solid fa-eye"></i>`;
    confirmSignUpPassword.setAttribute("type", "password");
    a = 0;
  }
});
