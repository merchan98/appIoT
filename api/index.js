// requires
const express = require('express');
const morgan=require("morgan");
const cors=require("cors");
const mongoose=require("mongoose");
const colors=require("colors");

//instancias
const appExpres = express();

//Configuracion Express
appExpres.use(morgan("tiny"));
appExpres.use(cors());
appExpres.use(express.json());
    //Para poder pasar varaibles por url
appExpres.use(express.urlencoded({
    extended: true
}));

//Rutas de espress
appExpres.use('/api', require('./rutas/dispositivos.js'))
appExpres.use('/api', require('./rutas/usuarios.js'))
appExpres.use('/api', require('./rutas/plantillas.js'))
appExpres.use('/api', require('./rutas/webhooks.js'))
appExpres.use('/api', require('./rutas/emqxApi.js'))
appExpres.use('/api', require('./rutas/alarmas.js'))
appExpres.use('/api', require('./rutas/dataprovaider.js'))
appExpres.use('/api', require('./rutas/tipoDispositvos.js'))


module.exports=appExpres;

//listener 
appExpres.listen(3001,() =>{
    console.log("Escucho API por el 3001");
});


//Conexion Mongo
const mongoUsername = "UserDev";
const mongoPassword = "PasswordDev";
const mongoHost = "localhost";
const mongoPort = "27017";
const mongoDatabase = "appIoT"

//Mongo URI
var uri="mongodb://"+mongoUsername+":"+mongoPassword+"@"+mongoHost+":"+mongoPort+"/"+mongoDatabase;

//Conexion Moongoose
const opciones={
    authSource: "admin"
};


mongoose.connect(uri,opciones).then(()=>{
    console.log("+++++++++++++++++++++++++++++++++".green);
    console.log(" Conexion con Mongo Establecida".green);
    console.log("+++++++++++++++++++++++++++++++++\n".green);
},(error)=>{
    console.log("+++++++++++++++++++++++++++++++++".red);
    console.log(" Conexion con Mongo Fallida".red);
    console.log("+++++++++++++++++++++++++++++++++\n".red);
    console.log(error);
});




//Endpoints

// appExpres.get("/testing", (req, res) =>{
//     res.send("Primera test endpoints");
// })


