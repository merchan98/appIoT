//requires
const jwt = require('jsonwebtoken');

let checkAuth = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, "IoteESelmassegurodesdeel98", (error, decoded) => {
        //Token invalidp
        if (error) {
            return res.status(401).json({
                status: "error",
                error: error
            });
        }
        
        //Token valido y guardamos los datos del usuario
        req.datosUsuarios = decoded.datosUsuario;
        
        next();
    });
    

}

//Exports

module.exports ={checkAuth}






