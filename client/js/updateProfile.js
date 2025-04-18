document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('edit-profile-form');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        if (!token) {
            alert('You must be logged in to update your profile.');
            return;
        }

        // Grab values & trim
        const name = document.getElementById('edit-name').value.trim();
        const email = document.getElementById('edit-email').value.trim();
        const password = document.getElementById('edit-password').value;      // do NOT trim pwd
        const profileFile = document.getElementById('edit-profile-image').files[0];

        // Build FormData only with provided fields
        const formData = new FormData();
        if (name) formData.append('name', name);
        if (email) formData.append('email', email);
        if (password) formData.append('password', password);
        if (profileFile) formData.append('profileImage', profileFile);

        // If the user didn’t change anything, you might skip the request:
        if ([...formData.keys()].length === 0) {
            alert('Nothing to update.');
            return;
        }

        try {
            const res = await fetch('http://localhost:3000/api/users/profile', {
                method: 'PUT',
                headers: {Authorization: `Bearer ${token}`},
                body: formData
            });

            const data = await res.json();

            if (res.ok) {
                alert('Profile updated successfully!');
                window.location.reload();
            } else {
                // Handle express‑validator error array or single message
                if (data.errors && Array.isArray(data.errors)) {
                    const messages = data.errors.map(err => err.msg).join('\n');
                    alert(messages);
                } else {
                    alert(data.message || 'Failed to update profile.');
                }
            }
        } catch (err) {
            console.error('Update error:', err);
            alert('An unexpected error occurred while updating your profile.');
        }
    });
});