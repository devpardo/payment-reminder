const API_URL =
  "https://script.google.com/macros/s/AKfycbxPFfW48EAJ8cfJBD5dt1-58FO3mwSctJccvYPRPNlNPfKTTDNokFFKpmTm7qouB45Irg/exec";

const paymentList = document.getElementById("paymentList");

function loadPayments() {
  const callbackName = `callback_${Date.now()}`;

  window[callbackName] = function (data) {
    console.log("Google Apps Script response:", data);

    paymentList.innerHTML = `
      <pre>${JSON.stringify(data, null, 2)}</pre>
    `;

    delete window[callbackName];
  };

  const script = document.createElement("script");

  script.src = `${API_URL}?callback=${callbackName}`;

  script.onload = () => {
    console.log("Apps Script script loaded");
  };

  script.onerror = (error) => {
    console.error("Apps Script request failed:", error);

    paymentList.innerHTML = `
      <div class="error">
        Google Apps Script request failed.
      </div>
    `;
  };

  document.body.appendChild(script);
}

loadPayments();
