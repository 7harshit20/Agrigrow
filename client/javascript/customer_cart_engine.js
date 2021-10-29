const output = document.getElementById('display');
const addressOrderCard = document.getElementById('addressOrderCard');
const _name = document.getElementById('_name');
const _mob = document.getElementById('_mob');
const _pin = document.getElementById('_pin');
const _house = document.getElementById('_house');
const _area = document.getElementById('_area');
const _landmark = document.getElementById('_landmark');
const _city = document.getElementById('_city');
const _state = document.getElementById('_state');
const form = document.getElementById('form');
const pos = document.getElementById('pos');
const orderBtn = document.getElementById('place_order');


document.addEventListener('DOMContentLoaded', async () => {
    const res = await fetch('https://agms.herokuapp.com/customer/getCart/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        }
    });
    const data = await res.json();
    // console.log(data);
    if (data.length !== 0) addressOrderCard.style.display = 'block';
    let num = 1;
    data.forEach(async (item) => {
        const response = await fetch(`https://agms.herokuapp.com/customer/getProducts/id/${item.product_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': sessionStorage.getItem('token')
            },

        });
        const product = await response.json();
        // console.log(product);
        output.innerHTML += `
        <tr>
            <th scope="row">${num++}</th>
            <td>${product.name}</td>
            <td>${item.quantity} kg </td>
            <td>&#8377 ${product.price * item.quantity}</td>
            <td><a id="check"><i class="fas fa-trash delete" id="${item.id}"></i></a> </td>
          </tr>
        `
    });
    output.innerHTML += `
    
    `
});

output.addEventListener('click', async (e) => {
    if (e.target.parentElement.id !== 'check') return;
    const cartId = e.target.id;
    await fetch(`https://agms.herokuapp.com/customer/deleteFromCart/${cartId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        }
    });
    location.reload();
});

orderBtn.addEventListener('click', async () => {
    if (!_name.value || !_mob.value || !_pin.value || !_house.value || !_area.value || !_landmark.value || !_city.value || !_state.value) {
        displayError("form-control form-control-md bg-warning w-50", "Please fill in all the fields", form, pos);
        return;
    }

    const buyer = _name.value;
    const address = _house.value + " " + _area.value + " " + _landmark.value + " " + _city.value + " " + _state.value + " " + _pin.value.toString();
    const mobile = _mob.value.toString();

    let order;
    const res = await fetch('https://agms.herokuapp.com/customer/getCart/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        }
    });
    const data = await res.json();
    data.forEach(async (item) => {
        const response = await fetch(`https://agms.herokuapp.com/customer/getProducts/id/${item.product_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': sessionStorage.getItem('token')
            },

        });
        const product = await response.json()
        order = {
            product_id: `${item.product_id}`,
            quantity: `${item.quantity}`,
            farmer_id: `${product.farmer_id}`,
            buyer,
            address,
            mobile
        }
        await fetch('https://agms.herokuapp.com/customer/placeOrder/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': sessionStorage.getItem('token')
            },
            body: JSON.stringify(order)
        });
    });
    await fetch(`https://agms.herokuapp.com/customer/deleteFromCart/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        }
    });
    location.reload();
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
