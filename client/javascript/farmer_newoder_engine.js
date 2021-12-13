const output = document.getElementById('display');

// Loads the new recieved order
document.addEventListener('DOMContentLoaded', async (e) => {

    // Request to fetch new orders
    const res = await fetch('https://agms.herokuapp.com/farmer/newProducts', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        }
    });
    const data = await res.json();

    // Displaying all the fetched orders
    data.forEach(async (order, index) => {

        // Fetches details to buyer 
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
            <div class="col-md-4 p-3">
                <div class="card bg-${colour} text-white" id="${product.id}">
                    <div class="card-header text-center">
                        <h3>${product.name}</h3>
                    </div>
                    <div class="card-body ">
                        Buyer's name: ${order.buyer} <br><br>
                        Buyer's address: <br> ${order.address} <br><br>
                        Buyer's phone no. : ${order.mobile} <br><br>
                        Available quantity : ${product.quantity} kg <br><br>
                        Quantity Needed: ${order.quantity} kg <br><br>
                        <h5 class="card-title  text-center">Order price: ${order.quantity * product.price}<i class="fab fa-ethereum"></i></h5>
                    </div>
                    <div class="card-footer text-center" id="${product.quantity - order.quantity}">
                        <button id="${order.id}" class="btn btn-primary w-100 d-block acceptOrd">Accept Order</button>
                    </div>
               </div>
            </div>
            `
    });
});

// Changes new orders to accepted orders
output.addEventListener('click', async (e) => {
    if (!e.target.className.includes('acceptOrd')) return;

    // Specifies new quantity to be set
    const reqObj = {
        remQuantity: e.target.parentElement.id,
        product_id: e.target.parentElement.parentElement.id
    }
    // Request to change order state and reduce available quantity
    await fetch(`https://agms.herokuapp.com/farmer/newProducts/${e.target.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        },
        body: JSON.stringify(reqObj)
    });

    // Reload the window to display changes
    location.reload();
});

// Logs out the user
document.getElementById('logout').addEventListener('click', function () {
    sessionStorage.removeItem('token');
    location.href = "../html/index.html";
});