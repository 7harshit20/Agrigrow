// Selecting the input fields and buttons
const product_name = document.getElementById('product_name');
const quantity = document.getElementById('product_quantity');
const price = document.getElementById('product_price');
const desc = document.getElementById('product_desc');
const form = document.getElementById('form');
const addprobtn = document.getElementById('addprobtn');
const btncon = document.getElementById('btncon');

// Load products
document.addEventListener('DOMContentLoaded', function (e) {

    async function getProducts() {
        // Fetching products from backend
        const res = await fetch('https://agms.herokuapp.com/farmer/getProducts/myproducts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': sessionStorage.getItem('token')
            }
        });
        const data = await res.json();

        // Displaying the fetched products
        let output = document.getElementById('display');
        let num = 0;
        data.forEach((product) => {
            let colour = 'success';
            if (num % 2 !== 0) {
                colour = 'dark';
            }
            let rating = 0.0;
            if (product.deliveries) rating = product.stars / product.feedbacks;

            // Setting up HTML
            output.innerHTML +=
                `
            <div class="col-lg-4 p-3">
                <div class="card bg-${colour} text-white">
                    <div class="card-header text-center">
                    <span style="font-size: 30px" class="align-middle">${product.name} </span>
                    <span style="border-radius: 16px; padding: 7px;" class="align-middle bg-danger"> ${rating} <i class="fas fa-star"></i></span>
                    </div>
                    <div class="card-body"> 
                        <p class="card-text text-center">${product.desction}</p><br>
                        <div class="text-center">
                        <h5 class="card-title">Price: ${product.price}<i class="fab fa-ethereum"></i></h5>
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

// Updating profile
document.getElementById('btncon').addEventListener('click', async (e) => {

    // Fetching seller's profile from backend
    const checkres = await fetch('https://agms.herokuapp.com/farmer/get_profile', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        }
    });
    const farmer = await checkres.json();

    // Gives warning if profile is not set
    if (!farmer.phone) {
        displayError("form-control bg-warning", "Please complete your profile to add products", btncon, addprobtn);
        return;
    }

    // Pops up product modal if profile is set 
    $("#addProductModal").modal()
});


// Adding new product
document.getElementById('addProduct').addEventListener('click', function () {

    // Creating object to be sent to bakcend
    const productObject = {
        name: product_name.value,
        quantity: quantity.value,
        unit: 'kg',
        price: price.value,
        desc: desc.value
    };

    // Sending add product request to backend 
    async function sendProduct() {
        const res = await fetch('https://agms.herokuapp.com/farmer/addProduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': sessionStorage.getItem('token')
            },
            body: JSON.stringify(productObject)
        });
        const data = await res.json();

        // Displays warning in case of any error
        if (data.message) {
            displayError("form-control bg-warning", data.message, form, product_div);
            return;
        }

        // Closes the modal
        $('#addProductModal').modal('hide');

        // Reloads the page to display newly added product
        location.reload();
    }
    sendProduct();
});


// Function to display error
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

// Logs out user
document.getElementById('logout').addEventListener('click', function () {
    sessionStorage.removeItem('token');
    location.href = "../html/index.html";
});


