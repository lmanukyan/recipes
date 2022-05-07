import * as moment from 'moment';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid'

export const uploadsPath = () => {
    return `./uploads/${moment().format('YYYY/MM')}`;
}

export const makeFileName = (req, file, cb) => {
    const extension = path.extname(file.originalname)
    cb(null, `${uuidv4()}${extension}`)
}

export const urlPath = (filePath) => {
    return filePath.replace(/\\/g, '/')
}
