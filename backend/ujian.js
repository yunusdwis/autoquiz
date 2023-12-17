const express = require('express');
const koneksi = require('../config/database');
const bodyParser = require('body-parser');

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));


router.post('/', (req, res) => {
    console.log('datanya', req.body);
    
    const { nama, tanggal, deskripsi, jumlah_soal, kesulitan_id, kelas_matkul_kode, materi } = req.body;

  const insertUjianQuery = 'INSERT INTO ujian (nama, tanggal, deskripsi, jumlah_soal, kesulitan_id, kelas_matkul_kode) VALUES (?, ?, ?, ?, ?, ?)';
  koneksi.query(insertUjianQuery, [nama, tanggal, deskripsi, jumlah_soal, kesulitan_id, kelas_matkul_kode], (err, result) => {
    if (err) {
      res.status(500).send(err.message);
      return;
    }

    const ujianId = result.insertId;

    // Memasukkan data ke tabel materi_has_ujian untuk setiap materi dalam array
    const insertMateriQuery = 'INSERT INTO materi_has_ujian (materi_id, ujian_id, persentase) VALUES (?, ?, ?)';
    const materiInsertPromises = materi.map(async ({ materi_id, persentase }) => {
      return new Promise((resolve, reject) => {
        koneksi.query(insertMateriQuery, [materi_id, ujianId, persentase], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      });
    });

    Promise.all(materiInsertPromises)
      .then(() => {
        res.status(201).send('Data ujian berhasil ditambahkan');
      })
      .catch((err) => {
        res.status(500).send(err.message);
      });
  });
});


module.exports = router;