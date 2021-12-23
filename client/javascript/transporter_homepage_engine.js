const output = document.getElementById('display');
const con = document.getElementById('con');

// Loads the order open for transportation
document.addEventListener('DOMContentLoaded', async (e) => {

    // Request to fetch orders
    const res = await fetch('https://agms.herokuapp.com/transporter/acceptedProducts', {
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
                        Quantity : ${order.quantity} kg <br><br>
                        Seller's name : ${farmer.name} <br><br>
                        Seller's phone : ${farmer.phone} <br><br>
                        Seller's address : <br> ${farmer.address} <br><br>
                    </div>
                    <div class="card-footer text-center" id="shipOrd">
                        <button id="${order.id}" class="btn btn-primary w-100 d-block">Ship Order</button>
                    </div>
               </div>
            </div>
            `
    });
});

// Changes order state to shipped
output.addEventListener('click', async (e) => {
    if (e.target.parentElement.id !== 'shipOrd') return;

    // Checks if profile is set up 
    const checkres = await fetch('https://agms.herokuapp.com/transporter/get_profile', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        }
    });
    const transporter = await checkres.json();

    // Gives warning if profile is not set up 
    if (!transporter.phone) {
        displayError("form-control form-control-lg bg-warning", "Please complete your profile to ship orders", con, display);
        $('html, body').animate({ scrollTop: 0 }, 'fast');
        return;
    }

    // Request to change order state 
    await fetch(`https://agms.herokuapp.com/transporter/acceptedProducts/${e.target.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-auth-token': sessionStorage.getItem('token')
        },
    });

    // Reload the window to display changes
    location.reload();
});


// Displays error
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


// logs out the user
document.getElementById('logout').addEventListener('click', function () {
    sessionStorage.removeItem('token');
    location.href = "../html/index.html";
});
