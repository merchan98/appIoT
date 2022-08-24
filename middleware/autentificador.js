//Enviamos al usuario al login si no tiene token

export default function ({ store, redirect }) {
    //Ejecutamos la accion de ller el token
    store.dispatch("leerToken");

    //Si no tiene token lo mandamos al login
    if (!store.state.auth) {
        return redirect("/login");
    }

}





