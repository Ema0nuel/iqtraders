// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  getFirestore,
  getDoc,
  doc,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASg5UlPTgE0HH-iM3HRfeMSY2a2Noa3o4",
  authDomain: "iqtraders1.firebaseapp.com",
  projectId: "iqtraders1",
  storageBucket: "iqtraders1.firebasestorage.app",
  messagingSenderId: "538849101252",
  appId: "1:538849101252:web:ffbbd7906c267ce7231091",
  measurementId: "G-J7LYXPLFWF",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(); 
const db = getFirestore();

const logUser = localStorage.getItem("logId");
if (logUser == null) {
  window.location.href = "../page-register.html"
}

const userNameNav = document.getElementById("username-nav");

onAuthStateChanged(auth, (user) => {
  if (logUser) {
    const docRef = doc(db, "users", logUser)

    getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        const userData = docSnap.data();
        userNameNav.innerText = `${userData.firstName}`
      }
    }).catch((error) => {
      console.error(error);
    })
  }
})

const signOutBtn = document.getElementById("logout-user");
signOutBtn.addEventListener("click", () => {
  localStorage.removeItem("logId");
  signOut(auth)
    .then(() => {
      window.location.href = "../index.html";
    })
    .catch((error) => {
      console.error("Error signing out", error);
    });
});
