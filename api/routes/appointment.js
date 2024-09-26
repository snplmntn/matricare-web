const express = require('express');
const router = express.Router();
const { create, update, get, updateStatus, delete: deleteAppointment } = require('../controllers/appointmentController');

router.post('/', create);
router.put('/:appointmentId', update);
router.get('/:appointmentId', get);
router.put('/updateStatus/:appointmentId', updateStatus);
router.delete('/:appointmentId', deleteAppointment);

module.exports = router;
