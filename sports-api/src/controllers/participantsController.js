const participantsService = require('../services/participantsService');

class ParticipantsController {
    /**
     * GET /participants - получение всех участников
     * Поддержка фильтрации по виду спорта через query параметр ?sport=
     */
    getAll(req, res) {
        try {
            const { sport } = req.query;
            const participants = participantsService.findAll(sport);
            res.json(participants);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка получения списка участников' });
        }
    }

    /**
     * GET /participants/:id - получение участника по ID
     */
    getById(req, res) {
        try {
            const id = parseInt(req.params.id);
            const participant = participantsService.findOne(id);

            if (!participant) {
                return res.status(404).json({ error: 'Участник не найден' });
            }

            res.json(participant);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка получения участника' });
        }
    }

    /**
     * POST /participants - создание нового участника
     */
    create(req, res) {
        try {
            const { name, sport, team, age, photo, achievements, phone, email } = req.body;

            if (!name || !sport || !team || !age) {
                return res.status(400).json({
                    error: 'Обязательные поля: name, sport, team, age'
                });
            }

            const newParticipant = participantsService.create({
                name,
                sport,
                team,
                age: parseInt(age),
                photo: photo || 'https://minsknews.by/wp-content/uploads/2024/08/photo_2024-08-03_09-05-59.jpg',
                achievements: achievements || 'Нет достижений',
                phone: phone || 'Не указан',
                email: email || 'Не указан'
            });

            res.status(201).json(newParticipant);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка создания участника' });
        }
    }

    /**
     * PATCH /participants/:id - обновление участника
     */
    update(req, res) {
        try {
            const id = parseInt(req.params.id);
            const updatedParticipant = participantsService.update(id, req.body);

            if (!updatedParticipant) {
                return res.status(404).json({ error: 'Участник не найден' });
            }

            res.json(updatedParticipant);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка обновления участника' });
        }
    }

    /**
     * DELETE /participants/:id - удаление участника
     */
    delete(req, res) {
        try {
            const id = parseInt(req.params.id);
            const success = participantsService.delete(id);

            if (!success) {
                return res.status(404).json({ error: 'Участник не найден' });
            }

            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Ошибка удаления участника' });
        }
    }
}

module.exports = new ParticipantsController();
