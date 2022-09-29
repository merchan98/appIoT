import mongoose from "mongoose";
const validadorUnicoMongoose = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const notificacionSchema = new Schema({
    userID: { type: String, required: [true] },
    dID: { type: String, required: [true] },
    dNombre: { type: String, required: [true] },
    payload: { type:Object},
    emqxReglaID: {type: String, required: [true]},
    variable: {type: String, required: [true]},
    variableNombreCompleto: {type: String, required: [true]},
    topic: {type: String, required: [true]},
    value: {type: Number, required: [true]},
    condicion: {type: String, required: [true]},
    leido: {type: Boolean, required: [true]},
    fecha: {type: Number, required: [true]}
});

//validacion
notificacionSchema.plugin(validadorUnicoMongoose, { message: 'Error, la notificacion ya existe' })


//To modelo
const Notificacion = mongoose.model('Notificacion', notificacionSchema);

export default Notificacion;