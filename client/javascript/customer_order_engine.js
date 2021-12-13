const { abi } = require('../../ethereum/build/Agrigrow.json')
const web3 = require("../../ethereum/web3");
const output = document.getElementById('display');
const rafsubmit = document.getElementById('rafsubmit');
const form = document.getElementById('_form');
const pos = document.getElementById('pos');
const cont = document.getElementById('cont');
const _orderId = document.getElementById('_orderId');
const pay = document.getElementById('pay');
let soi, spi;

// Loads the placed order 
document.addEventListener('DOMContentLoaded', async (e) => {

    // Requests to fetch the placed order 
    const res = await fetch('https://agms.herokuapp.com/customer/orders', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        }
    });
    const data = await res.json();

    // Setting up html and placing it in dom
    let num = 0;
    data.forEach(async (order) => {

        // Request to fetch the product detail
        const response = await fetch(`https://agms.herokuapp.com/customer/getProducts/id/${order.product_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': sessionStorage.getItem('token')
            },

        });
        const product = await response.json();

        // Request to fetch the farmer detail
        const response2 = await fetch(`https://agms.herokuapp.com/customer/getFarmer/${product.farmer_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': sessionStorage.getItem('token')
            },

        });
        const farmer = await response2.json();

        // Request to fetch the transporter detail
        let transporter;
        if (order.transporter_id) {
            const response3 = await fetch(`https://agms.herokuapp.com/customer/getTransporter/${order.transporter_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': sessionStorage.getItem('token')
                },

            });
            transporter = await response3.json();
        }

        let colour = 'success';
        if (num % 2 !== 0) colour = 'dark';
        output.innerHTML +=
            `
            <div class="col-md-4 p-3">
                <div class="card bg-${colour} text-white" id="${product.id}">
                    <div class="card-header text-center">
                        <h3>${product.name}</h3>
                    </div>
                    <div class="card-body ">
                        Order ID: ${order.id} <br><br>
                        Order's state: ${order.state === 'new' ? 'placed' : order.state} <br><br>
                        Quantity Ordered: ${order.quantity} kg <br><br>
                        Seller's name: ${farmer.name} <br><br>
                        Seller's phone no. : ${farmer.phone} <br><br>
                        Transporter's phone no. : ${order.transporter_id ? transporter.phone : 'Transporter not assigned'} <br><br>
                        Delivery address: <br> ${order.address} <br><br>
                        <h5 class="card-title  text-center">Order price: ${order.quantity * product.price}<i class="fab fa-ethereum"></i><br><br>Paid: ${order.paid ? '<i class="fas fa-check-circle"></i>' : '<i class="fas fa-times-circle"></i>'} </h5>
                    </div>
                    <div style="display: ${order.paid ? 'block' : 'none'};" class="card-footer text-center" id="${order.product_id}">
                        <button data-toggle="modal" data-target="#giveraf" class=" _special btn btn-primary w-100 d-block" id="${order.id}">Give Rating and feedback</button>
                    </div>
               </div>
            </div>
            `;
        num = num + 1;
    });
});

// Selects the specified product
output.addEventListener('click', e => {
    if (!e.target.className.includes('_special')) return;
    soi = e.target.id;
    spi = e.target.parentElement.id;
});


// Submit rating and feedback
rafsubmit.addEventListener('click', async (e) => {
    let rin = document.getElementById('_rating').value;
    let fin = document.getElementById('_feedback').value;

    // Gives warning if rating is inappropiate
    if (rin !== '0' && rin !== '1' && rin !== '2' && rin !== '3' && rin !== '4' && rin !== '5') {
        displayError("form-control form-control-lg bg-warning", "Rating must be a interger between 0 and 5", form, pos);
        return;
    }
    if (!fin) {
        displayError("form-control form-control-lg bg-warning", "Feedback cannot be empty", form, pos);
        return;
    }

    // Requests to give the provied rating and feedback
    const rafobj = {
        rating: parseInt(rin),
        feedback: fin,
        product_id: parseInt(spi)
    };
    await fetch(`https://agms.herokuapp.com/customer/graf/${soi}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        },
        body: JSON.stringify(rafobj)
    });

    // Closes modal
    $('#giveraf').modal('hide');
    displayError('form-control form-control-lg bg-warning', 'Rating and Feedback saved', cont, display,)
});

pay.addEventListener('click', async () => {
    const order_id = _orderId.value;

    // fetch order value and address
    const res0 = await fetch(`https://agms.herokuapp.com/customer/payment/${order_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        }
    });
    const data = await res0.json();

    if (data.state !== 'delivered') {
        alert('Payments can be made only after order is delivered');
        return;
    }

    let order_value = data.price.toString(), address = data.address, agrigrow;
    pay.innerText = 'Loading...'
    try {
        const accounts = await web3.eth.getAccounts();
        agrigrow = new web3.eth.Contract(abi, address);
        const payable = web3.utils.toWei(order_value, 'ether');
        await agrigrow.methods.pay(payable).send({ from: accounts[0], value: payable });
    } catch (err) {
        pay.innerText = 'Pay';
        alert(`Payment not done, ${err} `);
        $('#payOrder').modal('hide');
        return;
    }

    // Request to update order to paid
    const res = await fetch(`https://agms.herokuapp.com/customer/order/${order_id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        }
    });
    console.log(await res.json());

    pay.innerText = 'Pay';
    alert(`Payment done for order id ${order_id}`);
    $('#payOrder').modal('hide');
    location.reload();
});


// display error
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
    }, 3000)
}


// Logs out the user
document.getElementById('logout').addEventListener('click', function () {
    sessionStorage.removeItem('token');
    location.href = "../html/index.html";
});
