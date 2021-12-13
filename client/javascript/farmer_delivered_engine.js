const { abi } = require('../../ethereum/build/Agrigrow.json')
const web3 = require("../../ethereum/web3");

const output = document.getElementById('display');
const _amount = document.getElementById('_amount');
const balance = document.getElementById('get_blance');
const receive = document.getElementById('receive');


// Loads the accepted order
document.addEventListener('DOMContentLoaded', async (e) => {

    // Request to fetch new orders
    const res = await fetch('https://agms.herokuapp.com/farmer/deliveredProducts', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        }
    });
    const data = await res.json();

    // Displaying all the fetched orders
    data.forEach(async (order, index) => {

        // Request to fetch details of transporter 
        const result = await fetch(`https://agms.herokuapp.com/farmer/getTransporter/${order.transporter_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': sessionStorage.getItem('token')
            },
        });
        const tsp = await result.json();

        // Request to fetche details of buyer 
        const response = await fetch(`https://agms.herokuapp.com/customer/getProducts/id/${order.product_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': sessionStorage.getItem('token')
            },

        });
        const product = await response.json()

        // Setting up html and placing it in dom
        let colour = 'success';
        if (index % 2 !== 0) colour = 'dark';
        output.innerHTML +=
            `
            <div class="col-md-4">
                <div class="card bg-${colour} text-white  ">
                    <div class="card-header text-center">
                        <h3>${product.name}</h3>
                    </div>
                    <div class="card-body ">
                        Buyer's name: ${order.buyer} <br><br>
                        Buyer's phone no. : ${order.mobile} <br><br>
                        Transporter's name : ${tsp.name} <br><br>
                        Transporter's phone : ${tsp.phone} <br><br>
                        Delivery address: <br> ${order.address} <br><br>
                        <h5 class="card-title  text-center">Quantity Delivered: ${order.quantity} kg</h5>
                        <h5 class="card-title  text-center">Amount recieved:<i class="fab fa-ethereum"></i> ${order.quantity * product.price} </h5>
                    </div>
               </div>
            </div>
            `
    });
});

balance.addEventListener('click', async () => {

    // fetch and address
    let address = '0xcf4cA3f8B7d49D9F81b32DC1Be5474d4e5a4dcb8', agrigrow, bln;
    balance.innerText = 'Loading...'
    try {
        agrigrow = new web3.eth.Contract(abi, address);
        bln = web3.utils.fromWei(await web3.eth.getBalance(address), 'ether');
    } catch (err) {
        balance.innerText = 'Balance';
        alert(`Something went wrong, ${err} `);
        return;
    }

    // change payment status to paid for order_id
    balance.innerText = 'Balance';
    alert(`The balance of ${address} is ${bln} ethers`);
});

receive.addEventListener('click', async () => {
    const amount = _amount.value;

    // fetch address
    // Request to fetch profile
    const res = await fetch('https://agms.herokuapp.com/farmer/get_profile', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        }
    });
    const farmer = await res.json();

    let address = '0xcf4cA3f8B7d49D9F81b32DC1Be5474d4e5a4dcb8', agrigrow;
    // address = farmer.contract;
    receive.innerText = 'Loading...'
    try {
        const accounts = await web3.eth.getAccounts();
        agrigrow = new web3.eth.Contract(abi, address);
        const payable = web3.utils.toWei(amount, 'ether');
        await agrigrow.methods.withdraw(payable).send({ from: accounts[0] });
    } catch (err) {
        receive.innerText = 'Receive';
        alert(`Payment not done, ${err} `);
        $('#payOrder').modal('hide');
        return;
    }

    receive.innerText = 'Receive';
    alert(`Payment done from ${address}`);
    $('#payOrder').modal('hide');
});

// Logs out the user
document.getElementById('logout').addEventListener('click', function () {
    sessionStorage.removeItem('token');
    location.href = "../html/index.html";
});