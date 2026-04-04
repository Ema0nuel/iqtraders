// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-analytics.js";
import {
  getAuth,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
import {
  initializeFirestore,
  getDocs,
  collection,
  query,
  doc,
  updateDoc,
  deleteDoc,
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

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth();
const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
  cacheSizeBytes: -1,
});

const userTableBody = document.getElementById("user-table-body");
const popMessage = document.getElementById("confirmation-popup");
let html = "";

onAuthStateChanged(auth, async (user) => {
  const q = query(collection(db, "users"));

  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    let userData = doc.data();
    let id = doc.id;
    const row = document.createElement("tr");
    row.innerHTML = `
        <td class="px-6 py-4 whitespace-nowrap">
            <div class="flex items-center">
                <div class="flex-shrink-0 h-10 w-10">
                    <img class="h-10 w-10 rounded-full" src="${userData.Picture === ""
        ? "../user/images/avatar/user-default.png"
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
            ${userData.Phone || "N/A"}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${userData.Region || "N/A"}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${userData.Gender || "N/A"}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            ${userData.Registered_Date || "N/A"}
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 user-balance-${id}">
            $${Math.floor(userData.Balance)}
            <button class="btn btn-update-d update-balance-btn" data-user-id="${id}">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 user-investment-${id}">
            $${Math.floor(userData.Investment_Balance)}
            <button class="btn btn-update-d update-investment-btn" data-user-id="${id}">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 user-profit-${id}">
            $${Math.floor(userData.Profit_Balance)}
            <button class="btn btn-update-d update-profit-btn" data-user-id="${id}">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 user-bonus-${id}">
            $${Math.floor(userData.Bonus)}
            <button class="btn btn-update-d update-bonus-btn" data-user-id="${id}">
              <i class="fa-solid fa-pen-to-square"></i>
            </button>
        </td>
        <td class="px-6 py-4 whitespace-nowrap">
            <span class="${getStatusBadgeVariant(
        userData.KYC === 0 ? "Inactive" : "Active"
      )} px-2 py-1 rounded-full text-xs font-semibold">
                ${userData.KYC === 0 ? "Not Verified" : "Verified"}
            </span>
        </td>
        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2 flex">
          <button class="edit-profile-btn btn btn-update-d" data-user-id="${id}" title="Edit Profile">
            <i class="fa-solid fa-edit"></i>
          </button>
          <button class="delete-profile-btn btn btn-update-d bg-red-500 hover:bg-red-600" data-user-id="${id}" title="Delete Profile">
            <i class="fa-solid fa-trash"></i>
          </button>
          ${userData.Payment_Screenshot === undefined ||
        userData.Payment_Screenshot === ""
        ? ""
        : `<img src="${userData.Payment_Screenshot}" class="gallery-item h-8 w-8 rounded cursor-pointer" alt="Payment"></img>`
      }
        </td>
        `;
    userTableBody.appendChild(row);
  });
  updateUserDetails();
  editProfileEvent();
  deleteProfileEvent();
  expandImageItem();
});

function updateUserDetails() {
  document.querySelectorAll(".update-btn-id").forEach((updateBtn) => {
    updateBtn.addEventListener("click", () => {
      const { userId } = updateBtn.dataset;
      const parentElement = updateBtn.parentNode;
      popMessage.style.display = "flex";
      html = `
      <div class="animation-container-p">
        <div class="container">
          <div class="form-group">
            <label for="unique-input-field" class="label-header">Update Entries</label>
            <input type="number" id="update-input-${userId}" class="form-control" placeholder="Enter value" />
          </div>        
          <div class="button-group">
            <button id="update-button-${userId}" class="button update-button gg-btn">Update</button>
            <button id="cancel-button" class="button cancel-button">Cancel</button>
          </div>
        </div>  
      </div>
      `;

      popMessage.innerHTML = html;
      updateEvent(userId, parentElement);
      cancelEvent();
    });
  });
}

const getStatusBadgeVariant = (status) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800";
    case "Inactive":
      return "bg-red-100 text-red-800";
  }
};

function cancelEvent() {
  const cancelBtn = document.getElementById("cancel-button");
  cancelBtn.addEventListener("click", () => {
    popMessage.innerHTML = "";
    popMessage.style.display = "none";
  });
}

function updateEvent(userId, parentElement) {
  const updateBtn = document.getElementById(`update-button-${userId}`);
  const inputValue = document.getElementById(`update-input-${userId}`);
  let value = parentElement.innerText.slice(1);
  inputValue.value = Number(value);
  updateBtn.addEventListener("click", () => {
    onAuthStateChanged(auth, (user) => {
      const docRef = doc(db, "users", userId);
      let inputVal = Number(inputValue.value);
      if (inputVal === "") {
        alert("Enter a value");
      } else {
        if (parentElement.classList.contains(`user-balance-${userId}`)) {
          let updateData = {
            Balance: Math.floor(inputVal),
          };
          updateDoc(docRef, updateData);
          parentElement.innerHTML = `
          $${inputVal} 
          <button class="btn btn-update-d update-btn-id" data-user-id="${userId}">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>`;
          updateUserDetails();
          popMessage.innerHTML = "";
          popMessage.style.display = "none";
        } else if (
          parentElement.classList.contains(`user-investment-${userId}`)
        ) {
          let updateData = {
            Investment_Balance: Math.floor(inputVal),
          };
          updateDoc(docRef, updateData);
          parentElement.innerHTML = `
          $${inputVal} 
          <button class="btn btn-update-d update-btn-id" data-user-id="${userId}">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>`;
          updateUserDetails();
          popMessage.innerHTML = "";
          popMessage.style.display = "none";
        } else if (parentElement.classList.contains(`user-profit-${userId}`)) {
          let updateData = {
            Profit_Balance: Math.floor(inputVal),
          };
          updateDoc(docRef, updateData);
          parentElement.innerHTML = `
          $${inputVal} 
          <button class="btn btn-update-d update-btn-id" data-user-id="${userId}">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>`;
          updateUserDetails();
          popMessage.innerHTML = "";
          popMessage.style.display = "none";
        } else if (parentElement.classList.contains(`user-bonus-${userId}`)) {
          let updateData = {
            Bonus: Math.floor(inputVal),
          };
          updateDoc(docRef, updateData);
          parentElement.innerHTML = `
        $${inputVal} 
        <button class="btn btn-update-d update-btn-id" data-user-id="${userId}">
        <i class="fa-solid fa-pen-to-square"></i>
        </button>`;
          updateUserDetails();
          popMessage.innerHTML = "";
          popMessage.style.display = "none";
        } else {
          alert("Error Entering Values");
        }
      }
    });
  });
}

function expandImageItem() {
  const galleryItems = document.querySelectorAll(".gallery-item");
  const expandedContainer = document.getElementById("expanded-container");
  const expandedImage = document.getElementById("expanded-image");
  const closeButton = document.getElementById("close-button");

  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const clickedImageSrc = item.src;
      expandedImage.src = clickedImageSrc;
      expandedContainer.style.display = "flex";
      document.body.style.overflow = "hidden"; // Prevent scrolling
    });
  });

  closeButton.addEventListener("click", () => {
    expandedContainer.style.display = "none";
    document.body.style.overflow = ""; // Allow scrolling again
  });

  expandedContainer.addEventListener("click", (event) => {
    // Close the container if the user clicks outside the image.
    if (event.target === expandedContainer) {
      expandedContainer.style.display = "none";
      document.body.style.overflow = "";
    }
  });
}

function editProfileEvent() {
  document.querySelectorAll(".edit-profile-btn").forEach((editBtn) => {
    editBtn.addEventListener("click", async () => {
      const userId = editBtn.dataset.userId;
      const docRef = doc(db, "users", userId);

      // Fetch actual user data from Firestore
      const docSnap = await getDocs(query(collection(db, "users"), query(collection(db, "users"))));
      let userData = null;
      docSnap.forEach((doc) => {
        if (doc.id === userId) {
          userData = doc.data();
        }
      });

      if (!userData) return;

      popMessage.style.display = "flex";
      popMessage.innerHTML = `
      <div class="animation-container-p">
        <div class="container" style="max-height: 80vh; overflow-y: auto;">
          <div class="form-group">
            <label class="label-header">Edit User Profile</label>
            <label class="text-xs font-semibold text-gray-600 block mt-3">Phone</label>
            <input type="text" id="edit-phone-${userId}" class="form-control" placeholder="Phone" value="${userData.Phone || ""}" />
            <label class="text-xs font-semibold text-gray-600 block mt-3">Region</label>
            <input type="text" id="edit-region-${userId}" class="form-control" placeholder="Region" value="${userData.Region || ""}" />
            <label class="text-xs font-semibold text-gray-600 block mt-3">Gender</label>
            <input type="text" id="edit-gender-${userId}" class="form-control" placeholder="Gender" value="${userData.Gender || ""}" />
            <label class="text-xs font-semibold text-gray-600 block mt-3">Date of Birth</label>
            <input type="text" id="edit-dob-${userId}" class="form-control" placeholder="Date of Birth" value="${userData.Date_of_Birth || ""}" />
            <label class="text-xs font-semibold text-gray-600 block mt-3">Nationality</label>
            <input type="text" id="edit-nationality-${userId}" class="form-control" placeholder="Nationality" value="${userData.Nationality || ""}" />
            <label class="text-xs font-semibold text-gray-600 block mt-3">Address</label>
            <input type="text" id="edit-address-${userId}" class="form-control" placeholder="Address" value="${userData.Address || ""}" />
            <label class="text-xs font-semibold text-gray-600 block mt-3">Investing Currency</label>
            <input type="text" id="edit-currency-${userId}" class="form-control" placeholder="Investing Currency" value="${userData.Investing_Currency || ""}" />
            <label class="text-xs font-semibold text-gray-600 block mt-3">Deposit Wallet Address</label>
            <input type="text" id="edit-wallet-${userId}" class="form-control" placeholder="Deposit Wallet Address" value="${userData.depositWallet || ""}" />
          </div>        
          <div class="button-group">
            <button id="save-profile-${userId}" class="button update-button gg-btn">Save Changes</button>
            <button id="cancel-button" class="button cancel-button">Cancel</button>
          </div>
        </div>  
      </div>
      `;

      const saveBtn = document.getElementById(`save-profile-${userId}`);
      saveBtn.addEventListener("click", () => {
        const updateData = {
          Phone: document.getElementById(`edit-phone-${userId}`).value,
          Region: document.getElementById(`edit-region-${userId}`).value,
          Gender: document.getElementById(`edit-gender-${userId}`).value,
          Date_of_Birth: document.getElementById(`edit-dob-${userId}`).value,
          Nationality: document.getElementById(`edit-nationality-${userId}`).value,
          Address: document.getElementById(`edit-address-${userId}`).value,
          Investing_Currency: document.getElementById(`edit-currency-${userId}`).value,
          depositWallet: document.getElementById(`edit-wallet-${userId}`).value,
        };

        updateDoc(docRef, updateData).then(() => {
          popMessage.innerHTML = "";
          popMessage.style.display = "none";
          location.reload();
        });
      });

      cancelEvent();
    });
  });
}

function deleteProfileEvent() {
  document.querySelectorAll(".delete-profile-btn").forEach((deleteBtn) => {
    deleteBtn.addEventListener("click", () => {
      const userId = deleteBtn.dataset.userId;
      const row = deleteBtn.closest("tr");
      const userName = row.querySelector("td:nth-child(2)").textContent;

      popMessage.style.display = "flex";
      popMessage.innerHTML = `
      <div class="animation-container-p">
        <div class="container">
          <div class="form-group">
            <label class="label-header">Delete User Profile</label>
            <p style="margin: 10px 0; color: #d32f2f;">Are you sure you want to delete this user profile?</p>
            <p style="margin: 10px 0; color: #666;">User: <strong>${userName}</strong></p>
          </div>        
          <div class="button-group">
            <button id="confirm-delete-${userId}" class="button update-button gg-btn" style="background-color: #d32f2f;">Delete</button>
            <button id="cancel-button" class="button cancel-button">Cancel</button>
          </div>
        </div>  
      </div>
      `;

      const confirmBtn = document.getElementById(`confirm-delete-${userId}`);
      confirmBtn.addEventListener("click", () => {
        const docRef = doc(db, "users", userId);
        deleteDoc(docRef).then(() => {
          popMessage.innerHTML = "";
          popMessage.style.display = "none";
          location.reload();
        });
      });

      cancelEvent();
    });
  });
}
