//requires
const express = require('express');
const router = express.Router();
const axios = require('axios');
const colors = require('colors');
const { ids } = require('webpack');


//Autentificacion para la API
const auth ={
    auth:{
        username: 'admin',
        password: 'emqxsecret'
    }
}

//VAriables globales
global.recursoGuardado = null;
global.recursoAlarma = null;



//Listado de recursos EMQX
async function listarRecursos(){
    try { // Try-catch 34
        //Contantes
        const  recursoGuardado ={
            "type": "web_hook",
            "config": {
                url: "http://localhost:3001/api/guardar-webhook",
                headers: {
                    token : "121212" //PAra confirmar que lo enviamos notros, puede ser otro nombre
                },
                method : "POST"
            },
            description: "guardar-webhook"
        }

        const recursoAlarma ={
            "type": "web_hook",
            "config": {
                url: "http://localhost:3001/api/alarma-webhook",
                headers: {
                    token : "121212" //PAra confirmar que lo enviamos notros, puede ser otro nombre 
                },
                method : "POST"
            },
            description: "alarma-webhook"
        }
        //Url de la api
        const url = "http://localhost:8085/api/v4/resources/"
        //llamada a la api de emqx
        const respuesta = await axios.get(url, auth);

        //Si todo sale vien status 200
        if(respuesta.status === 200){
            //Si no hay ningun recurso
            if(respuesta.data.data.length == 0){
                console.log("No hay ningun recurso en emqx, procediendo a crearlos....\n");

                //Creacion Recurso Guardado
                crearRecurso(recursoGuardado)

                //Creacion Recurso Alarma
                crearRecurso(recursoAlarma)

            }else { // Buscamos los recursos
                
                respuesta.data.data.forEach(recurso => {
                    if(recurso.description == "alarma-webhook"){
                        global.recursoAlarma=recurso;

                        console.log("****Se ha encontrado el recurso de alrama*****\n");
                        console.log(recurso);
                    }

                    if(recurso.description == 'guardar-webhook'){
                        global.recursoGuardado=recurso;
                        
                        console.log("****Se ha encontrado el recurso de guardado*****\n");
                        console.log(recurso);

                    }
                });
                
                //Si no lo ha enocntrado Alarma lo creamos
                if(global.recursoAlarma === null){
                    crearRecurso(recursoAlarma)
                }
                //Si no lo ha enocntrado Guradado lo creamos
                if(global.recursoGuardado === null){
                    crearRecurso(recursoGuardado)
                }
                console.log(global.recursoAlarma);
            }
        }else{
            console.log("Error en la API EMQX");
            console.log(respuesta.status);
        }
    } catch (error) {
        console.log("Error al listar los recusos de EMQX");
        console.log(error);
    }
    
}

//Crear Recurso
async function crearRecurso(recursoNuevo){
    try { // Try-catch 35
        const url = "http://localhost:8085/api/v4/resources"

        //Comprobar que tenemos los campos necesarios 
        if(recursoNuevo.type == null){
            console.log("El campo \'type\' esta vacio o no existe");
            return
        }
        if(recursoNuevo.config.url == null && recursoNuevo.headers == null && recursoNuevo.method == null){
            console.log("El campo \'config\' esta vacio o no existe");
            return
        }
        if(recursoNuevo.description == null ){
            console.log("El campo \'descripcion\' esta vacio o no existe");
            return
        }

        //llamada a la API
        const respuesta = await axios.post(url, recursoNuevo, auth);

        //Todo OK == 200
        if (respuesta.status === 200){
            var fraseSalida = "¡Recurso Creado " + recursoNuevo.description +" !";
            console.log(fraseSalida.green);
        }
    } catch (error) {
        console.log("Error al crear el recurso");
        console.log(error);
    }
}


setTimeout(() => {
    listarRecursos();
}, 3000);



//export
module.exports =router; 