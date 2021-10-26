const output = document.getElementById('display');

document.addEventListener('DOMContentLoaded', async (e) => {
    const res = await fetch('http://localhost:3000/farmer/shippedProducts', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        }
    });
    const data = await res.json();
    // console.log(data);
    data.forEach(async (order, index) => {
        const result = await fetch(`http://localhost:3000/farmer/getTransporter/${order.transporter_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': sessionStorage.getItem('token')
            },
        });
        const tsp = await result.json();
        const response = await fetch(`http://localhost:3000/customer/getProducts/id/${order.product_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': sessionStorage.getItem('token')
            },

        });
        const product = await response.json()
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
                        Transporter's name : ${tsp.name} <br><br>
                        Transporter's phone : ${tsp.phone} <br>
                    </div>
                    <div class="card-footer text-center" id="shipOrd">
                        <h5 class="card-title  text-center">Order price: &#8377 ${order.quantity * product.price} </h5>
                    </div>
               </div>
            </div>
            `
    });
});


document.getElementById('logout').addEventListener('click', function () {
    sessionStorage.removeItem('token');
    location.href = "../html/index.html";
});