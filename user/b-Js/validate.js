export function validateAsset(assetNetwork, assetAddress) {
  let html = "";
  const selectAssetOptions = document.getElementById("select-asset");
  selectAssetOptions.addEventListener("change", (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "BTC") {
      html = `
                <select id="select-asset-network">
                    <option value="" disabled selected>Select Network</option>
                    <option value="BTCNTW">BITCOIN Network</option>
                </select>
        `;
    } else if (selectedValue === "BNB") {
      html = `
                <select id="select-asset-network">
                    <option value="" disabled selected>Select Network</option>
                    <option value="BSC">BINANCE SMART CHAIN</option>
                </select>
        `;
    } else if (selectedValue === "ETH") {
      html = `
                <select id="select-asset-network">
                    <option value="" disabled selected>Select Network</option>
                    <option value="ERC20">Ethereum(ERC20)</option>
                    <option value="BSCBEP20">Ethereum BSC(BEP20)</option>
                </select>
        `;
    } else if (selectedValue === "SOL") {
      html = `
                <select id="select-asset-network">
                    <option value="" disabled selected>Select Network</option>
                    <option value="SOLNTW">SOLANA NETWORK</option>
                </select>
        `;
    } else if (selectedValue === "USDT") {
      html = `
                <select id="select-asset-network">
                    <option value="" disabled selected>Select Network</option>
                    <option value="TRC20">TRON(TRC20)</option>
                    <option value="ERC20">Ethereum(ERC20)</option>
                    <option value="BSCBEP20">Ethereum BSC(BEP20)</option>
                    <option value="POS">Polygon POS</option>
                </select>
        `;
    }
    assetNetwork.classList.add("form-control");
    assetNetwork.classList.add("deposit-input");
    assetNetwork.innerHTML = html;

    validateAddress(assetAddress);
  });
}

function validateAddress(assetAddress) {
  let html = "";
  const selectAddressOptions = document.getElementById("select-asset-network");
  selectAddressOptions.addEventListener("change", (e) => {
    const selectedValue = e.target.value;
    if (selectedValue === "BTCNTW") {
      html = `
                <label for="deposit-address"><i class="fa-brands fa-bitcoin"></i> BITCOIN</label>
                <input 
                type="text" 
                value="18bNuwu32QgPtKUbkUxkqUfNWrXzAGywwe"
                id="address-text"
                disabled
                />
                <span id="copy-item"><i class="fa-solid fa-clone"></i></span>
            `;
    } else if (selectedValue === "BSC") {
      html = `
                <label for="deposit-address"><i class="fa-brands fa-airbnb"></i> BNB (BSC Network)</label>
                <input 
                type="text" 
                value="0x74ac66059b958e79d696868e46db607654366f7c"
                id="address-text"
                disabled
                />
                <span id="copy-item"><i class="fa-solid fa-clone"></i></span>
            `;
    } else if (selectedValue === "ERC20") {
      html = `
                <label for="deposit-address"><i class="fa-brands fa-ethereum"></i> ETHEREUM</label>
                <input 
                type="text" 
                value="0x74ac66059b958e79d696868e46db607654366f7c"
                id="address-text"
                disabled
                />
                <span id="copy-item"><i class="fa-solid fa-clone"></i></span>
            `;
    } else if (selectedValue === "BSCBEP20") {
      html = `
                <label for="deposit-address"><i class="fa-brands fa-ethereum"></i> ETHEREUM</label>
                <input 
                type="text" 
                value="0x74ac66059b958e79d696868e46db607654366f7c"
                id="address-text"
                disabled
                />
                <span id="copy-item"><i class="fa-solid fa-clone"></i></span>
            `;
    } else if (selectedValue === "SOLNTW") {
      html = `
                <label for="deposit-address"><i class="fa-solid fa-sort"></i> SOLANA Network</label>
                <input 
                type="text" 
                value="CniVmvoQvkyPQZkH1GQxByreEwn2hPd7XqirQH8k9Efq"
                id="address-text"
                disabled
                />
                <span id="copy-item"><i class="fa-solid fa-clone"></i></span>
            `;
    } else if (selectedValue === "TRC20") {
      html = `
                <label for="deposit-address"><i class="fa-solid fa-hand-holding-dollar"></i> USDT TRC</label>
                <input 
                type="text" 
                value="THdYvNCyEKv5xqFCxzLkpLLHKwyMps4JHH"
                id="address-text"
                disabled
                />
                <span id="copy-item"><i class="fa-solid fa-clone"></i></span>
            `;
    } else if (selectedValue === "POS") {
      html = `
                <label for="deposit-address"><i class="fa-solid fa-hand-holding-dollar"></i> USDT POLYGON</label>
                <input 
                type="text" 
                value="0x74ac66059b958e79d696868e46db607654366f7c"
                id="address-text"
                disabled
                />
                <span id="copy-item"><i class="fa-solid fa-clone"></i></span>
            `;
    }
    assetAddress.classList.add("form-control");
    assetAddress.classList.add("deposit-input");
    assetAddress.innerHTML = html;
    const copyItem = document.getElementById("copy-item");
    const addressText = document.getElementById("address-text");
    copyItem.addEventListener("click", () => {
      navigator.clipboard
        .writeText(addressText.value)
        .then(() => {
          alert("Address copied to clipboard");
        })
        .catch((error) => {
          console.error("Error copying address: ", error);
        });
    });
  });
}

export function cancelPop(cancelBtn, popMessage) {
    cancelBtn.addEventListener("click", (e) => {
        e.preventDefault();
        popMessage.style.display = "none";
        popMessage.innerHTML = "";
    });
}