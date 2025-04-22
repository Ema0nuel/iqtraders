// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import {
  getAuth,
  onAuthStateChanged,
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

const logUser = localStorage.getItem("logId");
const popMessage = document.getElementById("confirmation-popup");
const cryptoBalance = document.getElementById("crypto_balance");
const investmentBalance = document.getElementById("investment_balance");
const profitBalance = document.getElementById("profit_balance");
const bonusBalance = document.getElementById("bonus_balance");
const userNameDisplay = document.getElementById("user-name-display-div")

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, (user) => {
  if (logUser) {
    const docRef = doc(db, "users", logUser);

    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          renderUserData(userData)
          if (userData.KYC === 0) {
            setTimeout(() => {
              popMessage.style.display = "flex";
              popMessage.innerHTML = `
            <div class="animation-container-p">
            <div class="icon-wrapper">
            <svg class="notification-icon" viewBox="0 0 52 52">
               <path d="M26 6.3a19.5 19.5 0 0 1 13.8 33.2c.1 2.3-1.9 4-4.1 4H16.3c-2.2 0-4.2-1.7-4.1-4a19.5 19.5 0 0 1 13.8-33.2z"/>
                <path d="M26 17.5v10.5"/>
                <path d="M26 39.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/>
            </svg>
            <div class="text-wrapper text-center">
                <p>KYC Not Verified!</p>
                <p>Verify now to start trading!</p>
            </div>
            <div class="popup-buttons">
              <a href="./kyc.html" class="popup-button confirm-button">Verify Now</a>
              <button class="popup-button cancel-button" id="cancel-btn">Cancel</button>
            </div>
            </div>
            </div>
        `;
              const cancelBtn = document.getElementById("cancel-btn");
              cancelBtn.addEventListener("click", () => {
                closePortal();
              });
            }, 6000);
          } 
        }
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    console.log("User Data Not found");
  }
});

function closePortal() {
  popMessage.innerHTML = "";
  popMessage.style.display = "none";
}

function renderUserData(userData) {
  cryptoBalance.innerHTML = `$${Math.floor(userData.Balance)}.00`
  investmentBalance.innerHTML = `$${Math.floor(userData.Investment_Balance)}.00`
  profitBalance.innerHTML = `$${Math.floor(userData.Profit_Balance)}.00`;
  bonusBalance.innerHTML = `$${Math.floor(userData.Bonus)}.00`;
  userNameDisplay.innerHTML = `Welcome, ${userData.firstName} 👋`
}