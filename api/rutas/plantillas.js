// requires
const express = require('express');
const router = express.Router();
const {checkAuth} = require('../middlewares/autenfificadortoken.js')

//Modelos
import Plantilla from '../modelos/plantilla.js';

//Guardar Plantilla
router.post("/plantilla", checkAuth, async (req,res) =>{
    try {
        //Constantes y variables
        const userID = req.datosUsuarios._id;
        var nuevaPlantilla = req.body.plantilla;

        //Salida Prueba
        console.log("SALIDA nuevaPlantilla POST");
        console.log(nuevaPlantilla);

        //Añadimos los campos que faltan
        nuevaPlantilla.userID = userID;
        nuevaPlantilla.fechaCreacion = Date.now();

        //Creamos el dispostivo
        const plantilla = await Plantilla.create( nuevaPlantilla );

        //Respuesta
        const toSend = {
            status: "success"
        };

        return res.json(toSend);
    } catch (error) {
        console.log("Error creacion de nueva plantilla");
        console.log(error);

        const toSend = {
            status: "error",
            error: error
        };
        return res.status(500).json(toSend);
    }
})

//Conseguir todas las plantillas
router.get("/plantilla", checkAuth, async (req,res) =>{
    try {
        // console.log(req);
        //Constantes y variables
        const userID = req.datosUsuarios._id;
        
        //busqueda de dispostivos
        const plantillas = await Plantilla.find({ userID: userID });
        
        //Respuesta
        const toSend = {
            status: "success",
            data: plantillas
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
})

//Borrar plantillas
router.delete("/plantilla", checkAuth, async(req,res) =>{
    try {
        //Constantes y variables
        const userID = req.datosUsuarios._id;
        const plantillaID = req.query.plantillaID
        
        //Busqueda del que hay que eliminar
        //Se compueba que el dispostivo es del usuario tambien
        const resBorrado = await Plantilla.deleteOne({ userID: userID, _id: plantillaID });

        //Respuesta (Añadir info del dipostivo borrado en el futuro)
        const toSend = {
            status: "success",
            datos: resBorrado
        };
        return res.json(toSend);

    } catch (error) {
        console.log("Error Borrado de Plantilla");
        console.log(error);

        const toSend = {
            status: "error",
            error: error
        };
        return res.status(500).json(toSend);
    }
})

//export
module.exports = router;
