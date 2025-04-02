document.getElementById('register-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    try {
        const response = await fetch('http://localhost:3000/api/users/register', {
            method: 'POST',
            body: formData
            // Don't set Content-Type — the browser handles it for FormData
        });

        const data = await response.json();

        if (response.ok) {
            alert('Registration successful!');
            window.location.href = 'login.html';
        } else {
            alert(`Error: ${data.message || 'Something went wrong'}`);
        }
    } catch (err) {
        alert('An error occurred while registering.');
        console.error(err);
    }
});
