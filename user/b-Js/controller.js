import { navbar,RightNavbar } from "./nav-bar.js";

const logUser = localStorage.getItem("logId")

if(logUser === null) {
    window.location.href = "../page-register.html"
}
const jsNavbar = document.getElementById("js-navbar");
const rightNavbar = document.getElementById("js-right-navbar");


jsNavbar.innerHTML = navbar();
rightNavbar.innerHTML = RightNavbar()

