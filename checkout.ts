function handleSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const totalPrice = document.getElementById('total-price').innerText;
    const offerPrice = document.getElementById('offer').innerText;
    const grandTotal = document.getElementById('grand').innerText;

    const orderDetails = {
        name: name,
        email: email,
        phone: phone,
        address: address,
        totalPrice: totalPrice,
        offerPrice: offerPrice,
        grandTotal: grandTotal
    };

    localStorage.setItem('orderDetails', JSON.stringify(orderDetails));

}

document.addEventListener("DOMContentLoaded", () => {
    calculateTotalPrice();
    grandPrice();
    seasonalOffer();

    const form = document.querySelector('form');
    form.addEventListener('submit', handleSubmit);
});

function seasonalOffer() {
    const offerValue = document.getElementById('offer');
    const totalPrice = document.getElementById('total-price');

    if (totalPrice) {
        offerValue.innerHTML = ((parseInt(totalPrice.innerText.replace('$', '')) * 0.20).toFixed(2)).toString();
    } else {
        offerValue.innerHTML = 'N/A';
    }
}

function razorPay() {
    let options = {
        "key": "rzp_test_sXsEb6LoQEVd5E", // Enter the Key ID generated from the Dashboard
        "amount": (parseFloat(document.getElementById('grand').innerHTML) * 100).toFixed(2), // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        "currency": "INR",
        "name": "Acme Corp", //your business name
        "description": "Test Transaction",
        "image": "https://example.com/your_logo",
        "order_id": "", //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        "handler": function (response){
            window.location.href = "success.html";

        },
        "prefill": { //We recommend using the prefill parameter to auto-fill customer's contact information, especially their phone number
            "name": "Gaurav Kumar", //your customer's name
            "email": "gaurav.kumar@example.com", 
            "contact": "9000090000"  //Provide the customer's phone number for better conversion rates 
        },
        "notes": {
            "address": "Razorpay Corporate Office"
        },
        "theme": {
            "color": "#3399cc"
        }
    };


    let rzp1 = new Razorpay(options);
    rzp1.on('payment.failed', function (response){
            alert(response.error.code);
            alert(response.error.description);
            alert(response.error.source);
            alert(response.error.step);
            alert(response.error.reason);
            alert(response.error.metadata.order_id);
            alert(response.error.metadata.payment_id);
    });
    document.getElementById('rzp-button1').onclick = function(e){
        rzp1.open();
        e.preventDefault();
    }
}

function grandPrice() {
    const deliveryPriceFetch = document.getElementById('delivery');
    const offerPriceFetch = document.getElementById('offer');

    let totalPrice = document.getElementById('total-price');
    let grandPrice: HTMLElement | null = document.getElementById('grand')
    let deliveryPrice = 0;
    let offerPrice = 0;
    if (deliveryPriceFetch) {
        deliveryPrice += parseFloat(deliveryPriceFetch.innerText)
    }

    if (offerPriceFetch) {
        offerPrice += parseFloat(offerPriceFetch.innerText)
    }

    if (grandPrice && totalPrice)
        grandPrice.innerHTML = ((parseFloat(totalPrice.innerText.replace('$', '')) - offerPrice + deliveryPrice).toFixed(2)).toString()
}