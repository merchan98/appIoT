import mongoose from "mongoose";
const validadorUnicoMongoose = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const TipoDispositivoSchema = new Schema({
    nombre:{ type: String, required: [true], unique: true },
    tipoDispositivo:{ type: String, required: [true] },
    variables:{type: Array, required:[true]},
    fechaCreacion: {type: Number}
})

//validacion
TipoDispositivoSchema.plugin(validadorUnicoMongoose, { message: 'Error, el tipo de dispostivo ya existe' })


//To modelo
const TipoDispositivo = mongoose.model('TipoDispositivo', TipoDispositivoSchema);

export default TipoDispositivo;