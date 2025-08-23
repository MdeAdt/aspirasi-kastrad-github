console.log("File main.js versi baru sudah termuat!");

const API_URL = '/api';
const navLinks = document.getElementById('nav-links');
const profileKastrad = document.getElementById('profile-kastrad');
const userDashboard = document.getElementById('user-dashboard');
const aspirationsHistoryContainer = document.getElementById('aspirations-history-container');

// ... setelah baris 'const aspirationsHistoryContainer = ...'

// Logika untuk Dropdown Dinamis
const angkatanSelect = document.getElementById('angkatan_pengirim');
const kelasSelect = document.getElementById('kelas_pengirim');

const kelasData = {
    '2023': ['A'],
    '2024': ['A', 'B', 'C', 'D'],
    '2025': ['A', 'B', 'C', 'D', 'E']
};

angkatanSelect.addEventListener('change', () => {
    const selectedAngkatan = angkatanSelect.value;
    // Kosongkan dan nonaktifkan dropdown kelas
    kelasSelect.innerHTML = '<option value="">-- Pilih Kelas --</option>';
    kelasSelect.disabled = true;

    if (selectedAngkatan && kelasData[selectedAngkatan]) {
        // Aktifkan dropdown kelas
        kelasSelect.disabled = false;
        // Isi dengan data kelas yang sesuai
        kelasData[selectedAngkatan].forEach(kelas => {
            const option = document.createElement('option');
            option.value = kelas;
            option.textContent = kelas;
            kelasSelect.appendChild(option);
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    checkLoginStatus();
});

function checkLoginStatus() {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user) {
        // Pengguna sudah login
        navLinks.innerHTML = `
            ${user.role === 'admin' ? '<a href="admin.html">Dasbor Admin</a>' : ''}
            <button id="logout-btn">Logout</button>`;
        document.getElementById('logout-btn').addEventListener('click', logout);

        profileKastrad.classList.add('hidden');
        userDashboard.classList.remove('hidden');

        // Pindahkan event listener ke sini!
        // Ini memastikan form sudah pasti ada sebelum event dipasang.
        const aspirationForm = document.getElementById('aspiration-form');
        console.log("Mencari form aspirasi:", aspirationForm); // DEBUG: Apakah form ditemukan?

        if (aspirationForm) {
            aspirationForm.addEventListener('submit', handleAspirationSubmit);
            console.log("Event listener untuk submit berhasil dipasang."); // DEBUG
        } else {
            console.error("Error: Form dengan ID 'aspiration-form' tidak ditemukan!"); // DEBUG
        }

        fetchUserHistory();
    } else {
        // Pengguna belum login
        navLinks.innerHTML = '<a href="login.html">Login / Register</a>';
        profileKastrad.classList.remove('hidden');
        userDashboard.classList.add('hidden');
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'index.html';
}

// GANTI FUNGSI INI DENGAN VERSI BARU
async function fetchUserHistory() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/aspirations/my-history`, {
            headers: { 'x-auth-token': token }
        });
        const aspirations = await response.json();
        
        aspirationsHistoryContainer.innerHTML = '';
        if (aspirations.length === 0) {
            aspirationsHistoryContainer.innerHTML = "<p>Anda belum pernah mengirim aspirasi.</p>";
        } else {
            aspirations.forEach(asp => {
                const card = document.createElement('div');
                card.className = 'card';

                // Logika baru untuk menampilkan alasan jika status 'Ditolak'
                const alasanDitolakHTML = asp.status === 'Ditolak' && asp.alasan_penolakan
                    ? `<p class="alasan-ditolak"><strong>Alasan Penolakan:</strong> ${asp.alasan_penolakan}</p>`
                    : '';

                // PERUBAHAN DI SINI: Hapus 'Kategori' dan tambahkan 'alasanDitolakHTML'
                card.innerHTML = `
                    <h3>${asp.title}</h3>
                    <p>${asp.content}</p>
                    ${alasanDitolakHTML} 
                    <div class="card-footer">
                        <span></span> <span class="status">Status: ${asp.status}</span>
                    </div>`;
                aspirationsHistoryContainer.appendChild(card);
            });
        }
    } catch (error) {
        aspirationsHistoryContainer.innerHTML = '<p>Gagal memuat riwayat aspirasi.</p>';
    }
}

async function handleAspirationSubmit(e) {
    e.preventDefault();
    console.log("Tombol Kirim Aspirasi diklik, fungsi handleAspirationSubmit berjalan!");

    // Ambil semua nilai dari form, termasuk yang baru
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;
    const nama_pengirim = document.getElementById('nama_pengirim').value;
    const npm_pengirim = document.getElementById('npm_pengirim').value;
    const angkatan_pengirim = document.getElementById('angkatan_pengirim').value;
    const kelas_pengirim = document.getElementById('kelas_pengirim').value;
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API_URL}/aspirations`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            // Kirim semua data di body
            body: JSON.stringify({
                title,
                content,
                nama_pengirim,
                npm_pengirim,
                angkatan_pengirim,
                kelas_pengirim
            })
        });
        if (response.ok) {
            alert('Aspirasi berhasil dikirim!');
            document.getElementById('aspiration-form').reset();
            // Reset dropdown kelas
            kelasSelect.innerHTML = '<option value="">-- Pilih Angkatan Dulu --</option>';
            kelasSelect.disabled = true;
            fetchUserHistory();
        } else {
            const data = await response.json();
            alert(`Gagal mengirim: ${data.message}`);
        }
    } catch (error) {
        alert('Terjadi kesalahan pada server.');
    }
}