import mongoose from "mongoose";
const validadorUnicoMongoose = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const plantillaSchema = new Schema({
    userID: { type: String, required: [true] },
    descripcion: {type: String},
    plantillaNombre:{ type: String, required: [true], unique: true },
    fechaCreacion: {type: Number},
    widgets: {type: Array}
})

//validacion
plantillaSchema.plugin(validadorUnicoMongoose, { message: 'Error, la plantilla ya existe ya existe' })


//To modelo
const Plantilla = mongoose.model('Plantilla', plantillaSchema);

export default Plantilla;