// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  getFirestore,
  getDocs,
  collection,
  query,
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
let logAdmin = localStorage.getItem("adminId");
if (logAdmin || logAdmin === "123AIQ45$@**100!") {
  window.location.href = "./admin/index.html";
}

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = getFirestore();

const userTableBody = document.getElementById("user-table-body");
let html = "";

onAuthStateChanged(auth, async (user) => {
  const q = query(collection(db, "users"));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    let userData = doc.data();
    const row = document.createElement("tr");
    row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                    <img class="h-10 w-10 rounded-full" src="${
                      userData.Picture === ""
                        ? userData.firstName
                        : userData.Picture
                    }" alt="${userData.firstName}">
                </div>
            </div>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
            ${userData.firstName} ${userData.lastName}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${userData.email}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${userData.depositWallet === "" ? "None" : userData.depositWallet}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            $${Math.floor(userData.Balance)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            $${Math.floor(userData.Investment_Balance)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            $${Math.floor(userData.Profit_Balance)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            $${Math.floor(userData.Bonus)}
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <span class="${getStatusBadgeVariant(
              userData.KYC === 0 ? "Inactive" : "Active"
            )} px-2 py-1 rounded-full text-xs font-semibold">
                ${userData.KYC === 0 ? "Not Verified" : "Verified"}
            </span>
        </td>
        `;
    userTableBody.appendChild(row);
  });
});

const getStatusBadgeVariant = (status) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Inactive":
      return "bg-red-100 text-red-800";
  }
};
