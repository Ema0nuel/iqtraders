// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  getFirestore,
  setDoc,
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

// Getting User Logged In
const logUser = localStorage.getItem("logId");

if (logUser !== null) {
  window.location.href = "user/index.html";
}

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

function getFormattedDateTime(locale = "en-US", options = {}) {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(now);
}

const signupBtn = document.getElementById("signup-register");
const firstName = document.getElementById("signup-fname");
const lastName = document.getElementById("signup-lname");
const signUpEmail = document.getElementById("signup-email");
const signUpPhone = document.getElementById("signup-phone");
const signUpPassword = document.getElementById("signup-password");
const popMessage = document.getElementById("confirmation-popup");
const signInBtn = document.getElementById("signin-log");
const signInEmail = document.getElementById("signin-email");
const signInPassword = document.getElementById("signin-password");
const confirmSignUpPassword = document.getElementById("confirm-signup-password");

signupBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const auth = getAuth();
  const db = getFirestore(app);

  // DATE & TIME
  const shortDateTime = getFormattedDateTime("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  });

  if (
    signUpEmail.value === "" ||
    signUpPassword.value === "" ||
    signUpPhone.value === "" ||
    firstName.value === "" ||
    lastName.value === ""
  ) {
    popMessage.style.display = "flex";
    popMessage.innerHTML = `
        <div class="animation-container-p">
        <div class="x-mark-wrapper">
            <svg class="x-mark" viewBox="0 0 52 52">
                <path d="M16 16 36 36M36 16 16 36" />
            </svg>
            <div class="text-wrapper">
                <p>Fill out Parameters!</p>
            </div>
        </div>
        </div>
        `;

    setTimeout(() => {
      popMessage.innerHTML = "";
      popMessage.style.display = "none";
    }, 3500);
  } else if (signUpPassword.value !== confirmSignUpPassword.value) {
    popMessage.style.display = "flex";
    popMessage.innerHTML = `
        <div class="animation-container-p">
        <div class="x-mark-wrapper">
            <svg class="x-mark" viewBox="0 0 52 52">
                <path d="M16 16 36 36M36 16 16 36" />
            </svg>
            <div class="text-wrapper">
                <p>Password not matching!</p>
            </div>
        </div>
        </div>
        `;

    setTimeout(() => {
      popMessage.innerHTML = "";
      popMessage.style.display = "none";
    }, 3500);
  } else {
    createUserWithEmailAndPassword(
      auth,
      signUpEmail.value,
      signUpPassword.value
    )
      .then((userCredential) => {
        const user = userCredential.user;
        sendEmailVerification(auth.currentUser)
          .then(() => {
            console.log("We sent a verification to your email!");
          })
          .catch((error) => console.error(error));
        const userData = {
          firstName: firstName.value,
          lastName: lastName.value,
          email: signUpEmail.value,
          Phone: signUpPhone.value,
          Date_of_Birth: "",
          Region: "",
          Nationality: "",
          Address: "",
          Gender: "",
          Valid_Id_Type: "",
          Valid_Id: "",
          Residential_Validation_Type: "",
          Residential_Validation: "",
          Investing_Currency: "",
          Picture: "",
          Registered_Date: shortDateTime,
          KYC: 0,
          Withdrawal_Whitelist: 0,
          Anti_Phishing_Code: 0,
          Two_Factor_Authentication: 0,
          Balance: 0,
          Profit_Balance: 0,
          Investment_Balance: 0,
          Bonus: 10.0,
          Card: [],
          depositWallet: "",
        };

        popMessage.style.display = "flex";
        popMessage.innerHTML = `
        <div class="animation-container-p">
        <div class="checkmark-wrapper-p">
        <svg class="checkmark" viewBox="0 0 52 52">
        <path d="M13 26l8 8L39 16" />
        </svg>
        <div class="text-wrapper">
        <p>Account Created Successfully!</p>
        <p>Email Verification Link Sent!</p>
        </div>
        </div> 
        </div>
        `;

        const docRef = doc(db, "users", user.uid);
        setDoc(docRef, userData)
          .then(() => {
            setTimeout(() => {
              window.location.href = "page-register.html";
            }, 2000);
          })
          .catch((error) => {
            console.log("Error Occurred when writing document", error);
          });
      })
      .catch((error) => {
        const errorCode = error.code;

        if (errorCode == "auth/email-already-in-use") {
          popMessage.style.display = "flex";
          popMessage.innerHTML = `
        <div class="animation-container-p">
        <div class="x-mark-wrapper">
            <svg class="x-mark" viewBox="0 0 52 52">
                <path d="M16 16 36 36M36 16 16 36" />
            </svg>
            <div class="text-wrapper">
                <p>Email Already Used!</p>
            </div>
        </div>
        </div>
        `;

          setTimeout(() => {
            popMessage.innerHTML = "";
            popMessage.style.display = "none";
          }, 3500);
        } else {
          popMessage.style.display = "flex";
          popMessage.innerHTML = `
        <div class="animation-container-p">
        <div class="x-mark-wrapper">
            <svg class="x-mark" viewBox="0 0 52 52">
                <path d="M16 16 36 36M36 16 16 36" />
            </svg>
            <div class="text-wrapper">
                <p>Unable to Create User</p>
            </div>
        </div>
        </div>
        `;

          setTimeout(() => {
            popMessage.innerHTML = "";
            popMessage.style.display = "none";
          }, 3500);
        }
      });
  }
});

signInBtn.addEventListener("click", (e) => {
  e.preventDefault();

  const auth = getAuth();

  if (signInEmail.value === "" || signInPassword.value === "") {
    popMessage.style.display = "flex";
    popMessage.innerHTML = `
        <div class="animation-container-p">
        <div class="x-mark-wrapper">
            <svg class="x-mark" viewBox="0 0 52 52">
                <path d="M16 16 36 36M36 16 16 36" />
            </svg>
            <div class="text-wrapper">
                <p>Fill out Parameters!</p>
            </div>
        </div>
        </div>
        `;

    setTimeout(() => {
      popMessage.innerHTML = "";
      popMessage.style.display = "none";
    }, 3000);
  } else {
    signInWithEmailAndPassword(auth, signInEmail.value, signInPassword.value)
      .then((userCredential) => {
        const user = userCredential.user;
        localStorage.setItem("logId", user.uid);
        popMessage.style.display = "flex";
        popMessage.innerHTML = `
        <div class="animation-container-p">
        <div class="checkmark-wrapper-p">
        <svg class="checkmark" viewBox="0 0 52 52">
        <path d="M13 26l8 8L39 16" />
        </svg>
        <div class="text-wrapper">
        <p>Successfully Signed In!</p>
        </div>
        </div> 
        </div>
        `;

        setTimeout(() => {
          window.location.href = "user/index.html";
        }, 2000);
      })
      .catch((error) => {
        const errorCode = error.code;

        if (errorCode == "auth/invalid-credential") {
          popMessage.style.display = "flex";
          popMessage.innerHTML = `
        <div class="animation-container-p">
        <div class="x-mark-wrapper">
            <svg class="x-mark" viewBox="0 0 52 52">
                <path d="M16 16 36 36M36 16 16 36" />
            </svg>
            <div class="text-wrapper">
                <p>Incorrect Email or Password</p>
            </div>
        </div>
        </div>
        `;

          setTimeout(() => {
            popMessage.innerHTML = "";
            popMessage.style.display = "none";
          }, 3500);
        } else {
          popMessage.style.display = "flex";
          popMessage.innerHTML = `
        <div class="animation-container-p">
        <div class="x-mark-wrapper">
            <svg class="x-mark" viewBox="0 0 52 52">
                <path d="M16 16 36 36M36 16 16 36" />
            </svg>
            <div class="text-wrapper">
                <p>Account doesn't exist!</p>
            </div>
        </div>
        </div>
        `;

          setTimeout(() => {
            popMessage.innerHTML = "";
            popMessage.style.display = "none";
          }, 3500);
        }
      });
  }
});
