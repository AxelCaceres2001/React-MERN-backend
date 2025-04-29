const { response } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateJWT } = require('../helpers/jwt');

const createUser = async (req, res = response) => { 

    const { email, password } = req.body;

    try {

        let user = await User.findOne({ email });

        if ( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'Existe un usuario con ese correo.' 
            });
        }

        user = new User( req.body );

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );

        await user.save();

        // Generar JWT
        const token = await generateJWT( user.id, user.name );

        return res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Ha ocurrido un error.'
        });
    }
}

const loginUser = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });

        if ( !user ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario y/o contraseña incorrecta.' 
            });
        }

        // Confirmar las contraseñas
        const validPassword = bcrypt.compareSync( password, user.password );

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                message: 'Usuario y/o contraseña incorrecta.'
            });
        }

        // Generar JWT
        const token = await generateJWT( user.id, user.name );

        return res.status(200).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: 'Ha ocurrido un error.'
        });
    }
}

const renewToken = async (req, res = response) => {

    const { uid, name } = req;

    // Generar un nuevo JWT
    const token = await generateJWT( uid, name );

    res.status(200).json({
        ok: true,
        token
    })
}

module.exports = {
    createUser,
    loginUser,
    renewToken
}