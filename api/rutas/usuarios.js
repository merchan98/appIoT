//requires
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {checkAuth} = require('../middlewares/autenfificadortoken.js');

//Modelos
import Usuario from '../modelos/usuario.js';
import ReglaEmqxAuth from '../modelos/emqxAuth.js';


//Autenticacion

//Registro de un usuario
router.post("/registro", async (req, res) => {
    try { // Try-catch 39
        const contraEncriptada = bcrypt.hashSync(req.body.password, 12);

        const nuevoUsuario = {
            nombre: req.body.nombre,
            email: req.body.email,
            password: contraEncriptada
        };

        const usuario = await Usuario.create(nuevoUsuario);

        console.log("Nuevo usuario(salida rutas)");
        console.log(usuario);

        const toSend = {
            status: "success"
        };

        res.json(toSend);
    } catch (error) {
        // console.log("ERROR!! Registro Usuario Ruta");
        // console.log(error);

        const toSend = {
            status: "fail",
            error: error
        };
        
        res.status(500).json(toSend);
    }

});

//Logeo de un usuario
router.post("/login", async (req, res) => {
    //console.log(req.body);
    try { // Try-catch 40
        const contraEncriptada = bcrypt.hashSync(req.body.password, 12);
    
        var usuario = await Usuario.findOne({ email: req.body.email });
    
        //Si no existe el usuario
        if (!usuario) {
            const toSend = {
                status: "ERROR",
                error: "Credenciales Invalidas"
            }
            return res.status(401).json(toSend);
        }
    
        //Credenciales Validas
        if (bcrypt.compareSync(req.body.password, usuario.password)) {
            //Borramos al contraseña por se un dato sensible
            usuario.set('password', undefined, { strict: false });
            usuario.set('email', undefined, { strict: false });
            //Genero el token JWT
            const token = jwt.sign({ datosUsuario: usuario}, 'IoteESelmassegurodesdeel98', {expiresIn: 60*60*24*30});
    
            const toSend = {
                status: "success",
                token: token,
                datosUsuarios: usuario
            };
    
            return res.json(toSend);
    
        } else { //Contraseña Erronea
            const toSend = {
                status: "ERROR",
                error: "Credenciales Invalidas"
            }
            return res.status(401).json(toSend);
        }
    } catch (error) {
        const toSend = {
            status: "Error en el Login",
            error: error
        }
        return res.status(401).json(toSend);
    }

});

//Manejo de usuarios (CREACION DE PRUEBA)
// router.get('/nuevoUsuario', async (req, res) => {
//     try { // Try-catch 
//         const usuario = await Usuario.create({
//             nombre: "Jane",
//             email: "shjasp@jas.com",
//             password: "ho9las"
//         });
//         res.json({"status":"success"})
//     } catch (error) {
//         console.log(error);
//         res.json({"status":"fail"})
//     }
// });


//Get MQTT credenciales web
router.post("/getMqttcredenciales", checkAuth, async (req, res) => {
    try { // Try-catch 41
        //Constantes y variables
        const userID = req.datosUsuarios._id;
        

        //llamamos a la funcion para consegui rlos credenciales
        const credenciales = await getMqttCredencialesWeb(userID);
        console.log(credenciales);
        //Creamos la respuesta
        const toSend = {
            status: "success",
            username: credenciales.mqttUsername,
            password: credenciales.mqttPassword
        }
        res.json(toSend);
        
        //Cambiamos el usuario y la contraseña para que solo se pueda acceder  durante un tiempo limitado
        setTimeout(()=>{
            getMqttCredencialesWeb(userID);
        }, 5000);

        return 
        
    } catch (error) {
        console.log("Error al conseguir la credenciales");
        console.log(error);
        //Creamos la respuesta
        const toSend ={
            status: "error",
            error: error
        }

        return res.status(500).json(toSend)
    }
});

//Get MQTT credenciales web para reconexiones
router.post("/getMqttcredencialesReconexion", checkAuth, async (req, res) => {
    try { // Try-catch 42
        //Constantes y variables
        const userID = req.datosUsuarios._id;

        //llamaos a la funcion para consegui rlos credenciales
        const credenciales = await getMqttCredencialesWebReconexion(userID);

        if(!credenciales){
            const toSend = {
                status: "fail",
                msg: "Error al conseguir las credenciales"
            }
    
            res.json(toSend);
        }
        //Creamos la respuesta
        const toSend = {
            status: "success",
            username: credenciales.mqttUsername,
            password: credenciales.mqttPassword
        }

        res.json(toSend);

        //Cambiamos el usuario y la contraseña para que solo se pueda acceder  durante un tiempo limitado
        setTimeout(()=>{
            getMqttCredencialesWeb(userID);
        }, 10000);

        return 
        
    } catch (error) {
        console.log("Error al conseguir la credenciales");
        console.log(error);
        //Creamos la respuesta
        const toSend ={
            status: "error",
            error: error
        }

        return res.status(500).json(toSend)
    }
});





//Funciones

//Conseguir las credenciales para conectarse por MQTT
async function getMqttCredencialesWeb(userID){
    try { // Try-catch 43
        var regla = await ReglaEmqxAuth.find({tipo: "usuario", userID: userID});
        console.log("Hola desde Get Credencilaes WEB"+ regla);
        //Es la primera vez
        if(regla.length == 0){
            //Construimos al regal a crear
            const nuevaRegla ={
                userID: userID,
                username: realizarID(10),
                password: realizarID(10),
                publish: [userID + "/#"],
                subscribe: [userID + "/#"],
                tipo: "usuario",
                time: Date.now(),
                updatedTime: Date.now()
            };
    
            //Guardamos la nueva regla en la BD
            const respuesta = await ReglaEmqxAuth.create(nuevaRegla);
    
            //PReparamos la respuesta
            const toSend={
                mqttUsername: respuesta.username,
                mqttPassword: respuesta.password
            };

            return toSend;
        }else{ //Ya hay otras reglas
            //Constantes y variables
            const nuevoUsername = realizarID(10);
            const nuevoPassword = realizarID(10);

            //Actualizamos el usuario y la contraseña
            const respuesta = await ReglaEmqxAuth.updateOne({tipo:"usuario", userID: userID}, {$set: {username: nuevoUsername, password: nuevoPassword, updatedTime: Date.now()}});
            console.log(respuesta);
            if(respuesta.modifiedCount ==1 && respuesta.matchedCount == 1){ //Si se ha encontrado el registro y se a modificado correctamente
                return{
                    mqttUsername: nuevoUsername,
                    mqttPassword: nuevoPassword
                }
            }else{
                return false
            }
        }
        
    } catch (error) {
        console.log("Error en la creacion de credenciales");
        console.log(error);
        return false;
    }

}

async function getMqttCredencialesWebReconexion(userID){
    try { // Try-catch 44
        const respuesta = await ReglaEmqxAuth.findOne({tipo: "usuario", userID: userID});

        if(respuesta !== null){ //Si se ha encontrado el registro ç
            //PReparamos la respuesta
            const toSend={
                mqttUsername: respuesta.username,
                mqttPassword: respuesta.password
            }

            return toSend;
        }else{
            return false
        }
    } catch (error) {
        
    }
}


function realizarID(longitud){
    var cadena="";
    var caracteres="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!·$%&";
    for (var i=0;i<longitud;i++){
        cadena += caracteres.charAt(Math.floor(Math.random()*caracteres.length));
    }
    return cadena;
}

//export
module.exports = router;