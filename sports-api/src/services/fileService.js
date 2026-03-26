const fs = require('fs');

/**
 * Сервис для работы с файловой системой
 * Предоставляет методы для чтения и записи данных в JSON файл
 */
class FileService {
    /**
     * Чтение данных из файла
     * @param {string} filePath - путь к файлу
     * @returns {Array} - массив данных
     */
    readData(filePath) {
        try {
            const data = fs.readFileSync(filePath, 'utf8');
            return JSON.parse(data);
        } catch (err) {
            console.error('Ошибка чтения файла:', err.message);
            return [];
        }
    }

    /**
     * Запись данных в файл
     * @param {string} filePath - путь к файлу
     * @param {Array} data - данные для записи
     */
    writeData(filePath, data) {
        try {
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
        } catch (err) {
            console.error('Ошибка записи файла:', err.message);
        }
    }
}

module.exports = new FileService();
