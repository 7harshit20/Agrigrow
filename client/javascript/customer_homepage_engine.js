let output = document.getElementById('display');
let spi, spq;
const pd = document.getElementById('pd');
const rq = document.getElementById('rq');

document.getElementById('search').addEventListener('click', function (e) {
    output.innerHTML = '';
    async function getRequiredProduct() {
        const searchedproduct = document.getElementById('product_search').value;

        if (searchedproduct === '') {
            alert('Please enter some product name');
            return;
        };
        const res = await fetch(`http://localhost:3000/customer/getProducts/${searchedproduct}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': sessionStorage.getItem('token')
            }
        });
        const data = await res.json();

        let num = -1;
        data.forEach(async (product) => {
            num++;
            let colour = 'success';
            if (num % 2 !== 0) colour = 'dark';
            const response = await fetch(`http://localhost:3000/customer/getFarmer/${product.farmer_id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': sessionStorage.getItem('token')
                }
            });
            const farmer = await response.json();
            // console.log(farmer);
            let rating = 0.0;
            if (product.deliveries) rating = product.stars / product.feedbacks;
            output.innerHTML +=
                `
            <div class="col-md-4 p-3">
                <div style="height: 550px;" class="card bg-${colour} text-white">
                    <div class="card-header text-center">
                    <span style="border-radius: 16px; padding: 7px;" class="align-middle bg-danger"> ${rating} <i class="fas fa-star"></i> rating</span>
                    <span style="border-radius: 16px; padding: 7px;" class="align-middle bg-danger"> ${product.deliveries} orders</span>
                    </div>
                    <div class="card-body"> 
                        <p class="card-text text-center">${product.desction}</p><br>
                        <div class="text-center">
                        <h5 class="card-title">Price: &#8377 ${product.price}/- per kg</h5>
                        <h5 class="card-title ">
                        Availability: ${product.quantity} kg
                        </h5>
                        </div>
                    </div>
                    <div id="${product.quantity}" class="card-footer text-center">
                        <h5 class="card-title">Seller: ${farmer.name}</h5>
                        <div data-toggle="modal" data-target="#addToCart" class="btn btn-primary d-block cart" id="${product.id}">Add to cart</div>
                    </div>   
               </div>
            </div>
            `;
        });
    }
    getRequiredProduct();
});

output.addEventListener('click', e => {
    if (!e.target.className.includes('cart')) return;
    soi = e.target.id;
    spq = e.target.parentElement.id;
})

document.getElementById('cart_submit').addEventListener('click', async function (e) {

    if (!document.getElementById('_quantity').value) {
        displayError("form-control form-control-lg bg-warning", "Enter some quantity", pd, rq);
        return;
    }
    if (parseInt(document.getElementById('_quantity').value) > parseInt(spq)) {
        displayError("form-control form-control-lg bg-warning", "Please enter less than available quantity", pd, rq);
        return;
    }
    const product_details = {
        product_id: soi,
        quantity: document.getElementById('_quantity').value,
    }
    await fetch('http://localhost:3000/customer/addToCart', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        },
        body: JSON.stringify(product_details)
    });
    $('#addToCart').modal('hide');
    document.getElementById('_quantity').value = null;
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
    }, 2000)
}

document.getElementById('logout').addEventListener('click', function () {
    sessionStorage.removeItem('token');
    location.href = "../html/index.html";
});
