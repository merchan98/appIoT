//Estados o variables
export const state = () => ({
    dispositivos: [],
    auth: null,
    dispositivoSeleccionado: {},
    notificaciones: []
})

//Mutaciones de los stores
export const mutations = {
    setAuth(state, authRecibido) {
        state.auth = authRecibido
    },
    setDispositivos(state, dispositivosEntrada) {
        state.dispositivos = dispositivosEntrada;
    },
    setDispositivoSeleccionado(state, dispositivo){
        state.dispositivoSeleccionado = dispositivo;
    },
    setNotificaciones(state, notificaciones){
        state.notificaciones= notificaciones;
    }
}

//Acciones
export const actions = {
    leerToken() {
        let auth = null;

        try {
            auth = JSON.parse(localStorage.getItem('auth'));
        } catch (error) {
            console.log(err);
        }
        
        //Guardamos el token en state
        this.commit('setAuth', auth)

    },
    getDispositivos() {
        //Cabecera
        const headerAxios = {
            headers: {
                token: this.state.auth.token
            }
        }

        // console.log(this.state.auth.token);

        this.$axios.get("/dispositivo", headerAxios)
            .then(res => {
                //Prueba
                // console.log("Salida GET Dispositvo desde store");
                // console.log(res.data.data);
                //Buscamos el seleccionado
                res.data.data.forEach((dispositivo, index) => {
                    if(dispositivo.seleccionado){ 
                        this.commit("setDispositivoSeleccionado", dispositivo)
                        //transmitimos el sispositvo seleccionado
                        $nuxt.$emit("dispositivoSelecionadoIndex", index)
                    }
                });
                
                this.commit("setDispositivos", res.data.data)
        })
    },
    getNotificaciones(){
        //Cabecera para la llamada
        const headerAxios = {
            headers: {
                token: this.state.auth.token
            }
        }

        //LLamada a ala api de notificaciones
        this.$axios.get("/notificaciones", headerAxios)
            .then(res => {
                //Prueba
                console.log("Salida GET notifiaciones desde store");
                console.log(res.data.data);
                //Actualizar notificaiones con el resultado
                this.commit("setNotificaciones", res.data.data)
            })
            .catch(error => {
                console.log(error);
            })
    }
}





