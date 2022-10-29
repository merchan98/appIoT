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
import TipoDispositivo from '../modelos/tiposDispositvos.js';


//peticion de dispostivos
router.get("/tipodDispositivo", checkAuth, async (req, res) => {
    try {
        // console.log(req);
        //Constantes y variables
        const userID = req.datosUsuarios._id;
        
        //busqueda de dispostivos
        const dispositivos = await TipoDispositivo.find({});

        //Comvertimos a array el objeto dispositvos
        //var dispositivosArray= Object.assign({},dispositivos);
        var dispositivosArray = JSON.parse(JSON.stringify(dispositivos)); //Manera Ruda
        
        // console.log("LLEGO HASTA AQUI2");
        //Respuesta
        const toSend = {
            status: "success",
            data: dispositivosArray
        };
        res.json(toSend);

    } catch (error) {
        console.log("Error Listado de tipo del Dispostivos dispostivo.js");
        // console.log(error);

        const toSend = {
            status: "error",
            error: error
        };
        return res.status(500).json(toSend);
    }
});

//Creacion del dispostivos
router.post("/tipodDispositivo", checkAuth , async (req, res) => {
    try {
        //Constantes y variables
        // const userID = req.datosUsuarios._id;
        var nuevoDispositvo = req.body.nuevoTipoDispostivo;
        //console.log(nuevoDispositvo);
        //Salida Prueba
        // console.log("SALIDA nuevoDispositvo POST");
        // console.log(nuevoDispositvo);

        //Añadimos los campos que faltan
        // nuevoDispositvo.userID = userID;
        nuevoDispositvo.fechaCreacion = Date.now();

        //Verificamos que tiene variaables
        if(await verificaionVariables(nuevoDispositvo.variables)){
            //Creamos el dispostivo
            const dispositivo = await TipoDispositivo.create( nuevoDispositvo );
            console.log(dispositivo);

            //Respuesta
            const toSend = {
                status: "success"
            };
            return res.json(toSend);
        }else{
            //Respuesta
            console.log("Error en la verificacion de las variables");
            const toSend = {
                status: "error"
            };
            return res.json(toSend);
        }
        
        
    } catch (error) {
        console.log("Error creacion de nuevo tipo de dispostivo");
        console.log(error);

        const toSend = {
            status: "error",
            error: error
        };
        return res.status(500).json(toSend);
    }

});

//Borrado del Dispositvo
router.delete("/tipodDispositivo", checkAuth , async (req, res) => {
    
    try {
        //Constantes y variables
        // const userID = req.datosUsuarios._id;
        const tipDispID = req.TipoDispositivoID
        console.log(tipDispID);
        //const dispID = req.body.dispID//Si viene post
        // console.log(userID);
        // console.log(req.query.dispID);

        const dispositivos = await Dispositivo.find({tipoDispositivoID : tipDispID});
        
        console.log(dispositivos);
        if(dispositivos.length > 0){
            console.log("Error en el borrado: el tipo de dispostivo esta en uso");
            const toSend={
                status: "fail",
                error: "Tipo de dispositivo en uso"
            }
            return res.json(toSend);
        }


        //Busqueda del que hay que eliminar
        //Se compueba que el dispostivo es del usuario tambien
        const resBorrado = await TipoDispositivo.deleteOne({tipoDispositivoID : tipDispID});
        

        //Respuesta 
        const toSend = {
            status: "success",
            datos: resBorrado
        };
        return res.json(toSend);
    } catch (error) {
        console.log("Error Borrado del tipo de Dispostivo");
        console.log(error);

        const toSend = {
            status: "error",
            error: error
        };
        return res.status(500).json(toSend);
    }

});




//Funciones

async function  verificaionVariables(variables){
    try {
        //Constantes y variables
        let nombresVar={}
        console.log(variables);
        //Bucle comporbando cada objeto del array de variables
        variables.forEach(variable => {
            
            if (!variable.nombre) {
                return false;
            }else{ //Comprobamos qeu no se repetido
                let nombreVariable = variable.nombre;
                if(nombresVar.nombreVariable){
                    return false //Nombre repetido
                }else{
                    nombresVar.nombreVariable = 1;
                }
            }
            if (variable.tipo != "bool" || variable.tipo != "number" || variable.tipo != "other") {
                return false;
            }
            if (!isNaN(variable.tamBuffer)) {
                return false;
            }
            if (!variable.compWidgets) {
                return false;
            }
            if (!isNaN(variable.frecuencia)) {
                return false;
            }
        });
        return true;
    } catch (error) {
        console.log("Error en la funcion de comprobacion de variables");
        console.log(error);
    }
}


//export
module.exports = router;
