const loadLogin = () => {
    const clientId = '703310288937-m5t1ki80ogdfl3i0seuu168bnbk5h8qa.apps.googleusercontent.com';
    const redirectUri = 'https://kindnesskettle.projects.bbdgrad.com/web/home.html';
    const scope = encodeURIComponent('email profile openid');

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=id_token&scope=${scope}&nonce=123`;

    console.log("Redirecting to:", authUrl);
    window.location.href = authUrl;
}

const parseTokenFromUrl = () => {
    const urlParams = new URLSearchParams(window.location.hash.substring(1));
    return urlParams.get('id_token');

}

const fetchUserInfo = (idToken) => {
    const decodedToken = parseJwt(idToken);
    const email = decodedToken.email;
    const name = decodedToken.name;


    const userInfo = {
        email: decodedToken.email,
        name: decodedToken.name,
        firstName: decodedToken.given_name,
        lastName: decodedToken.family_name,
        pictureUrl: decodedToken.picture
    };
    localStorage.setItem('userNoValid', JSON.stringify(userInfo));

    console.log(idToken);
    console.log(email);
    localStorage.setItem('jwttoken',idToken);
    sessionStorage.setItem('email', email);
    sessionStorage.setItem('name', name);

    const url = `https://kindnesskettle.projects.bbdgrad.com/api/login/auth?email=${encodeURIComponent(email)}`;

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify({ email: email })
    };

    fetch(url, requestOptions)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
        
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json(); // Parse JSON response
            } else {
                return response.text(); // Return plain text response
            }
        })
        .then(result => {
            console.log(result);
            if (!result) {
                console.log('user is not valid')
                toggleRegistrationFormVisibility(true); // Show registration form
                toggleNavVisibility(false); // Hide navigation
                createRegistrationForm(); 

            } else {
                const userAccount = result.userAccount;
                localStorage.setItem('userdetails', JSON.stringify(userAccount)); // Store user details as string
                console.log("user is valid ", userAccount);
                toggleRegistrationFormVisibility(false);
                toggleNavVisibility(true);
                createPost();
               
            }
        })
        .catch(error => {
            console.error('Error:', error);
           

        });
}

const parseJwt = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

function logout(){
    console.log('logging out')
    sessionStorage.clear();
    localStorage.clear();
    window.location.href = 'landingpage.html';
}



function fetchUserData() {
    // Assuming you have the user ID stored in localStorage
    const userDetailsString = localStorage.getItem('userdetails');

    // Parse the user details JSON string into an object
    const userDetails = JSON.parse(userDetailsString);
    //console.log(userDetails);

    let jwttoken = localStorage.getItem('jwttoken');
    let userId = userDetails.userId;

    console.log(jwttoken);
    // console.log(jwttoken)
    // Fetch user data from the provided API
    fetch(`https://kindnesskettle.projects.bbdgrad.com/api/kindnesskettle/useranalytics/${userId}`, {
        headers: {
            'Authorization': `Bearer ${jwttoken}`
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log("user data:",data)
    
    })
    .catch(error => console.error("Error fetching user data:", error));
}


async function SavePost() {


    let jwttoken = localStorage.getItem('jwttoken');


    fetch('https://kindnesskettle.projects.bbdgrad.com/api/donationPosts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwttoken}`
        },
        body: JSON.stringify({
            "userId": 6,
            "foodTypeId": 2,
            "addressLine": "hello mini",
            "pincode": "7678673",
            "longitude": 45.678,
            "latitude": 78.901,
            "foodImageUrl": "http://example.com/kutta.com",
            "timeAvailable": "2024-03-25T12:00:00"
        }),
    })
    .then(response => {
        if (response.ok) {
            console.log('Post saved successfully:');
        
        }
    
    })
    .then(data => {
        console.log('Post saved successfully:', data);
    
    })
    .catch(error => {
        console.error('There was a problem saving the post:', error);
    
    });

}





const toggleRegistrationFormVisibility = (visible) => {
    const registrationFormContainer = document.getElementById('registration-form-container');
    registrationFormContainer.style.display = visible ? 'block' : 'none';
}

const toggleNavVisibility = (visible) => {
    const nav = document.querySelector('.header');
    nav.style.display = visible ? 'block' : 'none';
}



const handleRegistration = () => {
    let jwttoken = localStorage.getItem('jwttoken');
    const form = document.getElementById('registration-form');
    const formData = new FormData(form);

    // Ensure the email address is retrieved correctly
    let email = sessionStorage.getItem('email') || formData.get('Email:');
    if (!email) {
        alert('Email address is required.');
        return;
    }

    // Retrieve form fields directly
    const firstName = form.querySelector('input[placeholder="Enter your name"]').value;
    const lastName = form.querySelectorAll('input[placeholder="Enter your name"]')[1].value; // Assuming the second 'Enter your name' is for the last name
    const username = form.querySelector('input[placeholder="Enter your username"]').value;
    const description = form.querySelector('textarea[placeholder="Enter your description"]').value;
    const imageUrl = form.querySelector('input[type="file"]').files[0];

    // Append additional fields if needed
    formData.append('firstName', firstName);
    formData.append('lastName', lastName);
    formData.append('emailAddress', email);
    formData.append('username', username);
    formData.append('profileDescription', description);

    if (imageUrl) {
        formData.append('imageUrl', imageUrl);
    }


    // Log form data for debugging
    for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
    }

   // Send registration data to the server

    fetch('https://kindnesskettle.projects.bbdgrad.com/api/register', {
        method: 'POST',
        body: formData,
        headers: {
            'Authorization': `Bearer ${jwttoken}`
        }
    })
    .then(response => {
        console.log('Response status:', response.status); // Log the response status
        if (!response.ok) {
            return response.text().then(text => { throw new Error(text); }); // Get response text on error
        }
        return response.json();
    })
    .then(data => {
        console.log('Server response:', data); // Log the server response

        if (data.success) {
            // Store user data in localStorage
            const userData = {
                firstName: formData.get('firstName'),
                lastName: formData.get('lastName'),
                emailAddress: formData.get('emailAddress'),
                username: formData.get('username'),
                profileDescription: formData.get('profileDescription'),
                imageUrl: data.imageUrl 
            };
            localStorage.setItem('userdetails', JSON.stringify(userData));
            // Redirect to the home page
            window.location.reload();
           
            
            

        } else {
            alert('Registration failed. Please try again.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert(`An error occurred: ${error.message}`); // Display error message
    });
};

 
const createRegistrationForm = () => {
    const formContainer = document.createElement('div');
    formContainer.classList.add('registration-form-container');
    formContainer.id = 'registration-form-container';

    const form = document.createElement('form');
    form.classList.add('registration-form');
    form.id = 'registration-form';

    const title = document.createElement('u');
    title.innerHTML = '<div class="title">Registration</div>';

    const userDetails = document.createElement('div');
    userDetails.classList.add('user-details');

    const firstNameInput = createInput('First Name:', 'text', 'Enter your name', true);
    const lastNameInput = createInput('Last Name:', 'text', 'Enter your name', true);
    const emailInput = createInput('Email:', 'email', 'Enter your email', false, true);
    const usernameInput = createInput('Username:', 'text', 'Enter your username', true);
    const descriptionInput = createInput('Description:', 'textarea', 'Enter your description', true);
    const profilePictureInput = createInput('Profile Picture:', 'file', '', false, false, 'image/*');

    // Retrieve user data from localStorage
    const userData = JSON.parse(localStorage.getItem('userNoValid'));

    if (userData) {
        // Fill form fields with retrieved data
        fillInputValue(firstNameInput, userData.firstName);
        fillInputValue(lastNameInput, userData.lastName);
        fillInputValue(emailInput, userData.email);
        fillInputValue(usernameInput, userData.username);
        fillTextareaValue(descriptionInput, userData.description);
    }

    userDetails.append(firstNameInput, lastNameInput, emailInput, usernameInput, descriptionInput, profilePictureInput);

    const registerButton = document.createElement('input');
    registerButton.type = 'submit';
    registerButton.value = 'Register';

    const cancelButton = document.createElement('input');
    cancelButton.type = 'button';
    cancelButton.value = 'Cancel';
    cancelButton.onclick = logout;

    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('button');
    buttonContainer.append(registerButton, cancelButton);

    form.append(title, userDetails, buttonContainer);

    formContainer.appendChild(form);

    // Append form container to main content
    const mainContent = document.getElementById('main-content');
    mainContent.innerHTML = ''; // Clear main content first
    mainContent.appendChild(formContainer);

    // Add event listener to form
    form.addEventListener('submit', function(event) {
        event.preventDefault();
        handleRegistration();
    });
}

// Function to create input elements
const createInput = (labelText, type, placeholder, required, disabled = false, accept = '') => {
    const inputBox = document.createElement('div');
    inputBox.classList.add('input-box');

    const details = document.createElement('span');
    details.classList.add('details');
    details.textContent = labelText;

    const input = document.createElement(type === 'textarea' ? 'textarea' : 'input');
    input.type = type !== 'textarea' ? type : undefined;
    input.placeholder = placeholder;
    input.required = required;
    input.disabled = disabled;
    input.accept = accept;

    inputBox.append(details, input);

    return inputBox;
}

const fillInputValue = (inputElement, value) => {
    if (inputElement && inputElement.querySelector('input')) {
        inputElement.querySelector('input').value = value || '';
    }
}

// Function to fill textarea value
const fillTextareaValue = (textareaElement, value) => {
    if (textareaElement && textareaElement.querySelector('textarea')) {
        textareaElement.querySelector('textarea').value = value || '';
    }
}