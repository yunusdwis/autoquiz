const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;


const materi = require('./backend/materi');
const soal = require('./backend/soal');
const ujian = require('./backend/ujian');

const apiRouter = express.Router();
apiRouter.use('/materi', materi);
apiRouter.use('/soal', soal);
apiRouter.use('/ujian', ujian);
app.use('/api', apiRouter);

app.use(express.static('public'));
app.get('/ujian/buat', (req, res) => {
    res.sendFile(__dirname +'/frontend/buat_ujian.html');
});
app.get('/ujian/buat/preview', (req, res) => {
    res.sendFile(__dirname +'/frontend/buat_ujian.html');
});

app.listen(PORT, () => console.log(`Server running at port: ${PORT}`))