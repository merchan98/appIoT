//requires
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

//Modelos
import Usuario from '../modelos/usuario.js';


//Autenticacion

router.post("/registro", async (req, res) => {
    try {
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

router.post("/login", async (req, res) => {
    //console.log(req.body);
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

});

//Manejo de usuarios
router.get('/nuevoUsuario', async (req, res) => {
    try {
        const usuario = await Usuario.create({
            nombre: "Jane",
            email: "shjasp@jas.com",
            password: "ho9las"
        });
        res.json({"status":"success"})
    } catch (error) {
        console.log(error);
        res.json({"status":"sucfailcess"})
    }
});


//export
module.exports = router;