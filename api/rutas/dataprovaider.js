// requires
const express = require('express');
const router = express.Router();
const {checkAuth} = require('../middlewares/autenfificadortoken.js')

//Modelos
import DatosDispositivo from '../modelos/dataDispositvos';


//Conseguir datos para la tabla
router.get("/get-small-charts-data", checkAuth, async (req,res) =>{
    try {// Try-catch 17
        
        //Constantes y variables
        const userID = req.datosUsuarios._id;
        const tablaTiempo = req.query.tablaTiempo;
        const dID = req.query.dID;
        const variable = req.query.variable;

        //Pasamos el tiempo de creacion de tabla a ms
        const tiempopasadoms = Date.now() - (tablaTiempo * 60 * 1000);
        console.log();
        //busqueda de dispostivos
        const datos = await DatosDispositivo.find({ userID: userID, dID: dID, variable: variable, "time": {$gt: tiempopasadoms} }).sort({"time": 1});
        console.log(datos);
        
        //Respuesta
        const toSend = {
            status: "success",
            data: datos
        };
        return res.json(toSend);

    } catch (error) {
        console.log("Error al obtener los datos de los dispositivos");
        // console.log(error);

        const toSend = {
            status: "error",
            error: error
        };
        return res.status(500).json(toSend);
    }
})


//export
module.exports = router;
