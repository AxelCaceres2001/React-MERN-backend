/*
    Rutas de Eventos / Events
    host + /api/events
*/

const { Router } = require('express');
const router = Router();
const { check } = require('express-validator');

const { isDate } = require('../helpers/isDate');
const { fieldValidator } = require('../middlewares/field-validator');
const { createEvent, updateEvent, deleteEvent, getEvents } = require('../controllers/events');
const { validateJWT } = require('../middlewares/validate-jwt');

router.use( validateJWT );

// Obtener eventos
router.get('/',
    [
        // middlewares
        fieldValidator,
    ],
    getEvents);

// Crear un nuevo evento
router.post('/',
    [
        // middlewares
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
        check('start', 'Fecha de finalizacion es obligatoria').custom( isDate ),
        fieldValidator,
    ],
    createEvent);

// Actualizar evento
router.put('/:id',
    [
        // middlewares
        fieldValidator,
    ],
    updateEvent);

// Borrar evento
router.delete('/:id',
    [
        // middlewares
        fieldValidator,
    ],
    deleteEvent);

module.exports = router;