//Estados o variables
export const state = () => ({
    dispositivos: [],
    auth: null
})

//Mutaciones de los stores
export const mutations = {
    setAuth(state, authRecibido) {
        state.auth = authRecibido
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

    }
}



