const API_URL = '/api/aspirations';
const tableBody = document.getElementById('admin-aspirations-table');

document.addEventListener('DOMContentLoaded', () => {
    // Cek status login
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
        alert('Akses ditolak! Anda bukan admin.');
        window.location.href = 'index.html';
        return;
    }
    // Ambil data aspirasi
    fetchAdminAspirations();

    // Pasang event listener untuk tombol logout di sini
    const logoutButton = document.getElementById('logout-btn');
    if (logoutButton) {
        logoutButton.addEventListener('click', logout);
    }
});

async function fetchAdminAspirations() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/admin`, { headers: { 'x-auth-token': token } });
        if (!response.ok) throw new Error('Gagal mengambil data.');
        
        const aspirations = await response.json();
        tableBody.innerHTML = '';

        aspirations.forEach(asp => {
            const row = document.createElement('tr');
            const alasanDitolakHTML = asp.status === 'Ditolak' && asp.alasan_penolakan 
                ? `<p class="alasan-ditolak"><strong>Alasan:</strong> ${asp.alasan_penolakan}</p>` 
                : '';

            row.innerHTML = `
                <td>
                    <strong>${asp.title}</strong><br>
                    <small>${asp.content}</small>
                    ${alasanDitolakHTML}
                </td>
                <td>
                    <strong>${asp.nama_pengirim}</strong> (${asp.npm_pengirim})<br>
                    <small>Angkatan ${asp.angkatan_pengirim} - Kelas ${asp.kelas_pengirim}</small><br>
                    <small><em>Akun: ${asp.author ? asp.author.email : 'N/A'}</em></small>
                </td>
                <td>
                    <select class="status-select" data-id="${asp._id}">
                        <option value="Diproses" ${asp.status === 'Diproses' ? 'selected' : ''}>Diproses</option>
                        <option value="Diterima" ${asp.status === 'Diterima' ? 'selected' : ''}>Diterima</option>
                        <option value="Ditolak" ${asp.status === 'Ditolak' ? 'selected' : ''}>Tolak</option>
                        <option value="Selesai" ${asp.status === 'Selesai' ? 'selected' : ''}>Selesai</option>
                    </select>
                </td>
                <td class="action-buttons">
                    <button class="update-btn" data-id="${asp._id}">Update</button>
                    <button class="delete-btn" data-id="${asp._id}">Hapus</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        document.querySelectorAll('.update-btn').forEach(button => button.addEventListener('click', handleUpdateStatus));
        document.querySelectorAll('.delete-btn').forEach(button => button.addEventListener('click', handleDeleteAspiration));
    } catch (error) {
        console.error('Error:', error);
        tableBody.innerHTML = '<tr><td colspan="4">Gagal memuat data.</td></tr>';
    }
}

async function handleUpdateStatus(e) {
    const id = e.target.dataset.id;
    const newStatus = document.querySelector(`.status-select[data-id="${id}"]`).value;
    const token = localStorage.getItem('token');
    let alasanPenolakan = null;

    if (newStatus === 'Ditolak') {
        alasanPenolakan = prompt("Masukkan alasan penolakan aspirasi ini:");
        if (alasanPenolakan === null) {
            fetchAdminAspirations();
            return;
        }
    }

    try {
        const response = await fetch(`${API_URL}/admin/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
            body: JSON.stringify({ status: newStatus, alasan_penolakan: alasanPenolakan })
        });
        if (response.ok) {
            alert('Status berhasil diperbarui!');
            fetchAdminAspirations();
        } else {
            alert('Gagal memperbarui status.');
        }
    } catch (error) {
        console.error('Error updating status:', error);
    }
}

async function handleDeleteAspiration(e) {
    const id = e.target.dataset.id;
    const token = localStorage.getItem('token');
    if (confirm('Anda yakin ingin menghapus aspirasi ini secara permanen?')) {
        try {
            const response = await fetch(`${API_URL}/admin/${id}`, {
                method: 'DELETE',
                headers: { 'x-auth-token': token }
            });
            if (response.ok) {
                alert('Aspirasi berhasil dihapus!');
                fetchAdminAspirations();
            } else {
                alert(`Gagal menghapus: ${(await response.json()).message}`);
            }
        } catch (error) {
            console.error('Error deleting aspiration:', error);
        }
    }
}

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = 'login.html';
}