const API_URL = '/api';
const tableBody = document.getElementById('admin-aspirations-table');

document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'admin') {
        alert('Akses ditolak! Anda bukan admin.');
        window.location.href = 'index.html';
        return;
    }
    fetchAdminAspirations();
});

async function fetchAdminAspirations() {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`${API_URL}/admin`, {
            headers: {
                'x-auth-token': token
            }
        });
        if (!response.ok) throw new Error('Gagal mengambil data.');

        const aspirations = await response.json();
        tableBody.innerHTML = '';

        // GANTI BAGIAN INI DI DALAM fetchAdminAspirations
        aspirations.forEach(asp => {
            const row = document.createElement('tr');

            // BARU: Logika untuk menampilkan alasan penolakan jika ada
            const alasanDitolakHTML = asp.status === 'Ditolak' && asp.alasan_penolakan ?
                `<p class="alasan-ditolak"><strong>Alasan:</strong> ${asp.alasan_penolakan}</p>` :
                '';

            // Perbarui innerHTML untuk menyisipkan alasanDitolakHTML
            row.innerHTML = `
        <td>
            <strong>${asp.title}</strong><br>
            <small>${asp.content}</small>
            ${alasanDitolakHTML}
        </td>
        <td>
            <strong>${asp.nama_pengirim}</strong> (${asp.npm_pengirim})<br>
            <small>Angkatan ${asp.angkatan_pengirim} - Kelas ${asp.kelas_pengirim}</small><br>
            <small><em>Akun: ${asp.author.email}</em></small>
        </td>
        <td>
            <select class="status-select" data-id="${asp.id}">
                <option value="Diproses" ${asp.status === 'Diproses' ? 'selected' : ''}>Diproses</option>
                <option value="Diterima" ${asp.status === 'Diterima' ? 'selected' : ''}>Diterima</option>
                <option value="Ditolak" ${asp.status === 'Ditolak' ? 'selected' : ''}>Tolak</option>
                <option value="Selesai" ${asp.status === 'Selesai' ? 'selected' : ''}>Selesai</option>
            </select>
        </td>
        <td class="action-buttons">
            <button class="update-btn" data-id="${asp.id}">Update</button>
            <button class="delete-btn" data-id="${asp.id}">Hapus</button>
        </td>
    `;
            tableBody.appendChild(row);
        });

        document.querySelectorAll('.update-btn').forEach(button => {
            button.addEventListener('click', handleUpdateStatus);
        });
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', handleDeleteAspiration);
        });
    } catch (error) {
        console.error('Error:', error);
        tableBody.innerHTML = '<tr><td colspan="4">Gagal memuat data.</td></tr>';
    }
}

async function handleUpdateStatus(e) {
    const id = e.target.dataset.id;
    const statusSelect = document.querySelector(`.status-select[data-id="${id}"]`);
    const newStatus = statusSelect.value;
    const token = localStorage.getItem('token');
    let alasanPenolakan = null;

    // Jika statusnya 'Ditolak', minta alasan dari admin
    if (newStatus === 'Ditolak') {
        alasanPenolakan = prompt("Masukkan alasan penolakan aspirasi ini:");
        // Jika admin membatalkan prompt, jangan lanjutkan
        if (alasanPenolakan === null) {
            // Kembalikan pilihan dropdown ke status semula
            fetchAdminAspirations(); // Cara mudah untuk reset
            return;
        }
    }

    try {
        const response = await fetch(`${API_URL}/admin/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({
                status: newStatus,
                alasan_penolakan: alasanPenolakan
            })
        });
        if (response.ok) {
            alert('Status berhasil diperbarui!');
            fetchAdminAspirations(); // Muat ulang data untuk menampilkan perubahan
        } else {
            alert('Gagal memperbarui status.');
        }
    } catch (error) {
        console.error('Error updating status:', error);
    }
}

async function handleDeleteAspiration(e) {
    // ... (fungsi ini tidak berubah)
    const id = e.target.dataset.id;
    const token = localStorage.getItem('token');
    if (confirm('Anda yakin ingin menghapus aspirasi ini secara permanen?')) {
        try {
            const response = await fetch(`${API_URL}/admin/${id}`, {
                method: 'DELETE',
                headers: {
                    'x-auth-token': token
                }
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