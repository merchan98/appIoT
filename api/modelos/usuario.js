import mongoose from "mongoose";
const validadorUnicoMongoose = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const usuariosSchema = new Schema({
    nombre: { type: String, required: [true] },
    email: { type: String, required: [true], unique: true },
    password: { type: String, required: [true] }
    
});


//validacion
usuariosSchema.plugin(validadorUnicoMongoose, { message: 'Error, el email ya esta en uso' })


//To modelo
const Usuario = mongoose.model('Usuario', usuariosSchema);

export default Usuario;