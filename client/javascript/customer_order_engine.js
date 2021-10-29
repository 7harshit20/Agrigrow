const output = document.getElementById('display');
const rafsubmit = document.getElementById('rafsubmit');
const form = document.getElementById('_form');
const pos = document.getElementById('pos');
const cont = document.getElementById('cont');
let soi, spi;

document.addEventListener('DOMContentLoaded', async (e) => {
    const res = await fetch('https://agms.herokuapp.com/customer/orders', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        }
    });
    const data = await res.json();
    let num = 0;
    data.forEach(async (order) => {

        const response = await fetch(`https://agms.herokuapp.com/customer/getProducts/id/${order.product_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': sessionStorage.getItem('token')
            },

        });
        const product = await response.json();

        const response2 = await fetch(`https://agms.herokuapp.com/customer/getFarmer/${product.farmer_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': sessionStorage.getItem('token')
            },

        });
        const farmer = await response2.json();

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
                        <h5 class="card-title  text-center">Order price: &#8377 ${order.quantity * product.price} </h5>
                    </div>
                    <div style="display: ${order.state === 'delivered' ? 'block' : 'none'};" class="card-footer text-center" id="${order.product_id}">
                        <button data-toggle="modal" data-target="#giveraf" class=" _special btn btn-primary w-100 d-block" id="${order.id}">Give Rating and feedback</button>
                    </div>
               </div>
            </div>
            `;
        num = num + 1;
    });
});

output.addEventListener('click', e => {
    if (!e.target.className.includes('_special')) return;
    soi = e.target.id;
    spi = e.target.parentElement.id;
    console.log(spi);

});

rafsubmit.addEventListener('click', async (e) => {
    let rin = document.getElementById('_rating').value;
    let fin = document.getElementById('_feedback').value;
    if (rin !== '0' && rin !== '1' && rin !== '2' && rin !== '3' && rin !== '4' && rin !== '5') {
        displayError("form-control form-control-lg bg-warning", "Rating must be a interger between 0 and 5", form, pos);
        return;
    }
    if (!fin) {
        displayError("form-control form-control-lg bg-warning", "Feedback cannot be empty", form, pos);
        return;
    }

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
    $('#giveraf').modal('hide');
    displayError('form-control form-control-lg bg-warning', 'Rating and Feedback saved', cont, display,)
    // $('html, body').animate({ scrollTop: 0 }, 'fast');
});




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

document.getElementById('logout').addEventListener('click', function () {
    sessionStorage.removeItem('token');
    location.href = "../html/index.html";
});
