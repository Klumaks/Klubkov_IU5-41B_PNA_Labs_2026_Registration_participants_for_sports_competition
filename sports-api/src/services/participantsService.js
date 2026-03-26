const fileService = require('./fileService');
const path = require('path');


const DATA_FILE_PATH = path.join(__dirname, '../data/participants.json');

class ParticipantsService {
    /**
     * Получение всех участников с возможностью фильтрации по виду спорта
     * @param {string} sport - фильтр по виду спорта
     * @returns {Array} - список участников
     */
    findAll(sport) {
        const participants = fileService.readData(DATA_FILE_PATH);

        if (sport) {
            return participants.filter(p =>
                p.sport.toLowerCase() === sport.toLowerCase()
            );
        }
        return participants;
    }

    /**
     * Поиск участника по ID
     * @param {number} id - ID участника
     * @returns {Object|null} - участник или null
     */
    findOne(id) {
        const participants = fileService.readData(DATA_FILE_PATH);
        return participants.find(p => p.id === id) || null;
    }

    /**
     * Создание нового участника
     * @param {Object} participantData - данные участника
     * @returns {Object} - созданный участник
     */
    create(participantData) {
        const participants = fileService.readData(DATA_FILE_PATH);

        const newId = participants.length > 0
            ? Math.max(...participants.map(p => p.id)) + 1
            : 1;

        const newParticipant = {
            id: newId,
            ...participantData,
            registrationDate: new Date().toLocaleDateString('ru-RU')
        };

        participants.push(newParticipant);
        fileService.writeData(DATA_FILE_PATH, participants);

        return newParticipant;
    }

    /**
     * Обновление участника
     * @param {number} id - ID участника
     * @param {Object} participantData - новые данные
     * @returns {Object|null} - обновленный участник или null
     */
    update(id, participantData) {
        const participants = fileService.readData(DATA_FILE_PATH);
        const index = participants.findIndex(p => p.id === id);

        if (index === -1) return null;

        participants[index] = {
            ...participants[index],
            ...participantData,
            id: participants[index].id
        };

        fileService.writeData(DATA_FILE_PATH, participants);

        return participants[index];
    }

    /**
     * Удаление участника
     * @param {number} id - ID участника
     * @returns {boolean} - успешно ли удаление
     */
    delete(id) {
        const participants = fileService.readData(DATA_FILE_PATH);
        const filteredParticipants = participants.filter(p => p.id !== id);

        if (filteredParticipants.length === participants.length) {
            return false;
        }

        fileService.writeData(DATA_FILE_PATH, filteredParticipants);
        return true;
    }
}

module.exports = new ParticipantsService();
