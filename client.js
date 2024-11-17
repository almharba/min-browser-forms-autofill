// ==UserScript==
// @name        Autofill with Server Data
// @match       *://*/*
// @run-at      document-end
// ==/UserScript==

//////
// Helper function to extract the domain from a URL
function getDomainFromURL(url) {
    const { hostname } = new URL(url);
    return hostname; // Returns just the domain (e.g., 'example.com')
}

// Function to handle form submission
function handleFormSubmission(event) {
    event.preventDefault(); // Prevent the form from submitting normally

    const form = event.target; // The form that was submitted
    const domain = getDomainFromURL(window.location.href); // Extract the domain
    const formData = {};

    // Collect all form fields
    new FormData(form).forEach((value, key) => {
        formData[key] = value;
    });

    console.log("Form data collected for domain:", domain, formData); // Debug log

    // Send the data to your server
    sendDataToServer(formData, domain);
}

// Function to send data to the server
function sendDataToServer(formData, domain) {
    fetch('http://localhost:3000/store-data', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ formData, domain }),
    })
    .then(response => {
        if (!response.ok) {
            console.error('Failed to send data', response);
        } else {
            return response.json();
        }
    })
    .then(data => {
        console.log('Data sent to server:', data);
    })
    .catch(error => {
        console.error('Error sending data:', error);
    });
}

// Attach event listeners to all forms on the page
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', handleFormSubmission);
});

console.log("Form data collection script with domain loaded!");


// Fetch stored data for the current domain
function fetchStoredData(domain) {
    return fetch(`http://localhost:3000/fetch-data/${domain}`)
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success' && data.data.length > 0) {
                console.log(`Fetched data for domain: ${domain}`, data.data);
                return data.data;
            }
            console.log(`No stored data for domain: ${domain}`);
            return null;
        })
        .catch(error => {
            console.error(`Error fetching data for domain: ${domain}`, error);
            return null;
        });
}

// Autofill forms with fetched data
function autofillForms(storedData) {
    document.querySelectorAll('form').forEach(form => {
        storedData.forEach(formData => {
            Object.keys(formData).forEach(fieldName => {
                const input = form.querySelector(`[name="${fieldName}"]`);
                if (input) {
                    input.value = formData[fieldName];
                }
            });
        });
    });
    console.log('Forms autofilled with stored data.');
}

// Main script logic
(async () => {
    const currentDomain = getDomainFromURL(window.location.href);
    const storedData = await fetchStoredData(currentDomain);

    if (storedData) {
        autofillForms(storedData);
    } else {
        console.log(`No data to autofill for domain: ${currentDomain}`);
    }
})();
