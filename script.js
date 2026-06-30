// script.js - Logika frontend Generator Gambar 2D
// Tahap 4: Sistem pemilihan model AI (LocalStorage + indikator + Nano Banana Coming Soon)

const generateBtn = document.getElementById('generate-btn');
const downloadBtn = document.getElementById('download-btn');
const promptInput = document.getElementById('prompt-input');
const modelSelect = document.getElementById('model-select');
const previewArea = document.getElementById('preview-area');
const modelIndicatorName = document.getElementById('model-indicator-name');

const MODEL_STORAGE_KEY = 'selectedModel';

// Nama tampilan untuk tiap value model
const MODEL_LABELS = {
  'auto': 'Auto',
  'gemini-image': 'Gemini Image',
  'nano-banana': 'Nano Banana'
};

// Perbarui indikator model aktif & status tombol Generate sesuai model yang dipilih
function updateModelUI() {
  const selected = modelSelect.value;
  const label = MODEL_LABELS[selected] || selected;

  // Tampilkan nama model, tambahkan badge "Coming Soon" jika Nano Banana dipilih
  if (selected === 'nano-banana') {
    modelIndicatorName.innerHTML = `${label} <span class="badge-coming-soon">Coming Soon</span>`;
    generateBtn.disabled = true;
  } else {
    modelIndicatorName.textContent = label;
    generateBtn.disabled = false;
  }
}

// Saat user mengganti model: simpan ke LocalStorage & perbarui UI
modelSelect.addEventListener('change', () => {
  localStorage.setItem(MODEL_STORAGE_KEY, modelSelect.value);
  updateModelUI();
});

// Saat aplikasi dibuka: muat model terakhir dari LocalStorage (jika ada)
(function initModelSelection() {
  const savedModel = localStorage.getItem(MODEL_STORAGE_KEY);
  if (savedModel && MODEL_LABELS[savedModel]) {
    modelSelect.value = savedModel;
  }
  updateModelUI();
})();

// Tampilkan teks di area preview (menggantikan isi sebelumnya)
function showPreviewMessage(text) {
  previewArea.innerHTML = `<p class="preview-placeholder">${text}</p>`;
}

// Tampilkan gambar hasil generate di area preview
function showPreviewImage(imageSrc) {
  previewArea.innerHTML = '';
  const img = document.createElement('img');
  img.src = imageSrc;
  img.alt = 'Hasil gambar';
  img.style.maxWidth = '100%';
  img.style.borderRadius = '12px';
  previewArea.appendChild(img);
}

generateBtn.addEventListener('click', async () => {
  const prompt = promptInput.value.trim();

  showPreviewMessage('Sedang membuat gambar...');

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      showPreviewMessage(data.message || 'Terjadi kesalahan.');
      return;
    }

    showPreviewImage(data.image);
  } catch (error) {
    showPreviewMessage('Gagal terhubung ke server. Pastikan server berjalan.');
  }
});



