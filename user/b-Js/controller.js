import { navbar,RightNavbar } from "./nav-bar.js";

const logUser = localStorage.getItem("logId")
const jsNavbar = document.getElementById("js-navbar");
const rightNavbar = document.getElementById("js-right-navbar");

if(logUser === null) {
    window.location.href = "../page-register.html"
}


jsNavbar.innerHTML = navbar();
rightNavbar.innerHTML = RightNavbar()

