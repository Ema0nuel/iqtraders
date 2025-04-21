const adminUsernameInput = document.getElementById("admin-username");
const adminPasswordInput = document.getElementById("admin-password");
const login = document.getElementById("submit-btn");
const popMessage = document.getElementById("confirmation-popup");

login.addEventListener("click", () => {
  if (adminPasswordInput.value === "" || adminUsernameInput.value === "") {
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
    adminPasswordInput.value !== "123AIQ45$@**100!" ||
    adminUsernameInput.value !== "admin"
  ) {
    popMessage.style.display = "flex";
    popMessage.innerHTML = `
        <div class="animation-container-p">
        <div class="x-mark-wrapper">
            <svg class="x-mark" viewBox="0 0 52 52">
                <path d="M16 16 36 36M36 16 16 36" />
            </svg>
            <div class="text-wrapper">
                <p>Incorrect Password or Username!</p>
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
        <div class="checkmark-wrapper-p">
        <svg class="checkmark" viewBox="0 0 52 52">
        <path d="M13 26l8 8L39 16" />
        </svg>
        <div class="text-wrapper">
        <p class="w-full text-center">Admin Signed In!</p>
        </div>
        </div> 
        </div>
        `;

        setTimeout(() => {
            window.location.href = "./admin.html"
        }, 3000)
  }
});
