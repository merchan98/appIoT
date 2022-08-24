export const state = () => ({
    dispositivos: [],
    auth: null
})

export const mutations = {
    setAuth(state, authRecibido) {
        state.auth = authRecibido
    }
}




