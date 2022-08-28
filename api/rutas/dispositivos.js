// requires
const express = require('express');
const router = express.Router();
const {checkAuth} = require('../middlewares/autenfificadortoken.js')

//Modelos
import Dispositivo from '../modelos/dispositivo.js';
    

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
// });


//peticion de dispostivos
router.get("/dispositivo", checkAuth, async (req, res) => {
    try {
        // console.log(req);
        //Constantes y variables
        const userID = req.datosUsuarios._id;
        
        //busqueda de dispostivos
        const dispositivos = await Dispositivo.find({ userID: userID });
        
        //Respuesta
        const toSend = {
            status: "Success",
            data: dispositivos
        };
        res.json(toSend);

    } catch (error) {
        console.log("Error Listado de Dispostivos");
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

        //Salida Prueba
        // console.log("SALIDA nuevoDispositvo POST");
        // console.log(nuevoDispositvo);

        //Añadimos los campos que faltan
        nuevoDispositvo.userID = userID;
        nuevoDispositvo.fechaCreacion = Date.now();

        //Creamos el dispostivo
        const dispositivo = await Dispositivo.create( nuevoDispositvo );

        //Seleccionamos el nuevo dispositivo
        seleccionarDispositivo(userID, nuevoDispositvo.dID);

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
        //Falta la funcion para seleccionar otro dispsitivo si el boorado esta select
        seleccionarDispositivoBorrado(userID, dispID);

        //Busqueda del que hay que eliminar
        //Se compueba que el dispostivo es del usuario tambien
        const resBorrado = await Dispositivo.deleteOne({ userID: userID, dID: dispID });

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
    //Constantes y variables
    const userID = req.datosUsuarios._id;
    const dispID = req.body.dID;

    if (seleccionarDispositivo(userID, dispID)) {
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
        console.log("HOLA desde SELECT DISPO Borradp");
        //Cojemos el dispositivo seleccionado
        const dispositivoRecibido = await Dispositivo.find({ userID: userIDrecib, dID: dispIDrecib });
        console.log(dispositivoRecibido[0].seleccionado);
        if (dispositivoRecibido[0].seleccionado) {
            //Cojemos 1 dipositivo
            const dispositivo = await Dispositivo.find({ userID: userIDrecib });
            console.log("DESNTRO DEL IF");
            console.log(dispositivo);
            //Ponemos 1 dispositivo en verdadero
            const result2 = await Dispositivo.updateOne({ dID: dispositivo[0].dID, userID: userIDrecib }, { seleccionado: true });
        }
        
    
        return true;
    } catch (error) {
        console.log("Error en la funcion seleccionarDispositivoBorrado");
        console.log(error);
        return false;
    }
    
}


//export
module.exports = router;



