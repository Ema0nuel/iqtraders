
const form = document.getElementById('registrationForm');
const firstNameInput = document.getElementById('firstName');
const lastNameInput = document.getElementById('lastName');
const emailInput = document.getElementById('email');
const phoneInput = document.getElementById('phone');
const dateOfBirthInput = document.getElementById('dateOfBirth');
const genderSelect = document.getElementById('gender');
const regionInput = document.getElementById('region');
const nationalityInput = document.getElementById('nationality');
const addressInput = document.getElementById('address');
const validIdTypeSelect = document.getElementById('validIdType');
const validIdInput = document.getElementById('validId');
const residentialValidationTypeSelect = document.getElementById('residentialValidationType');
const residentialValidationInput = document.getElementById('residentialValidation');
const investingCurrencySelect = document.getElementById('investingCurrency');
const pictureInput = document.getElementById('picture');
const termsAndConditionsCheckbox = document.getElementById('termsAndConditions');
const walletAddressIdInput = document.getElementById('walletAddressId');


const firstNameError = document.getElementById('firstNameError');
const lastNameError = document.getElementById('lastNameError');
const emailError = document.getElementById('emailError');
const phoneError = document.getElementById('phoneError');
const dateOfBirthError = document.getElementById('dateOfBirthError');
const genderError = document.getElementById('genderError');
const regionError = document.getElementById('regionError');
const nationalityError = document.getElementById('nationalityError');
const addressError = document.getElementById('addressError');
const validIdTypeError = document.getElementById('validIdTypeError');
const validIdError = document.getElementById('validIdError');
const residentialValidationTypeError = document.getElementById('residentialValidationTypeError');
const residentialValidationError = document.getElementById('residentialValidationError');
const investingCurrencyError = document.getElementById('investingCurrencyError');
const pictureError = document.getElementById('pictureError');
const termsAndConditionsError = document.getElementById('termsAndConditionsError');
const walletAddressIdError = document.getElementById('walletAddressIdError');


function validateName(name) {
    return name.trim() !== '';
}

function validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

function validateDate(date) {
    return date !== '';
}

function validateSelect(value) {
    return value !== '';
}

function validateText(text) {
    return text.trim() !== '';
}

function validateFile(file) {
    return file.value !== '';
}

  function validateCheckbox(checkbox) {
    return checkbox.checked;
}

function resetValidationErrors() {
    firstNameError.style.display = 'none';
    lastNameError.style.display = 'none';
    emailError.style.display = 'none';
    phoneError.style.display = 'none';
    dateOfBirthError.style.display = 'none';
    genderError.style.display = 'none';
    regionError.style.display = 'none';
    nationalityError.style.display = 'none';
    addressError.style.display = 'none';
    validIdTypeError.style.display = 'none';
    validIdError.style.display = 'none';
    residentialValidationTypeError.style.display = 'none';
    residentialValidationError.style.display = 'none';
    investingCurrencyError.style.display = 'none';
    pictureError.style.display = 'none';
    termsAndConditionsError.style.display = 'none';
    walletAddressIdError.style.display = 'none';

    firstNameInput.classList.remove('invalid-input', 'valid-input');
    lastNameInput.classList.remove('invalid-input', 'valid-input');
    emailInput.classList.remove('invalid-input', 'valid-input');
    phoneInput.classList.remove('invalid-input', 'valid-input');
    dateOfBirthInput.classList.remove('invalid-input', 'valid-input');
    genderSelect.classList.remove('invalid-input', 'valid-input');
    regionInput.classList.remove('invalid-input', 'valid-input');
    nationalityInput.classList.remove('invalid-input', 'valid-input');
    addressInput.classList.remove('invalid-input', 'valid-input');
    validIdTypeSelect.classList.remove('invalid-input', 'valid-input');
    validIdInput.classList.remove('invalid-input', 'valid-input');
    residentialValidationTypeSelect.classList.remove('invalid-input', 'valid-input');
    residentialValidationInput.classList.remove('invalid-input', 'valid-input');
    investingCurrencySelect.classList.remove('invalid-input', 'valid-input');
    pictureInput.classList.remove('invalid-input', 'valid-input');
    termsAndConditionsCheckbox.classList.remove('invalid-input', 'valid-input');
    walletAddressIdInput.classList.remove('invalid-input', 'valid-input');
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    resetValidationErrors();

    let isValid = true;

    if (!validateName(firstNameInput.value)) {
        firstNameInput.classList.add('invalid-input');
        firstNameError.style.display = 'block';
        isValid = false;
    } else {
        firstNameInput.classList.add('valid-input');
    }

    if (!validateName(lastNameInput.value)) {
        lastNameInput.classList.add('invalid-input');
        lastNameError.style.display = 'block';
        isValid = false;
    } else {
        lastNameInput.classList.add('valid-input');
    }

    if (!validateEmail(emailInput.value)) {
        emailInput.classList.add('invalid-input');
        emailError.style.display = 'block';
        isValid = false;
    } else {
        emailInput.classList.add('valid-input');
    }

    if (!validateDate(dateOfBirthInput.value)) {
        dateOfBirthInput.classList.add('invalid-input');
        dateOfBirthError.style.display = 'block';
        isValid = false;
    } else {
        dateOfBirthInput.classList.add('valid-input');
    }

    if (!validateSelect(genderSelect.value)) {
        genderSelect.classList.add('invalid-input');
        genderError.style.display = 'block';
        isValid = false;
    } else {
        genderSelect.classList.add('valid-input');
    }

    if (!validateText(regionInput.value)) {
        regionInput.classList.add('invalid-input');
        regionError.style.display = 'block';
        isValid = false;
    } else {
        regionInput.classList.add('valid-input');
    }

    if (!validateText(nationalityInput.value)) {
        nationalityInput.classList.add('invalid-input');
        nationalityError.style.display = 'block';
        isValid = false;
    } else {
        nationalityInput.classList.add('valid-input');
    }

    if (!validateText(addressInput.value)) {
        addressInput.classList.add('invalid-input');
        addressError.style.display = 'block';
        isValid = false;
    } else {
        addressInput.classList.add('valid-input');
    }

    if (!validateSelect(validIdTypeSelect.value)) {
        validIdTypeSelect.classList.add('invalid-input');
        validIdTypeError.style.display = 'block';
        isValid = false;
    } else {
        validIdTypeSelect.classList.add('valid-input');
    }

    if (!validateText(validIdInput.value)) {
        validIdInput.classList.add('invalid-input');
        validIdError.style.display = 'block';
        isValid = false;
    } else {
        validIdInput.classList.add('valid-input');
    }

    if (!validateSelect(residentialValidationTypeSelect.value)) {
        residentialValidationTypeSelect.classList.add('invalid-input');
        residentialValidationTypeError.style.display = 'block';
        isValid = false;
    } else {
        residentialValidationTypeSelect.classList.add('valid-input');
    }

    if (!validateText(residentialValidationInput.value)) {
        residentialValidationInput.classList.add('invalid-input');
        residentialValidationError.style.display = 'block';
        isValid = false;
    } else {
        residentialValidationInput.classList.add('valid-input');
    }

    if (!validateSelect(investingCurrencySelect.value)) {
        investingCurrencySelect.classList.add('invalid-input');
        investingCurrencyError.style.display = 'block';
        isValid = false;
    } else {
        investingCurrencySelect.classList.add('valid-input');
    }

    if (!validateFile(pictureInput)) {
        pictureInput.classList.add('invalid-input');
        pictureError.style.display = 'block';
        isValid = false;
    } else {
        pictureInput.classList.add('valid-input');
    }
    
     if (!validateCheckbox(termsAndConditionsCheckbox)) {
        termsAndConditionsError.style.display = 'block';
        isValid = false;
    } else {
        termsAndConditionsCheckbox.classList.add('valid-input');
    }

     if (walletAddressIdInput.value && !validateText(walletAddressIdInput.value)) {
        walletAddressIdInput.classList.add('invalid-input');
        walletAddressIdError.style.display = 'block';
        isValid = false;
    } else if (walletAddressIdInput.value) {
        walletAddressIdInput.classList.add('valid-input');
    }

});
