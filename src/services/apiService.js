// ============================================================
// API SERVICE - Helper untuk berkomunikasi dengan Backend PHP
// ============================================================

// Toggle untuk mengaktifkan koneksi database MySQL lewat API PHP
// Dapat diubah lewat console: localStorage.setItem('pos_use_database', 'true')
export const USE_DATABASE = localStorage.getItem('pos_use_database') === 'true';

// Base URL ke folder api PHP di XAMPP htdocs
// Sesuaikan dengan letak folder proyek Anda di htdocs
export const API_BASE_URL = "http://localhost/point_of_sale/api";

export async function apiRequest(endpoint, method = 'GET', body = null) {
  if (!USE_DATABASE) {
    return null;
  }

  const url = `${API_BASE_URL}/${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || `HTTP Error: ${response.status}`);
    }
    return result;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

// Fungsi pembantu untuk mengaktifkan/menonaktifkan koneksi database secara instan
export function toggleDatabaseMode(enable) {
  localStorage.setItem('pos_use_database', enable ? 'true' : 'false');
  window.location.reload();
}
