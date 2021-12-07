const output = document.getElementById('display');

// Loads the accepted order
document.addEventListener('DOMContentLoaded', async (e) => {

    // Request to fetch new orders
    const res = await fetch('https://agms.herokuapp.com/farmer/acceptedProducts', {
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
                <div class="card bg-${colour} text-white  ">
                    <div class="card-header text-center">
                        <h3>${product.name}</h3>
                    </div>
                    <div class="card-body ">
                        Buyer's name: ${order.buyer} <br><br>
                        Buyer's address: <br> ${order.address} <br><br>
                        Buyer's phone no. : ${order.mobile} <br><br>
                        Quantity ordered: ${order.quantity} kg <br><br>
                    </div>
                    <div class="card-footer text-center" id="shipOrd">
                        <h5 class="card-title  text-center">Order price: &#8377 ${order.quantity * product.price} </h5>
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