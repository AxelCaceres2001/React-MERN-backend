const { response } = require('express');
const Event = require('../models/Event');

// Obtener eventos
const getEvents = async (req, res = response) => {

    try {
        
        let events = await Event.find()
                                .populate('user', 'name');

        res.status(200).json({
            ok: true,
            events
        });

    } catch ( error ) {
        res.status(500).json({
            ok: false,
            msg: 'obtener eventos'
        });
    }
}


// Crear evento
const createEvent = async (req, res = response) => {
    
    const event = new Event( req.body );

    try {

        event.user = req.uid;

        const eventResult = await event.save();

        return res.status(201).json({
            ok: true,
            event: eventResult
        });

    } catch ( error ) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador.'
        });
    }
}

// Actualizar eventos
const updateEvent = async (req, res = response) => {
    
    const eventId = req.params.id;
    const uid = req.uid;

    try {

        const event = await Event.findById( eventId );

        if ( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese Id.' 
            });
        }

        if ( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio de editar este evento.' 
            });
        }

        const eventToUpdate = {
            ...req.body,
            user: uid
        }

        const eventUpdated = await Event.findByIdAndUpdate( eventId, eventToUpdate, { new: true } )

        return res.status(200).json({
            ok: true,
            event: eventUpdated
        });

    } catch ( error ) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador.'
        });
    }
}

// Eliminar eventos
const deleteEvent = async (req, res = response) => {
    
    const eventId = req.params.id;
    const uid = req.uid;

    try {

        const event = await Event.findById( eventId );

        if ( !event ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no existe por ese Id.' 
            });
        }

        if ( event.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene privilegio para eliminar este evento.' 
            });
        }

        await Event.findByIdAndDelete( eventId );

        return res.status(200).json({
            ok: true,
            msg: 'El evento ha sido eliminado.'
        });

    } catch ( error ) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador.'
        });
    }
}

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}