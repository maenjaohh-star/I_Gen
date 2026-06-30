// server.js
// Server Express sederhana untuk menyajikan folder public (frontend)
require('dotenv').config();

const express = require('express');
const path = require('path');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk membaca body JSON
app.use(express.json());

// Sajikan semua file statis dari folder public
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint generate gambar menggunakan Gemini Image
app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body || {};

  // Validasi prompt tidak boleh kosong
  if (!prompt || !prompt.trim()) {
    return res.status(400).json({
      success: false,
      message: 'Prompt tidak boleh kosong.'
    });
  }

  // Validasi API Key tersedia di .env
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      success: false,
      message: 'GEMINI_API_KEY belum dikonfigurasi di server.'
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Minta Gemini menghasilkan satu gambar berdasarkan prompt
    const interaction = await ai.interactions.create({
      model: 'gemini-2.5-flash-image',
      input: prompt
    });

    const generatedImage = interaction.output_image;

    if (!generatedImage || !generatedImage.data) {
      return res.status(502).json({
        success: false,
        message: 'Gemini tidak mengembalikan gambar.'
      });
    }

    const mimeType = generatedImage.mime_type || 'image/png';

    res.json({
      success: true,
      message: 'Gambar berhasil dibuat.',
      image: `data:${mimeType};base64,${generatedImage.data}`
    });
  } catch (error) {
    // Error dari Gemini (API key salah, kuota habis, dll.)
    console.error('Gemini error:', error.message);
    res.status(502).json({
      success: false,
      message: 'Terjadi kesalahan saat menghubungi Gemini.'
    });
  }
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});

