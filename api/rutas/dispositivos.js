// requires
const express = require('express');
const router = express.Router();
const {checkAuth} = require('../middlewares/autenfificadortoken.js');
const axios = require('axios');

//Autentificacion para la API
const auth ={
    auth:{
        username: 'admin',
        password: 'emqxsecret'
    }
}

//Modelos
import Dispositivo from '../modelos/dispositivo.js';
import ReglaGuardado from "../modelos/emqxReglaGuardado";
import ReglaAlarma from '../modelos/emqxReglasAlarmas.js';
import Plantilla from '../modelos/plantilla.js';
import ReglaEmqxAuth from '../modelos/emqxAuth.js';
import { RuntimeGlobals } from 'webpack';

    
/*
//test
// router.get("/testing", (req, res) => {
//     // res.send("Primera test endpoints");
    
//     //parametros que pasamos en la url
//     console.log(req.query);

//     var toReturn = {
//         status: "success",
//         data: "ab c d"
//     };

//     res.json(toReturn);
// }); */


//peticion de dispostivos
router.get("/dispositivo", checkAuth, async (req, res) => {
    try {
        // console.log(req);
        //Constantes y variables
        const userID = req.datosUsuarios._id;
        
        //busqueda de dispostivos
        const dispositivos = await Dispositivo.find({ userID: userID });

        //Comvertimos a array el objeto dispositvos
        //var dispositivosArray= Object.assign({},dispositivos);
        var dispositivosArray = JSON.parse(JSON.stringify(dispositivos)); //Manera Ruda
        
        //busqueda de la reglas de Guardados
        const reglasGuardado = await getReglasGuardado(userID);

        //busqueda de la reglas de Guardados
        const plantillas = await getPlantillas(userID);
        
        //busqueda de Alarmas
        const alarmas = await getAlarmas(userID);

        //Cruce de tablas para añadir las reglas de guardado al dispositvo
        dispositivosArray.forEach((dispositivo, index) =>{
            
            dispositivo.reglaGuardado = reglasGuardado.filter(reglaGuardado => reglaGuardado.dID == dispositivo.dID)[0];
            console.log(dispositivo.reglaGuardado);
            dispositivo.plantilla = plantillas.filter(plantilla => plantilla._id == dispositivo.plantillaID)[0];
            dispositivo.alarmas = alarmas.filter(alarma => alarma.dID == dispositivo.dID);
        })
        // console.log("LLEGO HASTA AQUI2");
        //Respuesta
        const toSend = {
            status: "Success",
            data: dispositivosArray
        };
        res.json(toSend);

    } catch (error) {
        console.log("Error Listado de Dispostivos dispostivo.js");
        // console.log(error);

        const toSend = {
            status: "error",
            error: error
        };
        return res.status(500).json(toSend);
    }
});

//Creacion del dispostivos
router.post("/dispositivo", checkAuth , async (req, res) => {
    try {
        //Constantes y variables
        const userID = req.datosUsuarios._id;
        var nuevoDispositvo = req.body.nuevoDispositivo;
        console.log(nuevoDispositvo);
        //Salida Prueba
        // console.log("SALIDA nuevoDispositvo POST");
        // console.log(nuevoDispositvo);

        //Añadimos los campos que faltan
        nuevoDispositvo.userID = userID;
        nuevoDispositvo.fechaCreacion = Date.now();
        
        //Creamos la Regla
        await crearReglaGuardado(userID, nuevoDispositvo.dID, false);

        //Creamos el dispostivo
        const dispositivo = await Dispositivo.create( nuevoDispositvo );
        console.log(dispositivo);
        //Seleccionamos el nuevo dispositivo
        await seleccionarDispositivo(userID, nuevoDispositvo.dID);

        //Respuesta
        const toSend = {
            status: "success"
        };
        return res.json(toSend);
    } catch (error) {
        console.log("Error Creacion de nuevo dispostivo");
        console.log(error);

        const toSend = {
            status: "error",
            error: error
        };
        return res.status(500).json(toSend);
    }

});

//Borrado del Dispositvo
router.delete("/dispositivo", checkAuth , async (req, res) => {
    
    try {
        //Constantes y variables
        const userID = req.datosUsuarios._id;
        const dispID = req.query.dispID
        //const dispID = req.body.dispID//Si viene post
        // console.log(userID);
        // console.log(req.query.dispID);

        //Borrar la regla de Guardado
        await borrarReglaGuardado(dispID);

        //Borramos todas la reglas de alarma
        await borrarAlarmas(userID, dispID);

        //Borramos todas las credeciales mqtt
        await borrarMqttCredenciales(dispID);

        //Falta la funcion para seleccionar otro dispsitivo si el boorado esta select
        await seleccionarDispositivoBorrado(userID, dispID);

        //Busqueda del que hay que eliminar
        //Se compueba que el dispostivo es del usuario tambien
        const resBorrado = await Dispositivo.deleteOne({ userID: userID, dID: dispID });
        
        
        //Buscamos si esta seleccioando si selecciona el primero de la lista
        const dispostivos = await Dispositivo.find({ userID: userID});

        if (dispostivos.length >= 1) {
            var encontrado = false;
            dispostivos.forEach(dispostivos => {
                if (dispostivos.seleccionado == true) {
                    encontrado = true;
                }
            });

            if (!encontrado) {
                await Dispositivo.updateMany({ userID: userID }, { seleccionado: false });
                await Dispositivo.updateOne({ userID: userID, dID: dispostivos[0].dID },{ seleccionado: true });
            }
        }

        //Respuesta (Añadir info del dipostivo borrado en el futuro)
        const toSend = {
            status: "Success",
            datos: resBorrado
        };
        return res.json(toSend);
    } catch (error) {
        console.log("Error Borrado de Dispostivo");
        console.log(error);

        const toSend = {
            status: "error",
            error: error
        };
        return res.status(500).json(toSend);
    }

});

//Seleccionamos el nuevo dispostivo
router.put("/dispositivo", checkAuth , async  (req, res) => {
    try {
        //Constantes y variables
        const userID = req.datosUsuarios._id;
        const dispID = req.body.dID;
    
        if (await seleccionarDispositivo(userID, dispID)) {
            const toSend = {
                status: "Success"
                
            };
            
            return res.json(toSend);
        } else {
            const toSend = {
                status: "error"
            };
            return res.status(500).json(toSend);
        }
        
    } catch (error) {
        console.log("Error al seleccionar un dispositivo");
        console.log(error);
    }
});

//Update del status de la regla de guardado
router.put("/reglaGuardado", checkAuth , async  (req, res) => {
    try {
        //Constantes y variables
        const regla = req.body.regla;

        console.log(regla);

        //Llamaos a la funcion para actualizr la regla
        var respuesta = await updateStatusReglaGuardado(regla.emqxReglaID, regla.status);

        //Respuesta
        if (respuesta != false) {
            const toSend = {
                status: "success"
            };
            
            return res.json(toSend);
        } else {
            const toSend = {
                status: "error"
            };
            return res.status(400).json(toSend); //REvisar el numero de error
        }
    } catch (error) {
        console.log("Error en al actualizar el status de la regla");
        console.log(error);
    }
});



//Funciones
async function seleccionarDispositivo(userIDrecib, dispIDrecib) {
    try {
        //Lo ponemos todo en falso
        const result = await Dispositivo.updateMany({ userID: userIDrecib }, { seleccionado: false })

        //Ponemos 1 dispositivo en verdadero
        const result2 = await Dispositivo.updateOne({ dID: dispIDrecib, userID: userIDrecib }, { seleccionado: true });
    
        return true;
    } catch (error) {
        console.log("Error en la funcion seleccionarDispositivo");
        console.log(error);
        return false;
    }
    
}

async function seleccionarDispositivoBorrado(userIDrecib, dispIDrecib) {
    try {
        
        //Cojemos el dispositivo seleccionado
        const dispositivoRecibido = await Dispositivo.find({ userID: userIDrecib, dID: dispIDrecib });
        
        if (dispositivoRecibido[0].seleccionado) {
            //Cojemos 1 dipositivo
            const dispositivo = await Dispositivo.find({ userID: userIDrecib });
            
            if(dispositivo.length > 0){ //Por si no hay mas dispsitvivos
                 //Ponemos 1 dispositivo en verdadero
                const result2 = await Dispositivo.updateOne({ dID: dispositivo[0].dID, userID: userIDrecib }, { seleccionado: true });
            }
            
        }
        
    
        return true;
    } catch (error) {
        console.log("Error en la funcion seleccionarDispositivoBorrado");
        console.log(error);
        return false;
    }
    
}


//Funciones De Reglas Guardados

//Peticion de reglas
async function getReglasGuardado(userID){
    try {
        const reglas = await ReglaGuardado.find({userID: userID});
        return reglas;
    } catch (error) {
        console.log("Error al obtener las Reglas");
        return false;
    }
}

//Creación de Regla Guardados
async function crearReglaGuardado(userID,dID,status){
    try {
        //Url de la api
        const url = "http://localhost:8085/api/v4/rules";

        //Contrucion del topic
        const topic= userID + "/" + dID + "/+/sdata";

        //Sentencia SQL
        const rawsql= "SELECT topic, payload FROM \""+topic+"\" WHERE payload.save=1";
    
        //Objeto nueva regla
        var nuevaRegla = {
            rawsql: rawsql,
            actions: [{
                name: "data_to_webserver",
                params:{
                    $resource: global.recursoGuardado.id,
                    payload_tmpl: '{"userID":"'+userID+'",payload":${payload},"topic":"${topic}"}'
                }
            }],
            description: "GUARDAR - REGLA",
            enabled: status
        };
        
        //Llamada a la API para guardar la regla
        const respuesta =await axios.post(url, nuevaRegla, auth)

        if(respuesta.status === 200 && respuesta.data.data){
            //console.log(respuesta.data.data);

            await ReglaGuardado.create({
                userID: userID,
                dID: dID,
                emqxReglaID: respuesta.data.data.id,
                status: status
            });
            return true;
        }else{
            //Algo no salio bien
            console.log("Algo no salió bien al crear la regla de Guardado");
            return false;
        }

    } catch (error) {
        console.log("Error al crear al regla de Guardado");
        console.log(error);
        return false; 
    }
}

//Actualizar status de una regla
async function updateStatusReglaGuardado(emqxReglaID, status){
    try {
        //Url de la api
        const url = "http://localhost:8085/api/v4/rules/"+emqxReglaID;

        //Objeto con el nuevo status
        const nuevaRegla ={enabled:status}

        //Llamada a la API de EMQX
        const respuesta = await axios.put(url, nuevaRegla, auth);
        //console.log(respuesta);
        if(respuesta.status === 200 && respuesta.data.data){
            //Actualizamos la regal en la BD
            await  ReglaGuardado.updateOne({emqxReglaID: emqxReglaID},{status:status})
            
            console.log("Se actuliazado el status de la regla".green);

            //Respuesta
            const toSend={
                status: "success",
                action: "update"
            };
            return toSend;
        }else{
            //REvisar#######
            console.log("Error al actualizar la regla de Guardado en EMQX");
            return false
        }

    } catch (error) {
        console.log("Error al actualizar el status de la Regla de Guardado");
        console.log(error);
    }
}


//Borrar una regla 
async function borrarReglaGuardado(dID){
    try {
        //Buscamos la regla por el ID del sipositivo pasado como parametro
        const regla = await ReglaGuardado.findOne({dID: dID});

        if(regla != null){
            //Url de la api
            const url = "http://localhost:8085/api/v4/rules/"+ regla.emqxReglaID;

            //Llamada a al API de EMQX
            const emqxRegla = await axios.delete(url, auth);

            //Llamada a la BD para borrar la regla
            const reglaborrada = await ReglaGuardado.deleteOne({dID: dID});

            //REVISAR SALIDA
            return reglaborrada;
        }else{
            console.log("No hay ninguna regla con ese ID");
            return false;
        }

    } catch (error) {
        console.log("Error al borrar la Regla de Guardado");
        console.log(error);
        return false;
    }
}

//Funiones sobre Plantillas

//Peticion de plantillas
async function getPlantillas(userID){
    try {
        const plantillas = await Plantilla.find({userID: userID});
        return plantillas;
    } catch (error) {
        console.log("Error al obtener las Plantillas");
        return false;
    }
}

//Funiones sobre Alarmas

//Peticion de alarmas
async function getAlarmas(userID){
    try {
        const alarmas = await ReglaAlarma.find({userID: userID});
        return alarmas;
    } catch (error) {
        console.log("Error al obtener las Alarmas");
        return false;
    }
}

//Funciones de borrado

//Borrado de Alarmas
async function borrarAlarmas(userID, dispID){
    try {
        const reglas= await ReglaAlarma.find({ userID: userID, dID: dispID})

        //Si hay alarmas las enocntramos y borramos una a una toda en EMQX
        if(reglas.length >0){
            asyncForEach(reglas, async regla => {
                const url = "http://localhost:8085/api/v4/rules/" + regla.emqxReglaID;
                const respuesta = await axios.delete(url, auth);
            });
            
            //borramos todas las alarmas en mongo
            await ReglaAlarma.deleteMany({ userID: userID, dID: dispID});
        }
        return true;
    } catch (error) {
        console.log("Error al borrar las Alarmas");
        console.log(error);
        return "error";
    }
}

//Borrado de credenciales MQTT
async function borrarMqttCredenciales(dispID){
    try {
        //borramos todas las credenciales en mongo
        await ReglaAlarma.deleteMany({ dID: dispID, tipo: "dispositivo"});

        return true;
    } catch (error) {
        console.log("Error al borrar las credenciales MQTT");
        console.log(error);
        return "error";
    }
}

// Funcion for ech asincrona fuente:
// thanks to Sebastien Chopin - Nuxt Creator :)
// https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404
async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

//export
module.exports = router;
