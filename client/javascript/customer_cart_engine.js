// Selects input fields and buttons
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

// Loads cart and buyer detail form
document.addEventListener('DOMContentLoaded', async () => {

    // Request to fetch cart of the 
    const res = await fetch('https://agms.herokuapp.com/customer/getCart', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        }
    });
    const data = await res.json();
    if (data.length !== 0) addressOrderCard.style.display = 'block';

    // Setting up html and place in dom
    let num = 1;
    data.forEach(async (item) => {

        // Request to fetch details for selected product 
        const response = await fetch(`https://agms.herokuapp.com/customer/getProducts/id/${item.product_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': sessionStorage.getItem('token')
            },

        });
        const product = await response.json();

        output.innerHTML += `
        <tr>
            <th scope="row">${num++}</th>
            <td>${product.name}</td>
            <td>${item.quantity} kg </td>
            <td>Price: ${product.price * item.quantity}<i class="fab fa-ethereum"></i></td>
            <td><a id="check"><i class="fas fa-trash delete" id="${item.id}"></i></a> </td>
          </tr>
        `
    });
    output.innerHTML += ``
});


// Delete the selected product
output.addEventListener('click', async (e) => {
    if (e.target.parentElement.id !== 'check') return;

    // gets the id of selected product
    const cartId = e.target.id;

    // Send request to delete the selected product
    await fetch(`https://agms.herokuapp.com/customer/deleteFromCart/${cartId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        }
    });

    // Reload the window
    location.reload();
});

// Places the order
orderBtn.addEventListener('click', async () => {

    // Gives warning if any field in empty
    if (!_name.value || !_mob.value || !_pin.value || !_house.value || !_area.value || !_landmark.value || !_city.value || !_state.value) {
        displayError("form-control form-control-md bg-warning w-50", "Please fill in all the fields", form, pos);
        return;
    }

    // store buyer, address, phone number
    const buyer = _name.value;
    const address = _house.value + " " + _area.value + " " + _landmark.value + " " + _city.value + " " + _state.value + " " + _pin.value.toString();
    const mobile = _mob.value.toString();

    // Request to get all products from cart
    let order;
    const res = await fetch('https://agms.herokuapp.com/customer/getCart/', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        }
    });
    const data = await res.json();

    // Placing order for each cart item
    data.forEach(async (item) => {

        // Request to fetch detail of seleceted item
        const response = await fetch(`https://agms.herokuapp.com/customer/getProducts/id/${item.product_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': sessionStorage.getItem('token')
            },
        });
        const product = await response.json()

        // Creates order object and send request to place order
        order = {
            product_id: item.product_id,
            quantity: item.quantity,
            farmer_id: product.farmer_id,
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

    // Request to empty the cart after order has been placed
    await fetch(`https://agms.herokuapp.com/customer/deleteFromCart/`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        }
    });

    // alerts that order has been placed
    alert('Your order has been placed');
    window.location.replace("../html/customer_order.html");
});


// displays error
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
