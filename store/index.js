//Estados o variables
export const state = () => ({
    dispositivos: [],
    auth: null
})

//Mutaciones de los stores
export const mutations = {
    setAuth(state, authRecibido) {
        state.auth = authRecibido
    },
    serDispositivos(state, dispositivosEntrada) {
        state.dispositivos = dispositivosEntrada;
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
            const headerAxios = {
                headers: {
                    token: this.state.auth.token
                }
            }
            this.$axios.get("/api/dispositivo", headerAxios)
                .then(res => {
                    //Prueba
                    console.log("Salida GET Dispositvo desde store");
                    console.log(res.data.data);

                    this.commit("setDispostivos", res.data.data)
            })
        }
}





