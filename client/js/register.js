document.getElementById('register-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    // ▶︎ 1) Light client-side file check
    const profileInput = document.getElementById('profileImage');
    const file = profileInput.files[0];
    const allowed = [
        'image/jpeg',
        'image/png',
        'image/jpg',
        'image/gif',
        'image/webp',
        'image/avif'
    ];

    if (file && !allowed.includes(file.type)) {
        // Immediately show the unified error and bail out
        showErrors({
            errors: [
                {
                    msg: 'Invalid file type. Only images are allowed!',
                    param: 'profileImage'
                }
            ]
        });
        return;
    }

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
            showErrors(data);
        }
    } catch (err) {
        alert('An error occurred while registering.');
        console.error(err);
    }
});
