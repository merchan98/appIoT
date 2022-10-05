import mongoose from "mongoose";
const validadorUnicoMongoose = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const reglaEmqxAuthSchema = new Schema({
    userID: { type: String, required: [true] },
    dID: { type: String },
    username: {type: String, required: [true]},
    password:{ type: String, required: [true] },
    publish: {type: Array},
    subscribe: {type: Array},
    tipo: {type: String, required: [true]},
    time: {type: Number},
    updatedTime: {type: Number}
});

//validacion
reglaEmqxAuthSchema.plugin(validadorUnicoMongoose, { message: 'Error, la regla ya existe' })


//To modelo
const ReglaEmqxAuth = mongoose.model('emqxauthrules', reglaEmqxAuthSchema);

export default ReglaEmqxAuth;