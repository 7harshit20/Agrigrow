const agrigrowRoot = require('../../ethereum/agrigrowRoot');
const web3 = require('../../ethereum/web3');

// Selecting input entries
const deliveries = document.getElementById('deliveries');
const _name = document.getElementById('_name');
const _email = document.getElementById('_email');
const _phone = document.getElementById('_phone');
const _gst = document.getElementById('_gst');
const _pan = document.getElementById('_pan');
const _bank = document.getElementById('_bank');
const _address = document.getElementById('_address');
const _city = document.getElementById('_city');
const _state = document.getElementById('_state');
const _pin = document.getElementById('_pin');
const _terms = document.getElementById('_terms');
const form = document.getElementById('form');
const pos = document.getElementById('pos');
const saveBtn = document.getElementById('save');
const editBtn = document.getElementById('edit');
const title = document.getElementById('title');
const declare = document.getElementById('declare');

const details = { _phone, _gst, _pan, _bank, _address, _city, _state, _pin };
let set = false;

// Loads the profile
document.addEventListener('DOMContentLoaded', async e => {

    // Request to fetch profile
    const res = await fetch('https://agms.herokuapp.com/farmer/get_profile', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        }
    });
    const farmer = await res.json();

    // Set successful deliveries
    deliveries.textContent = farmer.successful_order;

    // Set name and email. Checks if profile is set or not
    if (farmer.phone) set = true;
    _name.value = farmer.name;
    _email.value = farmer.email;

    // Fills all the data, if profile is set up
    if (set) {
        title.textContent = 'Click Edit details to make changes';
        _phone.value = farmer.phone;
        _gst.value = farmer.gst;
        _pan.value = farmer.pan;
        _bank.value = farmer.bank;
        _address.value = farmer.address;
        _city.value = farmer.city;
        _state.value = farmer.state;
        _pin.value = farmer.pin;
        Object.entries(details).forEach(([key]) => {
            document.getElementById(`${key}`).setAttribute('disabled', 'true');
        });
        saveBtn.style.display = 'none';
        editBtn.style.display = 'block';
        declare.style.display = 'none';
    }


});

// Save new profile
saveBtn.addEventListener('click', async (e) => {

    saveBtn.innerHTML = 'Loading...';

    let unfilled = false;
    if (!_phone.value || !_gst.value || !_pan.value || !_bank.value || !_address.value || !_city.value || !_state.value || !_pin.value) {
        displayError("form-control form-control-lg bg-warning text-dark", "Please fill in all the fields", form, pos);
        $('html, body').animate({ scrollTop: 0 }, 'fast');
        unfilled = true;
        saveBtn.innerHTML = ' Save details and deploy my contract';
        return;
    }

    if (!_terms.checked && !unfilled) {
        displayError("form-control form-control-lg bg-warning text-dark", "Please check the box and declare the information is correct", form, pos);
        $('html, body').animate({ scrollTop: 0 }, 'fast');
        saveBtn.innerHTML = ' Save details and deploy my contract';
        return;
    }

    // Deploying contract for seller 
    let address;
    try {
        const accounts = await web3.eth.getAccounts();
        await agrigrowRoot.methods.createSellerContract().send({ from: accounts[0] });
        address = await agrigrowRoot.methods.getContactAddress(accounts[0]).call();
    } catch (err) {
        alert(`Contract not saved ${err} `);
        return;
    }

    const farmer_profile = {
        contract: address,
        phone: _phone.value,
        gst: _gst.value,
        pan: _pan.value,
        bank: _bank.value,
        address: _address.value,
        city: _city.value,
        state: _state.value,
        pin: _pin.value.toString()
    }

    // Request to set the profile
    await fetch('https://agms.herokuapp.com/farmer/set_profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        },
        body: JSON.stringify(farmer_profile)
    });

    // Reloads the page to display changes
    set = true;

    alert(`Contract deployed successfully with address ${address}`);
    saveBtn.innerHTML = ' Save details and deploy my contract';
    location.reload();
});

// Handle edit changes in case of changes made
editBtn.addEventListener('click', async (e) => {
    title.textContent = 'Click Save details to proceed';
    Object.entries(details).forEach(([key]) => {
        document.getElementById(`${key}`).removeAttribute('disabled');
    });
    saveBtn.style.display = 'block';
    editBtn.style.display = 'none';
    declare.style.display = 'block';
});


// function to display errors
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

// Logs out the user
document.getElementById('logout').addEventListener('click', function () {
    sessionStorage.removeItem('token');
    location.href = "../html/index.html";
});