const output = document.getElementById('display');

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
                        <h5 class="card-title  text-center">Amount recieved: &#8377 ${order.quantity * product.price} </h5>
                    </div>
               </div>
            </div>
            `
    });
});


// Logs out the user
document.getElementById('logout').addEventListener('click', function () {
    sessionStorage.removeItem('token');
    location.href = "../html/index.html";
});