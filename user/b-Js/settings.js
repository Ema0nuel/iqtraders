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
  updateDoc
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
const twoFactor = document.getElementById("two-fa");
const kycValid = document.getElementById("kyc-valid");
const antiPhishingCode = document.getElementById("anti-phishing-code");
const whitelist = document.getElementById("whitelist");
const whitelistId = document.getElementById("whitelist-id")
const accountManagement = document.getElementById("account-management");
const antiPhishingCodeId = document.getElementById("anti-phishing-id-code")
const kycValidId = document.getElementById("kyc-id-valid");
const emailVerified = document.getElementById("email-auth");
const userName = document.getElementById("user-name")
const userEmail = document.getElementById("user-email");
const userCountry = document.getElementById("user-country");
const userPhone = document.getElementById("user-phone")
const investmentCurrency = document.getElementById("i-coin")
const userWallet = document.getElementById("user-wallet")

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore();

onAuthStateChanged(auth, (user) => {
  if (logUser) {
    const docRef = doc(db, "users", logUser);
    getDoc(docRef).then((docSnap) => {
        const userData = docSnap.data();
        accountManagement.innerHTML = `${userData.Registered_Date}`
        renderValidSetting(userData)
        checkValue(docRef)
        renderData(userData)

        if (userData.emailVerified === "true") {
            emailVerified.checked = true
            emailVerified.disabled = "true"
        } else {
            emailVerified.checked = false
            emailVerified.disabled = "true"
        }
    }).catch((error) => console.error(error))
  }
})

function renderValidSetting(userData) {
    if (userData.KYC === 0) {
        kycValid.disabled = "true"
        kycValidId.disabled = true
    } else if (userData.KYC === 1) {
        kycValid.checked = "true"
        kycValid.disabled = "true"
        kycValidId.disabled = true
        kycValidId.checked = true
    }

    if (userData.Two_Factor_Authentication === 0) {
        twoFactor.checked = false
    } else {
        twoFactor.checked = true
    }
    if (userData.Anti_Phishing_Code === 0) {
        antiPhishingCode.checked = false
        antiPhishingCodeId.checked = false
    } else {
        antiPhishingCode.checked = true
        antiPhishingCodeId.checked = true
    }
    if (userData.Withdrawal_Whitelist === 0) {
        whitelist.checked = false
        whitelistId.checked = false
    } else {
        whitelist.checked = true
        whitelistId.checked = true
    }
    
}
function checkValue(docRef) {
    twoFactor.addEventListener("click", () => {
        if (twoFactor.checked) {
            let data = 1;
            let updateData = {
                Two_Factor_Authentication: data
            }
            updateDoc(docRef, updateData)
        } else {
            let data = 0;
            let updateData = {
                Two_Factor_Authentication: data,
            }
            updateDoc(docRef, updateData)
        }
    })

    antiPhishingCode.addEventListener("click", () => {
        if (antiPhishingCode.checked) {
            let data = 1;
            let updateData = {
                Anti_Phishing_Code: data
            }
            updateDoc(docRef, updateData)
            antiPhishingCodeId.checked = true
        } else {
            let data = 0;
            let updateData = {
                Anti_Phishing_Code: data,
            }
            updateDoc(docRef, updateData)
            antiPhishingCodeId.checked = false
        }
    })

    antiPhishingCodeId.addEventListener("click", () => {
        if (antiPhishingCodeId.checked) {
            let data = 1;
            let updateData = {
                Anti_Phishing_Code: data
            }
            updateDoc(docRef, updateData)
            antiPhishingCode.checked = true
        } else {
            let data = 0;
            let updateData = {
                Anti_Phishing_Code: data,
            }
            updateDoc(docRef, updateData)
            antiPhishingCode.checked = false
        }
    })

    whitelist.addEventListener("click", () => {
        if (whitelist.checked) {
            let data = 1;
            let updateData = {
                Withdrawal_Whitelist: data
            }
            updateDoc(docRef, updateData)
            whitelistId.checked = true
        } else {
            let data = 0;
            let updateData = {
                Withdrawal_Whitelist: data
            }
            updateDoc(docRef, updateData)
            whitelistId.checked = false
        }
    })

    whitelistId.addEventListener("click", () => {
        if (whitelistId.checked) {
            let data = 1;
            let updateData = {
                Withdrawal_Whitelist: data
            }
            updateDoc(docRef, updateData)
            whitelist.checked = true
        } else {
            let data = 0;
            let updateData = {
                Withdrawal_Whitelist: data
            }
            updateDoc(docRef, updateData)
            whitelist.checked = false
        }
    })
}

function renderData(userData) {
    userName.innerHTML = `${userData.firstName} ${userData.lastName}`
    userEmail.innerHTML = `${userData.email}`
    userCountry.innerHTML = `${userData.Nationality}`
    userPhone.innerHTML = `+${userData.Phone}`
    investmentCurrency.innerHTML = `${(userData.Investing_Currency).toUpperCase()}`
    userWallet.innerHTML = `${userData.depositWallet}`
}