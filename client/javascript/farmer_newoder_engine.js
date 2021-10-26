const output = document.getElementById('display');

document.addEventListener('DOMContentLoaded', async (e) => {
    const res = await fetch('http://localhost:3000/farmer/newProducts', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        }
    });
    const data = await res.json();
    data.forEach(async (order, index) => {
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
                        <h5 class="card-title  text-center">Order price: &#8377 ${order.quantity * product.price} </h5>
                    </div>
                    <div class="card-footer text-center" id="${product.quantity - order.quantity}">
                        <button id="${order.id}" class="btn btn-primary w-100 d-block acceptOrd">Accept Order</button>
                    </div>
               </div>
            </div>
            `
    });
});

output.addEventListener('click', async (e) => {
    if (!e.target.className.includes('acceptOrd')) return;
    await fetch(`http://localhost:3000/farmer/newProducts/${e.target.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        },
    });

    const reqObj = {
        remQuantity: e.target.parentElement.id,
        product_id: e.target.parentElement.parentElement.id
    }
    await fetch(`http://localhost:3000/farmer/newProducts/${e.target.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        },
        body: JSON.stringify(reqObj)
    });
    location.reload();
});


document.getElementById('logout').addEventListener('click', function () {
    sessionStorage.removeItem('token');
    location.href = "../html/index.html";
});