
const product_name = document.getElementById('product_name');
const quantity = document.getElementById('product_quantity');
const price = document.getElementById('product_price');
const desc = document.getElementById('product_desc');
const form = document.getElementById('form');
const addprobtn = document.getElementById('addprobtn');
const btncon = document.getElementById('btncon');

document.addEventListener('DOMContentLoaded', function (e) {
    // console.log('token',sessionStorage.getItem('token'));
    async function getProducts() {
        const res = await fetch('http://localhost:3000/farmer/getProducts/myproducts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': sessionStorage.getItem('token')
            }
        });
        const data = await res.json();
        let output = document.getElementById('display');
        let num = 0;
        data.forEach((product) => {
            let colour = 'success';
            if (num % 2 !== 0) {
                colour = 'dark';
            }
            let rating = 0.0;
            if (product.deliveries) rating = product.stars / product.feedbacks;
            output.innerHTML +=
                `
            <div class="col-lg-4 p-3">
                <div style="height: 475px;" class="card bg-${colour} text-white">
                    <div class="card-header text-center">
                    <span style="font-size: 30px" class="align-middle">${product.name} </span>
                    <span style="border-radius: 16px; padding: 7px;" class="align-middle bg-danger"> ${rating} <i class="fas fa-star"></i></span>
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
                    <div class="card-footer text-center">
                    ${product.deliveries} deliveries and
                    ${product.feedbacks} reviews
                    </div>   
               </div>
            </div>
            `;
            num++;
        });
    }
    getProducts();

});

document.getElementById('btncon').addEventListener('click', async (e) => {
    const checkres = await fetch('http://localhost:3000/farmer/get_profile', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        }
    });
    const farmer = await checkres.json();
    if (!farmer.phone) {
        displayError("form-control bg-warning", "Please complete your profile to add products", btncon, addprobtn);
        return;
    }
    $("#addProductModal").modal()
});


document.getElementById('addProduct').addEventListener('click', function () {

    const productObject = {
        name: product_name.value,
        quantity: quantity.value,
        unit: 'kg',
        price: price.value,
        desc: desc.value
    };
    async function sendProduct() {

        const res = await fetch('http://localhost:3000/farmer/addProduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': sessionStorage.getItem('token')
            },
            body: JSON.stringify(productObject)
        });
        const data = await res.json();
        console.log(data);
        if (data.message) {
            displayError("form-control bg-warning", data.message, form, product_div);
            return;
        }
        location.reload();
    }
    sendProduct();
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


