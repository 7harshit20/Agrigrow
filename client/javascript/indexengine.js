// selecting the input fields for signin
const signup_submit = document.getElementById('_signup_submit');
const username = document.getElementById('_username');
const email = document.getElementById('_email');
const password = document.getElementById('_password');
const confirm_password = document.getElementById('_Confirm_password');
const form = document.getElementById('form');
const select_category = document.getElementById('select_category');
const category = document.getElementById('category');

// selecting the input fields for signup
const signin_submit = document.getElementById('_signin_submit');
const login_email = document.getElementById('login_email');
const login_password = document.getElementById('login_password');
const login_category = document.getElementById('login_category');
const login_form = document.getElementById('login_form');
const login_div = document.getElementById('login_div');
let token;

// Event Listener for signin
signin_submit.addEventListener('click', function () {
    async function run() {

        // creating object to be send to backend
        const user = {
            email: login_email.value,
            password: login_password.value,
            category: login_category.value
        }

        // sending signin request to backend
        const res = await fetch(`https://agms.herokuapp.com/signin/${login_category.value}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        const data = await res.text();

        // warning for incorrect password
        if (data === 'Invalid email or password') {
            displayError("form-control", data, login_form, login_div);
            return;
        }

        // setting token to session session storage
        token = data;
        sessionStorage.setItem('token', token);

        // redirecting to homepage depending on category
        if (login_category.value === 'farmer') location.href = "./farmerDashboard.html";
        else if (login_category.value === 'customer') location.href = "./customer_homepage.html";
        else if (login_category.value === 'transporter') location.href = "./transporter_dashboard.html";
    }
    run();
});


// Event listener for signup
signup_submit.addEventListener('click', function () {
    async function run() {

        // creating object to be send to backend
        const user = {
            name: username.value,
            email: email.value,
            password: password.value,
            confirm_password: confirm_password.value
        }

        // sending signup request to backend
        const res = await fetch(`https://agms.herokuapp.com/signup/${category.value}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        const data = await res.json();

        // warning for missing entries or already used email
        if (data.message) {
            displayError("form-control form-control-lg bg-warning", data.message, form, select_category);
            return;
        }
        if (data.sameEmail) {
            displayError("form-control form-control-lg bg-warning", text, form, select_category);
            return;
        }

        // setting token to session storage
        token = data.token;
        sessionStorage.setItem('token', token);

        // redirecting to homepage depending on category
        if (category.value === 'farmer') location.href = "./farmerDashboard.html";
        else if (category.value === 'customer') location.href = "./customer_homepage.html";
        else if (category.value === 'transporter') location.href = "./transporter_dashboard.html";
    }
    run();
});


// Function to display error 
function displayError(cls, message, place, pos) {
    // creating error element 
    const error = document.createElement('div');
    error.className = 'form-group';
    error.innerHTML =
        `
    <input type="text"
    class="${cls}"
    placeholder='${message}'
    disabled
    ></input>
    `;

    // placing error element
    place.insertBefore(error, pos);

    // removing error element after specified time
    setTimeout(function () {
        error.remove();
    }, 2000)
}
