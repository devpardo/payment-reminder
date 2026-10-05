const API_URL =
  "https://script.google.com/macros/s/AKfycbxPFfW48EAJ8cfJBD5dt1-58FO3mwSctJccvYPRPNlNPfKTTDNokFFKpmTm7qouB45Irg/exec";

const paymentList = document.getElementById("paymentList");
const totalAmount = document.getElementById("totalAmount");
const paymentCount = document.getElementById("paymentCount");
const currentDate = document.getElementById("currentDate");
const refreshButton = document.getElementById("refreshButton");

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
  }).format(amount);
}

function renderPayments(data) {
  totalAmount.textContent = formatCurrency(data.total);

  paymentCount.textContent =
    `${data.payments.length} payment${
      data.payments.length !== 1 ? "s" : ""
    }`;

  if (data.payments.length === 0) {
    paymentList.innerHTML = `
      <div class="empty">
        No upcoming payments.
      </div>
    `;

    return;
  }

  paymentList.innerHTML = data.payments
    .map(
      (payment) => `
        <article class="payment-card">
          <div>
            <div class="payment-source">
              ${payment.source}
            </div>

            <div
              class="payment-paid ${
                payment.paid === "Yes"
                  ? "paid"
                  : "unpaid"
              }"
            >
              ${
                payment.paid === "Yes"
                  ? "Paid"
                  : "Not Paid"
              }
            </div>
          </div>

          <div class="payment-amount">
            ${formatCurrency(payment.amount)}
          </div>
        </article>
      `
    )
    .join("");
}

async function loadPayments() {
  paymentList.innerHTML = `
    <div class="loading">
      Loading payments...
    </div>
  `;

  refreshButton.disabled = true;

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(
        `HTTP error: ${response.status}`
      );
    }

    const data = await response.json();

    console.log("Google Sheets response:", data);

    if (!data.success) {
      throw new Error(
        data.error ||
          "Unable to load payments."
      );
    }

    renderPayments(data);

  } catch (error) {
    console.error(
      "Failed to load payments:",
      error
    );

    paymentList.innerHTML = `
      <div class="error">
        <strong>
          Unable to load payments.
        </strong>

        <br />

        <small>
          ${error.message}
        </small>
      </div>
    `;

  } finally {
    refreshButton.disabled = false;
  }
}

function renderCurrentDate() {
  currentDate.textContent =
    new Intl.DateTimeFormat("en-PH", {
      dateStyle: "full",
    }).format(new Date());
}

refreshButton.addEventListener(
  "click",
  loadPayments
);

renderCurrentDate();
loadPayments();
