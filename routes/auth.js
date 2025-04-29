/*
    Rutas de Usuarios / Auth
    host + /api/auth
*/

const { Router } = require('express');
const { check } = require('express-validator');
const router = Router();
const { fieldValidator } = require('../middlewares/field-validator');
const { createUser, loginUser, renewToken } = require('../controllers/auth');
const { validateJWT } = require('../middlewares/validate-jwt');

router.post('/new',
    [
        // middlewares
        check('name', 'El nombre es obligatorio').notEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser de 6 caracteres').isLength({ min: 6 }),
        fieldValidator
    ],
    createUser);

router.post('/',
    [
        // middlewares
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser de 6 caracteres').isLength({ min: 6 }),
        fieldValidator
    ],
    loginUser);

router.get('/renew',
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser de 6 caracteres').isLength({ min: 6 }),
        validateJWT
    ],
    renewToken);

module.exports = router;