const textPopup = document.getElementById('text-popup');
        const popupText = document.getElementById('popup-text');
        const messages = [
            "Derick from SCOTLAND received $2K",
            "James from WALES received $5K",
            "Maverick from US received $10K",
            "Norma from LONDON received $30K",
            "Morris from CHICAGO received $1K",
            "Payne from VENICE received $3K",
            "Vicki from MADRID received $500",
            "Thompson from QUEENS received $800",
            "Caroline from UKRAINE received $16K",
        ];

        function showPopup() {
            textPopup.classList.remove('hide');
            textPopup.classList.add('show');
        }

        function hidePopup() {
            textPopup.classList.remove('show');
            textPopup.classList.add('hide');
        }

        function updateText() {
            const randomIndex = Math.floor(Math.random() * messages.length);
            popupText.textContent = messages[randomIndex];
        }

        // Initial call
        updateText();
        showPopup();

        // Update the text and show the popup every 10 seconds
        setInterval(() => {
            hidePopup();
            setTimeout(() => {
                updateText();
                showPopup();
            }, 300); // Small delay before showing the popup again
        }, 10000);