// requires
const express = require('express');
const router = express.Router();
const axios = require('axios');
const colors = require('colors');
const {checkAuth} = require('../middlewares/autenfificadortoken.js');



//Imports
import ReglaAlarma from '../modelos/emqxReglasAlarmas.js';
import ReglaGuardado from '../modelos/emqxReglaGuardado.js';


//Autentificacion para la API
const auth ={
    auth:{
        username: 'admin',
        password: 'emqxsecret'
    }
}


/* API */

//Crear una alarma
router.post('/reglaAlarma', checkAuth, async (req,res) => {

    //Constantes y variables
    var nuevaRegla=req.body.regla;
    nuevaRegla.userID = req.datosUsuarios._id;

    //Llamamos a la funcion crear Alarma
    var respuesta = await crearReglaAlarma(nuevaRegla);

    if (respuesta){
        const response ={
            status:"success"
        }
        return res.json(response);
    }else{
        const response ={
            status: "error",
        }
        return res.status(500).json(response);
    }
})

//Actualizar estado de una Alarma
router.put('/reglaAlarma', checkAuth, async (req,res) => {

    //Constantes y variables
    var nuevaRegla=req.body.regla;

    //Llamamos a la funcion crear Alarma
    var respuesta = await updateStatusAlarma(nuevaRegla.emqxReglaID, nuevaRegla.status);

    if (respuesta){
        const response ={
            status:"success"
        }
        return res.json(response);
    }else{
        const response ={
            status: "error",
        }
        return res.json(response);
    }
})


//Borrar una alarma
router.delete('/reglaAlarma', checkAuth, async (req,res) => {

    //Constantes y variables
    var emqxReglaID = req.query.emqxReglaID;

    //Llamamos a la funcion crear Alarma
    var respuesta = await borrarReglaAlarma(emqxReglaID);

    if (respuesta){
        const response ={
            status:"success"
        }
        return res.json(response);
    }else{
        const response ={
            status: "error",
        }
        return res.json(response);
    }
})



/* Funciones */

//Crerar una Alarma
async function crearReglaAlarma(nuevaAlarma){
    //Url de la api
    const url = "http://localhost:8085/api/v4/rules";

    //Contrucion del topic
    const topic= nuevaAlarma.userID + "/" + nuevaAlarma.dID + "/"+ nuevaAlarma.variable +"/sdata";
    console.log("ARLAM TOPIC");
    console.log(topic);
    //Sentencia SQL
    const rawsql= "SELECT username, topic, payload FROM \""+topic+"\" WHERE payload.value " + nuevaAlarma.condicion+" "+ nuevaAlarma.value + " AND is_not_null(payload.value)";
    //Objeto nueva Alarma
    var nuevaRegla = {
        rawsql: rawsql,
        actions: [{
            name: "data_to_webserver",
            params:{
                $resource: global.recursoAlarma.id,
                payload_tmpl: '{"userID":"'+nuevaAlarma.userID+'",payload":${payload},"topic":"${topic}"}'
            }
        }],
        description: "ALARMA - REGLA",
        enabled: nuevaAlarma.status
    };
    //Llamada a la API para guardar la regla en EMQX
    const respuesta =await axios.post(url, nuevaRegla, auth);
    
    console.log(respuesta.data);
    //Sacamos el ID de la regla
    var emqxReglaID = respuesta.data.data.id;

    console.log("SALIDA DESDE CREAR REGLA ALARMA");
    console.log(respuesta.data.data);

    if(respuesta.data.data && respuesta.status === 200){
        //Grabamos la Regla en Mongo
        const reglaMongo = await ReglaAlarma.create({
            userID: nuevaAlarma.userID ,
            dID: nuevaAlarma.dID ,
            
            emqxReglaID: emqxReglaID ,
            status:nuevaAlarma.status ,
            variableNombreCompleto: nuevaAlarma.variableNombreCompleto ,
            variable: nuevaAlarma.variable ,
            value: nuevaAlarma.value ,
            condicion: nuevaAlarma.condicion ,
            triggerTime: nuevaAlarma.triggerTime ,
            fechaCreacion: Date.now() 
        });
        //Modificamos el payload con los datos nuevos entrellos el ID 

        //Url de la api
        const url2 = "http://localhost:8085/api/v4/rules/"+ reglaMongo.emqxReglaID;

        //Nuevlo payload
        const payloadNuevo ='{"userID":"'+nuevaAlarma.userID+'","dID":"'+nuevaAlarma.dID +'","dNombre":"'+nuevaAlarma.dNombre + '","payload":${payload},"topic":"${topic}","emqxReglaID":"'+ reglaMongo.emqxReglaID+'","value":'+ nuevaAlarma.value+',"condicion":"'+ nuevaAlarma.condicion+'","variable":"'+ nuevaAlarma.variable+'","variableNombreCompleto":"'+ nuevaAlarma.variableNombreCompleto+'","triggerTime":'+ nuevaAlarma.triggerTime+ '}';
        console.log("payload nuevo************");
        console.log(payloadNuevo);
        //Modificamos el objeto
        nuevaRegla.actions[0].params.payload_tmpl=payloadNuevo;

        //Llamada a la API para guardar la regla en EMQX
        const respuesta =await axios.post(url, nuevaRegla, auth);

        console.log("¡La nueva Alarma a sido Creada!".green);

        return true;
    }

}

//Actualizar status Alarma
async function updateStatusAlarma(emqxReglaID, status){
    try {
        //Url de la api
        const url = "http://localhost:8085/api/v4/rules/"+emqxReglaID;

        //Objeto con el nuevo status
        const nuevaRegla ={enabled:status}

        //Llamada a la API de EMQX
        const respuesta = await axios.put(url, nuevaRegla, auth);

        if(respuesta.status === 200 && respuesta.data.data){
            //Actualizamos la regal en la BD
            await  ReglaAlarma.updateOne({emqxReglaID: emqxReglaID},{status:status})
            
            console.log("Se actuliazado el status de la regla".green);

            //Respuesta
            const toSend={
                status: "success",
                action: "update"
            };
            return toSend;
        }else{
            //REvisar#######
            console.log("Error al actualizar la regla de Alarma en EMQX");
            return false
        }

    } catch (error) {
        console.log("Error al actualizar el status de la Regla de Alarma");
        console.log(error);
    }
}

//Borrar una ALarma
async function borrarReglaAlarma(emqxReglaID){
    try {
        //Url de la api
        const url = "http://localhost:8085/api/v4/rules/"+ emqxReglaID;
        
        //Llamada a al API de EMQX
        const emqxRegla = await axios.delete(url, auth);
        console.log(emqxReglaID);
        //Llamada a la BD para borrar la regla
        const reglaborrada = await ReglaAlarma.deleteOne({emqxReglaID: emqxReglaID});
        console.log("BOORO LA REGLa");
        console.log(reglaborrada);
        //REVISAR SALIDA
        return true;

    } catch (error) {
        console.log("Error al borrar la Alarma");
        console.log(error);
        return false;
    }
}


//Exports
module.exports = router;