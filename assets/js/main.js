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

let signinVisible = false;
signinPIcon.addEventListener("click", () => {
  if (!signinVisible) {
    signinPIcon.innerHTML = `<i class="fa-solid fa-eye-slash"></i>`;
    signinPassword.setAttribute("type", "text");
    signinVisible = true;
  } else {
    signinPIcon.innerHTML = `<i class="fa-solid fa-eye"></i>`;
    signinPassword.setAttribute("type", "password");
    signinVisible = false;
  }
});

let signupVisible = false;
signupPIcon.addEventListener("click", () => {
  if (!signupVisible) {
    signupPIcon.innerHTML = `<i class="fa-solid fa-eye-slash"></i>`;
    signupPassword.setAttribute("type", "text");
    signupVisible = true;
  } else {
    signupPIcon.innerHTML = `<i class="fa-solid fa-eye"></i>`;
    signupPassword.setAttribute("type", "password");
    signupVisible = false;
  }
});

let confirmSignupVisible = false;
confirmSignupPIcon.addEventListener("click", () => {
  if (!confirmSignupVisible) {
    confirmSignupPIcon.innerHTML = `<i class="fa-solid fa-eye-slash"></i>`;
    confirmSignUpPassword.setAttribute("type", "text");
    confirmSignupVisible = true;
  } else {
    confirmSignupPIcon.innerHTML = `<i class="fa-solid fa-eye"></i>`;
    confirmSignUpPassword.setAttribute("type", "password");
    confirmSignupVisible = false;
  }
});
