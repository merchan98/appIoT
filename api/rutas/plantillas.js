// requires
const express = require('express');
const router = express.Router();
const {checkAuth} = require('../middlewares/autenfificadortoken.js')

//Modelos
import Plantilla from '../modelos/plantilla.js';
import Dispositivo from '../modelos/dispositivo.js';

//Guardar Plantilla
router.post("/plantilla", checkAuth, async (req,res) =>{
    try { // Try-catch 36
        //Constantes y variables
        const userID = req.datosUsuarios._id;
        var nuevaPlantilla = req.body.plantilla;

        //Salida Prueba
        console.log("SALIDA nuevaPlantilla POST");
        console.log(nuevaPlantilla);

        //Añadimos los campos que faltan
        nuevaPlantilla.userID = userID;
        nuevaPlantilla.fechaCreacion = Date.now();

        //Creamos la plantilla
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
    try { // Try-catch 37
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
    try { // Try-catch 38
        //Constantes y variables
        const userID = req.datosUsuarios._id;
        const plantillaID = req.query.plantillaID

        //Comprobamsooq ue no tien dispositvos en uso
        const dispositivos = await Dispositivo.find({userID: userID, plantillaID: plantillaID});

        if(dispositivos.length > 0){
            const toSend={
                status: "fail",
                error: "Plantilla en uso"
            }
            return res.json(toSend);
        }

        
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
