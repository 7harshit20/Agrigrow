const signup_submit = document.getElementById('_signup_submit');
const username = document.getElementById('_username');
const email = document.getElementById('_email');
const password = document.getElementById('_password');
const confirm_password = document.getElementById('_Confirm_password');
const form = document.getElementById('form');
const select_category = document.getElementById('select_category');
const category = document.getElementById('category');

const signin_submit = document.getElementById('_signin_submit');
const login_email = document.getElementById('login_email');
const login_password = document.getElementById('login_password');
const login_category = document.getElementById('login_category');
const login_form = document.getElementById('login_form');
const login_div = document.getElementById('login_div');
let token;

signin_submit.addEventListener('click', function () {
    async function run() {

        const user = {
            email: login_email.value,
            password: login_password.value,
            category: login_category.value
        }

        const res = await fetch(`http://localhost:3000/signin/${login_category.value}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        const data = await res.text();
        console.log(data);
        if (data === 'Invalid email or password') {
            displayError("form-control", data, login_form, login_div);
            return;
        }
        token = data;
        sessionStorage.setItem('token', token);
        // enter the page to be directed here... 
        if (login_category.value === 'farmer') location.href = "./farmerDashboard.html";
        else if (login_category.value === 'customer') location.href = "./customer_homepage.html";
        else if (login_category.value === 'transporter') location.href = "./transporter_dashboard.html";
    }
    run();
});



signup_submit.addEventListener('click', function () {
    async function run() {

        const user = {
            name: username.value,
            email: email.value,
            password: password.value,
            confirm_password: confirm_password.value
        }

        const res = await fetch(`http://localhost:3000/signup/${category.value}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        });
        console.log(res);
        const data = await res.json();
        console.log(data);
        if (data.message) {
            displayError("form-control form-control-lg bg-warning", data.message, form, select_category);
            return;
        }
        if (data.sameEmail) {
            displayError("form-control form-control-lg bg-warning", text, form, select_category);
            return;
        }
        // enter the page to be directed here... 
        token = data.token;
        sessionStorage.setItem('token', token);
        if (category.value === 'farmer') location.href = "./farmerDashboard.html";
        else if (category.value === 'customer') location.href = "./customer_homepage.html";
        else if (category.value === 'transporter') location.href = "./transporter_dashboard.html";
    }
    run();
});

function displayError(cls, message, place, pos) {
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
    place.insertBefore(error, pos);
    setTimeout(function () {
        error.remove();
    }, 2000)
}

// module.exports= {token};