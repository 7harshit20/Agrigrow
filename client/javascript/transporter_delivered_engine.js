const output = document.getElementById('display');

// Loads the delevered order
document.addEventListener('DOMContentLoaded', async (e) => {

    // Request to fetch orders
    const res = await fetch('https://agms.herokuapp.com/transporter/deliveredProducts', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        }
    });
    const data = await res.json();


    // Displaying all the fetched orders
    let num = 0;
    data.forEach(async (order) => {

        // Fetches details to buyer
        const response = await fetch(`https://agms.herokuapp.com/customer/getProducts/id/${order.product_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': sessionStorage.getItem('token')
            }
        });
        const product = await response.json()

        // Fetches details to seller 
        const result = await fetch(`https://agms.herokuapp.com/customer/getFarmer/${product.farmer_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': sessionStorage.getItem('token')
            }
        });
        const farmer = await result.json();

        // Setting up html and placing it in dom
        let colour = 'success';
        if (num % 2 !== 0) colour = 'dark';
        output.innerHTML +=
            `
            <div class="col-md-4 p-3">
                <div style="height: 400px;" class="card bg-${colour} text-white  ">
                    <div class="card-header text-center">
                        <h3>${product.name}</h3>
                    </div>
                    <div style="height: 450px;" class="card-body ">
                        Buyer's name: ${order.buyer} <br><br>
                        Buyer's address: <br> ${order.address} <br><br>
                        Quantity : ${order.quantity} kg <br><br>
                        Seller's name : ${farmer.name} <br><br>
                        Seller's phone : ${farmer.phone} <br><br>
                    </div>
               </div>
            </div>
            `
        num = num + 1;
    });
});


// Logs out the user
document.getElementById('logout').addEventListener('click', function () {
    sessionStorage.removeItem('token');
    location.href = "../html/index.html";
});
