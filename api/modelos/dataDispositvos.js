import mongoose from "mongoose";
const validadorUnicoMongoose = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const datosDispositivosSchema = new Schema({
    userID: { type: String, required: [true] },
    dID: { type: String, required: [true] },
    variable: { type: String, required: [true] },
    value: {type: Number, required: [true]},
    time:{ type: Number, required: [true] }
});

//validacion
//datosDispositivosSchema.plugin(validadorUnicoMongoose, { message: 'Error, la regla ya existe' })


//To modelo
const DatosDispositivo = mongoose.model('DatosDispositivo', datosDispositivosSchema);

export default DatosDispositivo;