const express = require('express');
const router = express.Router();
const participantsController = require('../controllers/participantsController');

router.get('/', participantsController.getAll);

router.get('/:id', participantsController.getById);

router.post('/', participantsController.create);

router.patch('/:id', participantsController.update);

router.delete('/:id', participantsController.delete);

module.exports = router;
