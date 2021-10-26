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

document.addEventListener('DOMContentLoaded', async e => {
    // api to getTransporter
    const res = await fetch('http://localhost:3000/transporter/get_profile', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        }
    });
    const transporter = await res.json();
    deliveries.textContent = transporter.successful_deliveries;
    if (transporter.phone) set = true;
    _name.value = transporter.name;
    _email.value = transporter.email;

    if (set) {
        title.textContent = 'Click Edit details to make changes';
        _phone.value = transporter.phone;
        _gst.value = transporter.gst;
        _pan.value = transporter.pan;
        _bank.value = transporter.bank;
        _address.value = transporter.address;
        _city.value = transporter.city;
        _state.value = transporter.state;
        _pin.value = transporter.pin;
        Object.entries(details).forEach(([key]) => {
            document.getElementById(`${key}`).setAttribute('disabled', 'true');
        });
        saveBtn.style.display = 'none';
        editBtn.style.display = 'block';
        declare.style.display = 'none';
    }

});

saveBtn.addEventListener('click', async (e) => {

    let unfilled = false;
    if (!_phone.value || !_gst.value || !_pan.value || !_bank.value || !_address.value || !_city.value || !_state.value || !_pin.value) {
        displayError("form-control form-control-lg bg-warning text-dark", "Please fill in all the fields", form, pos);
        $('html, body').animate({ scrollTop: 0 }, 'fast');
        unfilled = true;
        return;
    }

    if (!_terms.checked && !unfilled) {
        displayError("form-control form-control-lg bg-warning text-dark", "Please check the box and declare the information is correct", form, pos);
        $('html, body').animate({ scrollTop: 0 }, 'fast');
        return;
    }

    const transporter_profile = {
        phone: _phone.value,
        gst: _gst.value,
        pan: _pan.value,
        bank: _bank.value,
        address: _address.value,
        city: _city.value,
        state: _state.value,
        pin: _pin.value.toString()
    }

    await fetch('http://localhost:3000/transporter/set_profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        },
        body: JSON.stringify(transporter_profile)
    });

    set = true;
    location.reload();
});


editBtn.addEventListener('click', async (e) => {
    title.textContent = 'Click Save details to proceed';
    Object.entries(details).forEach(([key]) => {
        document.getElementById(`${key}`).removeAttribute('disabled');
    });
    saveBtn.style.display = 'block';
    editBtn.style.display = 'none';
    declare.style.display = 'block';
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

document.getElementById('logout').addEventListener('click', function () {
    sessionStorage.removeItem('token');
    location.href = "../html/index.html";
});