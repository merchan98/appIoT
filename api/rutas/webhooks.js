//requires
const express = require('express');
const router = express.Router();
const axios = require('axios');
const colors = require('colors');
var mqtt= require('mqtt');

import { checkAuth } from "../middlewares/autenfificadortoken";

//imports
import DatosDispositivo from "../modelos/dataDispositvos";
import Dispositivo from "../modelos/dispositivo";
import ReglaAlarma from "../modelos/reglasAlarmas";
import Notificacion from "../modelos/notificacion";


//Guardar datos
router.post('/guardar-webhook', async(req, res) => {
    try { // Try-catch 45
        //Por si no ha ahcertado el token de seguridad
        if(req.headers.token != "121212"){
            //Respondemos con un 404 por seguridad
            res.sendStatus(404);
            return;
        }
        
        //Obtencion de datos
        const data = req.body;
        console.log(data.topic.split("/"));
        const splitTopic = data.topic.split("/");
        const dID = splitTopic[1];
        const variable = splitTopic[2];
        
        var resultadoBusqueda = await Dispositivo.find({dID: dID, userID: data.userID})
        console.log("YA esta guardado");
        //Creacion del dato
        if(resultadoBusqueda.length == 1){
            DatosDispositivo.create({
                userID: data.userID,
                dID: dID,
                variable: variable,
                value: data.payload.value,
                time: Date.now()
            })
            console.log("Datos del diospositivos creados");
        }
        
        //Respuesta
        console.log(data);
        res.sendStatus(200);

    } catch (error) {
        console.log(error);
        res.sendStatus(200); //Medida de seguridad por si se acierta el token
    }
    


    // console.log(data.m);
    // res.json("{]");
});

//Alarmas
router.post('/alarma-webhook', async(req, res) => {
    try { // Try-catch 46
        //Por si no ha ahcertado el token de seguridad ((FALLA REVISAR)) 
        // console.log("HOLAAAA deade el webhoock");
        if(req.headers.token != "121212"){
            //Respondemos con un 404 por seguridad
            res.sendStatus(404);
            return;
        }

        //Para poder liberar la conexion con emqx
        res.sendStatus(200);
        // console.log("DESDE wl web despues de dar la trespuesta");
        console.log(req.body);
        //Constantes y variables
        const alarmaEntrante = req.body;
        console.log("Alarma entrante");
        console.log(alarmaEntrante);

        //Actualizamos el contador de alarma
        actualizarAlarmaContador(alarmaEntrante.emqxReglaID);

        //Ultima notificacion
        const ultimaNotif= await Notificacion.find({dID: alarmaEntrante.dID, emqxReglaID: alarmaEntrante.emqxReglaID}).sort({time: -1}).limit(1);
        // console.log("HOLAAAA");
        if(ultimaNotif == 0){
            console.log("Primera Alarma");
            guardarNotificacionMongo(alarmaEntrante);
            enviarMqttNotif(alarmaEntrante);

        }else{
            //Saber si a superado el umbral para volver a grabar la notificacion
            const ultimaNotifActualMinutos =(Date.now() - ultimaNotif[0].fecha) /1000 /60;
            
            if(ultimaNotifActualMinutos > alarmaEntrante.triggerTime){
                console.log("Umbral superado");
                guardarNotificacionMongo(alarmaEntrante);
                enviarMqttNotif(alarmaEntrante);

            }
        }
        
        console.log(alarmaEntrante);
        
    } catch (error) {
        console.log(error);
        res.sendStatus(200); //Medida de seguridad por si se acierta el token
    }
});

/* NOTIFICACIONES */

//Obtener Las notificaciones
router.get("/notificaciones", checkAuth, async(req, res) => {
    try { // Try-catch 47
        //Contstes y variables
        
        const userID=req.datosUsuarios._id;

        //LLamada a la funcion para conseguir la notificacion;
        const notificaciones = await getNotficaciones(userID);

        //Creacion de la respuesta
        const toSend = {
            status: "success",
            data: notificaciones
        }
        res.json(toSend);

    } catch (error) {
        console.log("Error al obtener las notificaciones");
        console.log(error);

         //Creacion de la respuesta
        const toSend = {
            status: "error",
            error: error
        };

        return res.status(500).json(toSend)
    }
})

//Actualizar el estado de las notificaciones
router.put("/notificaciones", checkAuth, async(req, res) => {
    try { // Try-catch 48
        //Contstes y variables
        const userID=req.datosUsuarios._id;
        const notificacionID = req.body.notificacionID;
        
        //LLamada a mongo para actualizar el estado de la notificacion
        const respuesta = await Notificacion.updateOne({userID: userID, _id: notificacionID},{leido: true});
        console.log(respuesta);
        //Creacion de la respuesta
        const toSend = {
            status: "success",
        }
        res.json(toSend);

    } catch (error) {
        console.log("Error al actualizar el estado de la notificacion");
        console.log(error);

         //Creacion de la respuesta
        const toSend = {
            status: "error",
            error: error
        };

        return res.status(500).json(toSend)
    }
})





/* FUNCIONES */

//Guardar al notificacion el mongo
function guardarNotificacionMongo(alarmaEntrante){
    try { // Try-catch 49
        console.log("Guardar Notificacion");
        console.log(alarmaEntrante);
        var nuevaNotificaicon = alarmaEntrante;
        nuevaNotificaicon.fecha = Date.now();
        nuevaNotificaicon.leido = false;
        Notificacion.create(nuevaNotificaicon);
    } catch (error) {
        console.log("Error al guardar al notificacion"); 
        console.log(error);
    }
}

//Actualizar el contador de notficaciones
async function actualizarAlarmaContador(emqxReglaID){
    try { // Try-catch 50
        //Llamada a mongo
        await ReglaAlarma.updateOne({emqxReglaID: emqxReglaID},{$inc:{counter:1}})
    } catch (error) {
        console.log("Error al actualizar el contador de alarma");
        console.log(error);
    }
}

//Conseguir todas las notificaiones no leidas
async function getNotficaciones(userID){
    try{ // Try-catch 51
        //LLamada a mongo para ocnseguir todas las notificaciones del usuario con el leido a false
        const respuesta = await Notificacion.find({userID: userID, leido: false});
        return respuesta;
    }catch{
        console.log("Error al conseguir la Notificaiones funci");
        console.log(error);
        return false;
    }
}



/* MQTT */

//Variables
var client;

//Empezar conexion con MQTT
function startMqttClient(){
    const option = {
        port: 1883,
        host: 'localhost',
        clientId: 'webhook_superuser' + Math.round(Math.random()*(1-10000) * -1),
        username: 'superuser',
        password: 'superuser',
        keepalive: 60,
        reconnectPeriod: 5000,
        protocolId: 'MQIsdp',
        protocolVersion: 3,
        clean: true,
        encoding: 'utf8'
    }

    client = mqtt.connect('mqtt://' + 'localhost', option);

    client.on('connect', function() {
        console.log("MQTT CONEXION -> SUCCESS; \n".green);
        // client.subscribe('6307a7735554dfba876f7d01/as/as/sdata', { qos:0 }, error =>{
        //     if(error){
        //         console.log("Error al subcibirse al topic del Dispositivo");
        //         console.log(error);
        //         return;
        //     }
        //     // this.client.publish(topicDispositivo,'hello');
        //     console.log("Conexion correcta con el topic del Dispositivo");
        //     // console.log(topicDispositivo);
        //     return 0;
        // });
        // console.log(respu);
    });
    client.on('reconnect', error => {
        console.log("RECONECTANDO \n".green);
        console.log(error);
    });
    client.on('error', error => {
        console.log("MQTT CONEXION -> FAIL; \n".red);
        console.log(error);
    });
    client.on('message', function (topic, message) {
        console.log("Menseje desde el topic"+ topic +" => ");
        console.log(message.toString()); 
    });
};

//Enviar notificacion Mqtt
function enviarMqttNotif(notif){
    console.log("Envio notificacio");
    const topic = notif.userID + '/dummy-dID/dummy-var/notif';
    const msg = 'La regla: cuando '+ notif.variable + ' es ' + notif.condicion + ' que ' + notif.value;
    client.publish(topic, msg);
}

setTimeout(() => {
    startMqttClient();
}, 4000);


//export
module.exports =router; 