function navbar() {
    let html;
    html = `
          <div class="box-logo">
                    <a href="#home" id="site-logo-inner">
                      <img
                        class=""
                        id="logo_header"
                        alt=""
                        src="../assets/images/logo.png"
                      />
                    </a>
                    <div class="button-show-hide">
                      <i class="icon-back"></i>
                    </div>
                  </div>
                  <div class="section-menu-left-wrap">
                    <div class="center">
                      <div class="center-item">
                        <ul class="">
                          <li class="menu-item">
                            <a href="index.html" class="menu-item-button">
                              <div class="icon">
                                <i class="icon-category"></i>
                              </div>
                              <div class="text">Dashboard</div>
                            </a>
                          </li>
                          <li class="menu-item">
                            <a href="my-wallet.html" class="menu-item-button">
                              <div class="icon">
                                <i class="icon-wallet1"></i>
                              </div>
                              <div class="text">My Wallet</div>
                            </a>
                          </li>
                          <li class="menu-item">
                            <a href="transaction.html" class="menu-item-button">
                              <div class="icon">
                                <svg
                                  class=""
                                  width="20"
                                  height="20"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M6.1428 8.50146V14.2182"
                                    stroke="#A4A4A9"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M10.0317 5.76562V14.2179"
                                    stroke="#A4A4A9"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    d="M13.8572 11.522V14.2178"
                                    stroke="#A4A4A9"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                  <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M13.9047 1.6665H6.0952C3.37297 1.6665 1.66663 3.59324 1.66663 6.3208V13.6789C1.66663 16.4064 3.36504 18.3332 6.0952 18.3332H13.9047C16.6349 18.3332 18.3333 16.4064 18.3333 13.6789V6.3208C18.3333 3.59324 16.6349 1.6665 13.9047 1.6665Z"
                                    stroke="#A4A4A9"
                                    stroke-width="1.5"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  />
                                </svg>
                              </div>
                              <div class="text">Transaction</div>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
      `;
    return html;
  }
  
  function RightNavbar() {
    let html = `
          <div class="header-left">
                    <div class="button-show-hide">
                      <i class="icon-menu"></i>
                    </div>
                    <h6>IQ Traders</h6>
                  </div>
                  <div class="header-grid">
                    <div class="popup-wrap user type-header">
                      <div class="dropdown">
                        <button
                          class="btn btn-secondary dropdown-toggle"
                          type="button"
                          id="dropdownMenuButton3"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <span class="header-user wg-user">
                            <span class="image">
                              <img src="images/avatar/user-default.png" />
                            </span>
                            <span class="content flex flex-column">
                              <span class="label-02 text-Black name" id="username-nav"
                                ></span
                              >
                              <span class="f14-regular text-Gray">User</span>
                            </span>
                          </span>
                        </button>
                        <ul
                          class="dropdown-menu dropdown-menu-end has-content"
                          aria-labelledby="dropdownMenuButton3"
                        >
                          <li>
                            <a href="account.html" class="user-item">
                              <div class="body-title-2">Account</div>
                            </a>
                          </li>
                          <li>
                            <a href="settings.html" class="user-item">
                              <div class="body-title-2">Settings</div>
                            </a>
                          </li>
                          <li>
                            <a class="user-item" id="logout-user">
                              <div class="body-title-2">Log out</div>
                            </a>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
      `;
    return html;
  }
  

const logUser = localStorage.getItem("logId")
const jsNavbar = document.getElementById("js-navbar");
const rightNavbar = document.getElementById("js-right-navbar");

if(logUser === null) {
    window.location.href = "../page-register.html"
}


jsNavbar.innerHTML = navbar();
rightNavbar.innerHTML = RightNavbar()

