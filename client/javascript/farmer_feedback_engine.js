const output = document.getElementById('display');

document.addEventListener('DOMContentLoaded', async (e) => {
    const res = await fetch('https://agms.herokuapp.com/farmer/getraf', {
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
        const product = await response.json()
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
                        Buyer's name: ${order.buyer} <br><br>
                        <span style="font-size: 15px" class="align-middle">Rating Given : </span>
                        <span style="border-radius: 16px; padding: 7px;" class="align-middle bg-primary">  ${order.rating} <i class="fas fa-star"></i></span> <br><br>
                        Feedback: ${order.feedback}
                    </div>
               </div>
            </div>
            `
        num = num + 1;
    });
});

document.getElementById('logout').addEventListener('click', function () {
    sessionStorage.removeItem('token');
    location.href = "../html/index.html";
});