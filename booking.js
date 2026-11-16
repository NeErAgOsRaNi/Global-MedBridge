(() => {
  const form = document.getElementById('bookingForm');
  if (!form) return;

  const message = document.getElementById('success');
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.innerHTML;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;

    const firstName = document.getElementById('name').value.trim().split(/\s+/)[0];
    const payload = {
      full_name: document.getElementById('name').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      location: document.getElementById('location').value.trim(),
      health_concern: document.getElementById('disease').value.trim()
    };

    message.style.display = 'block';
    message.style.background = '#eef6ff';
    message.style.color = '#174a7e';
    message.textContent = 'Submitting your enquiry securely…';
    submitButton.disabled = true;
    submitButton.textContent = 'Submitting…';

    try {
      const config = window.GLOBAL_MEDBRIDGE_SUPABASE;
      if (!config?.url || !config?.publishableKey) {
        throw new Error('Supabase configuration is missing. Check config.js.');
      }

      const response = await fetch(`${config.url}/functions/v1/submit-enquiry`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': config.publishableKey,
          'Authorization': `Bearer ${config.publishableKey}`
        },
        body: JSON.stringify(payload)
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error || 'We could not submit your enquiry. Please try again.');

      message.style.background = '#e9f8e8';
      message.style.color = '#286e36';
      message.textContent = `Thank you, ${firstName}. Your enquiry has been submitted successfully. Our team can follow up with you.`;
      form.reset();
    } catch (error) {
      message.style.background = '#fff0ef';
      message.style.color = '#9b2c25';
      message.textContent = error.message || 'Something went wrong. Please try again later.';
    } finally {
      submitButton.disabled = false;
      submitButton.innerHTML = originalButtonText;
    }
  });
})();
