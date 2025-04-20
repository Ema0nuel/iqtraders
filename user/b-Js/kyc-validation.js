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
  updateDoc,
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
let successIcon = `<dotlottie-player
  src="https://lottie.host/16dbd64b-ed86-44e4-9084-d3bcf3aa5c1c/VoqLrrvykV.lottie"
  background="transparent"
  speed="0.6"
  style="width: auto; height: 300px"
  autoplay
></dotlottie-player>`;

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore();

const popMessage = document.getElementById("confirmation-popup");
const form = document.getElementById("registrationForm");
const firstNameInput = document.getElementById("firstName");
const lastNameInput = document.getElementById("lastName");
const emailInput = document.getElementById("email");
const phoneInput = document.getElementById("phone");
const dateOfBirthInput = document.getElementById("dateOfBirth");
const genderSelect = document.getElementById("gender");
const regionInput = document.getElementById("region");
const nationalityInput = document.getElementById("nationality");
const addressInput = document.getElementById("address");
const validIdTypeSelect = document.getElementById("validIdType");
const validIdInput = document.getElementById("validId");
const residentialValidationTypeSelect = document.getElementById(
  "residentialValidationType"
);
const residentialValidationInput = document.getElementById(
  "residentialValidation"
);
const investingCurrencySelect = document.getElementById("investingCurrency");
const pictureInput = document.getElementById("picture");
const walletAddressIdInput = document.getElementById("walletAddressId");

onAuthStateChanged(auth, (user) => {
  if (logUser) {
    const docRef = doc(db, "users", logUser);

    getDoc(docRef)
      .then((docSnap) => {
        const userData = docSnap.data();
        if (userData.KYC === 1) {
          window.location.href = "./index.html";
        } else {
          inputValidation(userData);
          form.addEventListener("submit", (e) => {
            e.preventDefault();
            if (
              firstNameInput.value === "" ||
              lastNameInput.value === "" ||
              emailInput.value === "" ||
              phoneInput.value === "" ||
              dateOfBirthInput.value === "" ||
              regionInput.value === "" ||
              nationalityInput.value === "" ||
              addressInput.value === "" ||
              validIdInput.value ||
              validIdTypeSelect.value === "" ||
              residentialValidationInput.value === "" ||
              residentialValidationTypeSelect.value === "" ||
              investingCurrencySelect.value === "" ||
              genderSelect.value === "" ||
              walletAddressIdInput.value === ""
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
            } else {
              updateData(docRef);
            }
          });
        }
      })
      .catch((error) => console.error(error));
  }
});

function inputValidation(userData) {
  firstNameInput.value = userData.firstName;
  lastNameInput.value = userData.lastName;
  emailInput.value = userData.email;
  phoneInput.value = userData.Phone;
  if (userData.depositWallet === "") {
    return;
  } else {
    walletAddressIdInput.value = userData.depositWallet;
  }

  firstNameInput.disabled = true;
  lastNameInput.disabled = true;
  emailInput.disabled = true;
}

function updateData(docRef) {
  const file = pictureInput.files[0];

  const reader = new FileReader();

  reader.onload = () => {
    const base64Data = reader.result;

    let imageIndex = base64Data;

    let updateData = {
      firstName: firstNameInput.value,
      lastName: lastNameInput.value,
      email: emailInput.value,
      Phone: phoneInput.value,
      Date_of_Birth: dateOfBirthInput.value,
      Region: regionInput.value,
      Nationality: nationalityInput.value,
      Address: addressInput.value,
      Valid_Id_Type: validIdTypeSelect.value,
      Valid_Id: validIdInput.value,
      Residential_Validation_Type: residentialValidationTypeSelect.value,
      Residential_Validation: residentialValidationInput.value,
      Investing_Currency: investingCurrencySelect.value,
      Picture: imageIndex,
      Gender: genderSelect.value,
      depositWallet: walletAddressIdInput.value,
      KYC: 1,
    };

    updateDoc(docRef, updateData);
    kycValid(
      "Thank for Submitting your KYC Verifications",
      "It's under review in 48 Hours"
    );
  };

  reader.onerror = () => {
    console.error("Error reading file:", reader.error);
    alert("Failed to read file.  See console for details.");
  };
  reader.readAsDataURL(file);
}
function kycValid(message1, message2) {
  popMessage.style.display = "flex";
  popMessage.innerHTML = `
          <div class="animation-container-p">
          <div class="checkmark-wrapper-p">
          ${successIcon}
          <div class="text-wrapper validate-text">
          <p>${message1}</p>
          <p>${message2}</p>
          </div>
          </div> 
          </div>
          `;

  setTimeout(() => {
    popMessage.innerHTML = "";
    popMessage.style.display = "none";
    window.location.href = "./index.html";
  }, 7000);
}
