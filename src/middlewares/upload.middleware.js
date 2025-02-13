import multer from 'multer';
import path from 'path';
import fs from 'fs';

const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024; // 2 ГБ

// Создаем папки, если их нет
if (!fs.existsSync('files')) fs.mkdirSync('files');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'files/');
    },
    
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

export const upload = multer({
    storage,
    limits: {
        fileSize: MAX_FILE_SIZE,
        files: 1,
    },
});
