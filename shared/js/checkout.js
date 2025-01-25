// This is your test publishable API key.
const stripe = Stripe("pk_test_51PhLRGRvmUgcY5Xu7IHYPTSGpOiLvbkgIF2vt6IkIAZ8JOQUJAulFOfQE2HfaN2ml5vXF5Bp8V8bYuWJd8xp2cH100DQ9ijBq7");
/* -------------------------------------------------------------------------- */
const items = [
  { id: "xl-tshirt", amount: 45000 }
];

let elements;
let paymentElement$;
let isStripePaymentComplete = false;
document.querySelector("#payment-form").addEventListener("submit", handleSubmit);
/* -------------------------------------------------------------------------- */


//! initialize

(async function () {


  const response = await fetch("/public/create-payment-intent", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });


  const { clientSecret, dpmCheckerLink } = await response.json();

  const appearance = {
    theme: 'stripe',
    labels: 'floating', // You can set this to "none" or "floating"
    
    variables: {
      // colorTextSecondary: 'transparent',  // Make the text transparent
      spacingUnit: '1px',
      // colorPrimary: '#2f363d',
      // colorBackground: '#fefff7',
      // colorText: '#2f363d'

    }
  };


  elements = stripe.elements({ appearance, clientSecret });

  const paymentElementOptions = {
    // layout: "accordion",
    business:{name:'Heights Driving School Inc'},
    layout: {
      type:'tabs'
    }
  };

  const paymentElement = elements.create("payment", paymentElementOptions);
  
 

  
  paymentElement.mount("#payment-element");
  
  paymentElement.on('change',(v)=>{
    isStripePaymentComplete = v.complete
    ca_logic_val.validationFcn()
  })



  // [DEV] For demo purposes only
  setDpmCheckerLink(dpmCheckerLink);

  
  
  

})();

async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
        redirect: 'if_required' ,
        elements,
        confirmParams: {
            // No return_url needed since we're handling the result on the same page
        },
    });

    // Handle any errors from Stripe
    if (error) {
        if (error.type === "card_error" || error.type === "validation_error") {
            showMessage(error.message); // Show the error message
        } else {
            showMessage("An unexpected error occurred.");
        }
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Payment succeeded, show success message
        showMessage("Payment successful! Thank you for your purchase.");
    } else if (paymentIntent && paymentIntent.status === "requires_action") {
        // If additional authentication (e.g., 3D Secure) is required
        showMessage("Additional authentication required. Please complete the process.");
    } else {
        // Handle any other status that doesn't fall under success or action required
        showMessage("Payment could not be completed.");
    }

    setLoading(false); // Stop the loading indicator after payment attempt
}


// ------- UI helpers -------
function showMessage(messageText) {
  const messageContainer = document.querySelector("#payment-message");

  messageContainer.classList.remove("hidden");
  messageContainer.textContent = messageText;

  setTimeout(function () {
    messageContainer.classList.add("hidden");
    messageContainer.textContent = "";
  }, 4000);
}
// Show a spinner on payment submission
function setLoading(isLoading) {
  if (isLoading) {
    // Disable the button and show a spinner
    document.querySelector("#submit").disabled = true;
    document.querySelector("#spinner").classList.remove("hidden");
    document.querySelector("#button-text").classList.add("hidden");
  } else {
    document.querySelector("#submit").disabled = false;
    document.querySelector("#spinner").classList.add("hidden");
    document.querySelector("#button-text").classList.remove("hidden");
  }
}

function setDpmCheckerLink(url) {
  document.querySelector("#dpm-integration-checker").href = url;
}



