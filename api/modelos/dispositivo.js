import mongoose from "mongoose";
const validadorUnicoMongoose = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const dispositivoSchema = new Schema({
    userID: { type: String, required: [true] },
    dID: { type: String, required: [true], unique: true },
    nombre:{ type: String, required: [true] },
    seleccionado: { type: Boolean, required: [true], default: false },
    plantillaID:{ type: String },
    plantillas:{ type: Array },
    plantillaNombre:{ type: String },
    tipoDispositivoID:{ type: String, required: [true] },
    tipoDispositivoNombre:{ type: String, required: [true] },
    fechaCreacion: {type: Number}
})

//validacion
dispositivoSchema.plugin(validadorUnicoMongoose, { message: 'Error, el dispostivo ya existe' })


//To modelo
const Dispositivo = mongoose.model('Dispositivo', dispositivoSchema);

export default Dispositivo;