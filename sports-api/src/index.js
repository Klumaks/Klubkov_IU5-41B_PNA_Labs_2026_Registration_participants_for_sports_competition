const express = require('express');
const path = require('path');
const participantsRouter = require('./routes/participants');

const app = express();
const PORT = 3002;

app.use(express.json());

app.use(express.static(path.join(__dirname, '../public')));

app.use('/participants', participantsRouter);

app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

app.use((err, req, res, next) => {
    console.error('Ошибка:', err.message);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
    console.log(`API сервер запущен по адресу http://localhost:${PORT}`);
    console.log(`Доступные эндпоинты:`);
    console.log(`GET    /participants           - список участников`);
    console.log(`GET    /participants/:id       - участник по ID`);
    console.log(`GET    /participants?sport=... - фильтрация по виду спорта`);
    console.log(`POST   /participants           - создать участника`);
    console.log(`PATCH  /participants/:id       - обновить участника`);
    console.log(`DELETE /participants/:id       - удалить участника`);
});
