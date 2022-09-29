import mongoose from "mongoose";
const validadorUnicoMongoose = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const reglaAlarmaSchema = new Schema({
    userID: { type: String, required: [true] },
    dID: { type: String, required: [true] },
    emqxReglaID: {type: String, required: [true]},
    status:{ type: Boolean, required: [true] },
    variableNombreCompleto: {type: String},
    variable: {type: String},
    value: {type: Number},
    condicion: {type: String},
    triggerTime: {type: Number},
    contador: {type: Number, default: 0},
    fechaCreacion: {type: Number}
});

//validacion
reglaAlarmaSchema.plugin(validadorUnicoMongoose, { message: 'Error, la regla ya existe' })


//To modelo
const ReglaAlarma = mongoose.model('ReglaAlarma', reglaAlarmaSchema);

export default ReglaAlarma;