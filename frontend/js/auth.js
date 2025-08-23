const API_URL = '/api/auth';
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');

showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('login-form-container').classList.add('hidden');
    document.getElementById('register-form-container').classList.remove('hidden');
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('register-form-container').classList.add('hidden');
    document.getElementById('login-form-container').classList.remove('hidden');
});

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            // --- PERUBAHAN UTAMA DI SINI ---
            // Jika role adalah 'admin', alihkan ke dasbor admin.
            if (data.user.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
            // Jika bukan, alihkan ke halaman utama.
                window.location.href = 'index.html';
            }
            // --------------------------------

        } else {
            alert(`Login gagal: ${data.message}`);
        }
    } catch (error) {
        alert('Terjadi kesalahan pada server.');
    }
});

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password
            })
        });
        const data = await response.json();
        if (response.ok) {
            alert(data.message + " Silakan login.");
            showLoginLink.click();
            registerForm.reset();
        } else {
            alert(`Registrasi gagal: ${data.message}`);
        }
    } catch (error) {
        alert('Terjadi kesalahan pada server.');
    }
});