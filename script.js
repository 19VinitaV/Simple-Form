const form = document.getElementById('Form');
const countrySelect = document.getElementById('country');
const dob = document.getElementById('dob');
const age = document.getElementById('age');
const physicallyYes = document.getElementById('physicallyYes');
const physicallyNo = document.getElementById('physicallyNo');
const justificationGroup = document.getElementById('justificationGroup');
const saveButton = document.getElementById('saveButton');
const updateButton = document.getElementById('updateButton');

let users = [];
let editIndex = -1; // Initialize editIndex to -1 (default for "Save" mode)

// Handle form submission for saving new user
form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (editIndex === -1) {
        // Save Mode
        saveUser();
    } else {
        // Update Mode
        updateUser();
    }
});

// Fetch countries
fetch('https://restcountries.com/v3.1/all')
    .then(response => response.json())
    .then(data => {
        data.forEach(country => {
            const option = document.createElement('option');
            option.value = country.cca3; // Use the 3-letter country code as the value
            option.textContent = country.name.common; // Country name
            countrySelect.appendChild(option);
        });
    })
    .catch(error => {
        console.error('Error fetching country data:', error);
    });

// Save User
function saveUser() {
    if (validateForm()) {
        const user = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            address: document.getElementById('address').value,
            dob: dob.value,
            age: age.value,
            phoneNumber: document.getElementById('number').value,
            country: countrySelect.value,
            physicallyChallenged: physicallyYes.checked ? "Yes" : "No",
            justification: document.getElementById('justification').value,
            hobbies: Array.from(document.querySelectorAll('input[name="hobbies"]:checked')).map(hobby => hobby.value)
        };

        users.push(user);
        alert("Saved successfully");
        renderTable();
        form.reset();
        justificationGroup.style.display = 'none';
        age.value = '';
    }
}

// Calculate Age based on Date of Birth
dob.addEventListener('change', () => {
    const birthDate = new Date(dob.value);
    const today = new Date();
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
    }
    age.value = calculatedAge;
});

// Show justification text area if physically challenged
physicallyYes.addEventListener('change', () => justificationGroup.style.display = 'block');
physicallyNo.addEventListener('change', () => justificationGroup.style.display = 'none');

function renderTable() {
    const tbody = document.querySelector('#userTable tbody');
    tbody.innerHTML = ''; // Clear table

    users.forEach((user, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${user.firstName}</td>
            <td>${user.lastName}</td>
            <td>${user.address}</td>
            <td>${user.dob}</td>
            <td>${user.age}</td>
            <td>${user.phoneNumber}</td>
            <td>
                <button onclick="editUser(${index})">Edit</button>
                <button onclick="deleteUser(${index})">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Form Validation (example for first name and phone number)
function validateForm() {
    let isValid = true;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const phoneNumber = document.getElementById('number').value;

    if (!/^[A-Za-z\s]+$/.test(firstName)) {
        document.getElementById('firstNameError').textContent = 'Enter a valid Name';
        isValid = false;
    } else {
        document.getElementById('firstNameError').textContent = '';
    }

    if (!/^[A-Za-z\s.]+$/.test(lastName)) {
        document.getElementById('lastNameError').textContent = 'Enter a valid Name';
        isValid = false;
    } else {
        document.getElementById('lastNameError').textContent = '';
    }

    if (!/^[+0-9\s]+$/.test(phoneNumber)) {
        document.getElementById('numberError').textContent = 'Enter a valid Number';
        isValid = false;
    } else {
        document.getElementById('numberError').textContent = '';
    }

    return isValid;
}

// Edit User
function editUser(index) {
    const user = users[index];
    document.getElementById('firstName').value = user.firstName;
    document.getElementById('lastName').value = user.lastName;
    document.getElementById('address').value = user.address;
    dob.value = user.dob;
    age.value = user.age;
    document.getElementById('number').value = user.phoneNumber;
    countrySelect.value = user.country;
    user.physicallyChallenged === 'Yes' ? physicallyYes.checked = true : physicallyNo.checked = true;
    justificationGroup.style.display = user.physicallyChallenged === 'Yes' ? 'block' : 'none';
    document.getElementById('justification').value = user.justification;
    document.querySelectorAll('input[name="hobbies"]').forEach(hobby => {
        hobby.checked = user.hobbies.includes(hobby.value);
    });

    editIndex = index; // Set the index for the user being edited
    saveButton.style.display = 'none';
    updateButton.style.display = 'inline';
}

// Update User
function updateUser() {
    if (validateForm()) {
        const user = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            address: document.getElementById('address').value,
            dob: dob.value,
            age: age.value,
            phoneNumber: document.getElementById('number').value,
            country: countrySelect.value,
            physicallyChallenged: physicallyYes.checked ? "Yes" : "No",
            justification: document.getElementById('justification').value,
            hobbies: Array.from(document.querySelectorAll('input[name="hobbies"]:checked')).map(hobby => hobby.value)
        };

        users[editIndex] = user; // Update the user at the specified index
        alert("Updated successfully");

        editIndex = -1; // Reset edit state
        renderTable(); // Re-render the table with the updated user list
        form.reset(); // Reset the form
        saveButton.style.display = 'inline';
        updateButton.style.display = 'none';
        justificationGroup.style.display = 'none';
        age.value = '';
    }
}

// Delete User
function deleteUser(index) {
    if (confirm("Are you sure you want to delete?")) {
        users.splice(index, 1);
        renderTable();
    }
}
