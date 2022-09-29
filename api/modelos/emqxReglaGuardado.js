import mongoose from "mongoose";
const validadorUnicoMongoose = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const reglaGuardadoSchema = new Schema({
    userID: { type: String, required: [true] },
    dID: { type: String, required: [true] },
    emqxReglaID: {type: String, required: [true]},
    status:{ type: Boolean, required: [true] }
});

//validacion
reglaGuardadoSchema.plugin(validadorUnicoMongoose, { message: 'Error, la regla ya existe' })


//To modelo
const ReglaGuardado = mongoose.model('ReglaGuardado', reglaGuardadoSchema);

export default ReglaGuardado;