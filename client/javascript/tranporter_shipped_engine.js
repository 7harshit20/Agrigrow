const output = document.getElementById('display');

document.addEventListener('DOMContentLoaded', async (e) => {
    const res = await fetch('https://agms.herokuapp.com/transporter/shippedProducts', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        }
    });
    const data = await res.json();
    data.forEach(async (order, index) => {
        const response = await fetch(`https://agms.herokuapp.com/customer/getProducts/id/${order.product_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': sessionStorage.getItem('token')
            }
        });
        const product = await response.json()

        const result = await fetch(`https://agms.herokuapp.com/customer/getFarmer/${product.farmer_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': sessionStorage.getItem('token')
            }
        });
        const farmer = await result.json();
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
                        Recipient name: ${order.buyer} <br><br>
                        Recipient address: <br> ${order.address} <br><br>
                        Recipient phone number: <br> ${order.mobile} <br><br>
                        Quantity : ${order.quantity} kg <br><br>
                        Seller's name : ${farmer.name} <br>
                        
                    </div>
                    <div class="card-footer text-center" id="delivered">
                        <button id="${order.id}" class="btn btn-primary w-100 d-block">Order Delivered</button>
                    </div>
               </div>
            </div>
            `
    });
});

output.addEventListener('click', async (e) => {
    if (e.target.parentElement.id !== 'delivered') return;
    await fetch(`https://agms.herokuapp.com/transporter/shippedProducts/${e.target.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        },
    });

    location.reload();
});




document.getElementById('logout').addEventListener('click', function () {
    sessionStorage.removeItem('token');
    location.href = "../html/index.html";
});
