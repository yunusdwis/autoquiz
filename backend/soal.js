const express = require('express');
const koneksi = require('../config/database');
const bodyParser = require('body-parser');

const router = express.Router();
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));


router.post('/generate-random', async (req, res) => {
    const { kesulitan_id, materi, jumlah_soal } = req.body;
  
    try {
      const query = `
        SELECT s.id, s.isi, k.nama AS kesulitan, m.nama AS materi
        FROM soal s INNER JOIN kesulitan k ON s.kesulitan_id=k.id INNER JOIN materi m ON s.materi_id=m.id
        WHERE materi_id = ? AND kesulitan_id = ?
        ORDER BY RAND()
        LIMIT ?;
      `;
  
      const soalPerMateri = materi.map(({ materi_id, persentase }) => ({
        materiId: materi_id,
        jumlahSoal: Math.round((persentase / 100) * jumlah_soal)
      }));
  
      const soalPromises = soalPerMateri.map(async ({ materiId, jumlahSoal }) => {
        return new Promise((resolve, reject) => {
          koneksi.query(query, [materiId, kesulitan_id, jumlahSoal], (err, results) => {
            if (err) {
              reject(err);
            } else {
              resolve(results);
            }
          });
        });
      });
  
      const soalResults = await Promise.all(soalPromises);
  
      const allSoal = soalResults.reduce((acc, cur) => acc.concat(cur), []);
  
      res.status(200).json(allSoal);
    } catch (error) {
      console.error(error);
      res.status(500).send('Terjadi kesalahan saat mengambil soal.');
    }
  });


module.exports = router;