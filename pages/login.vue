<template>
    <div class="container">
        <div class="col-lg-6 col-md-6 ml-md-auto mr-auto">
            <card class=" card-white">
                <template slot="header">
                    <!-- <img src="img//card-primary.png" alt="" /> -->
                    <h1 class="card-title text-dark text-center">AppIOT</h1>
                </template>

                <div>
                    <base-input
                        name="email"
                        v-model="usuario.email"
                        placeholder="Email"
                        addon-left-icon="fa fa-dark fa-envelope"
                        
                    ></base-input>

                    <base-input
                        name="password" v-model="usuario.password"
                        type="password" placeholder="Password"
                        addon-left-icon="fa fa-regular fa-key"
                    ></base-input>
                </div>

                <div slot="footer">
                    <base-button
                        native-type="submit" type="primary"
                        class="mb-3" size="lg"
                        @click="login()"
                        block
                    > Login </base-button>
                    <base-button
                        native-type="submit" type="secondary"
                        class="mb-3" size="sm"
                        block
                    > <nuxt-link class="text-white" to="/login">Registarse</nuxt-link> </base-button>
                    <!-- <div class="pull-left">
                        <h6>
                        <nuxt-link class="link footer-link" to="/login">
                            login
                        </nuxt-link>
                        </h6>
                    </div> -->

                    <!-- <div class="pull-right">
                        <h6><a href="#help!!!" class="link footer-link">Need Help?</a></h6>
                    </div> -->
                </div>
            </card>
        </div>
    </div>
</template>
    <script>
        export default {
            layout: "autentificacion",
            data() {
                return {
                usuario: {
                    email: "",
                    password: ""
                }
                };
            },
            methods: {
                login() {
                    this.$axios.post("/api/login", this.usuario)
                        .then((res) => {//Todo ha ido bien
                        
                        // console.log(res.data);
                        if (res.data.status == "success") {
                            this.$notify({
                                type: "success",
                                icon: "tim-icons icon-check-2",
                                message: "¡Te has logueado correctamene!"
                            });

                            //Persistencia del TOken
                            const auth = {
                                token: res.data.token,
                                datosUsuario: res.data.datosUsuario
                            }

                            //llamamos a la mutacion para guardar el token en la store
                            this.$store.commit('setAuth', auth);

                            //Guardamos en localStorage el token
                            localStorage.setItem('auth', JSON.stringify(auth));

                            //Redirección hacia la pagina principal
                            $nux.$router.push('/dashboard');

                            return;
                        }

                    })

                    .catch((error) => {
                        //console.log(error.response.data);
                        if (error.response.data.error.errors.email.kind == "unique") {
                            this.$$notify({ //si el mail ya existe
                                type: "danger",
                                icon: "tim-icons icon-alert-circle-exc",
                                message: "Hay un problema al registarte. El correo ya esta en uso."
                            })
                            return;
                        } else {//otro error
                            this.$$notify({
                                type: "danger",
                                icon: "tim-icons icon-alert-circle-exc",
                                message: "Hay un problema al registarte."
                            })
                            return;
                        }

                    })
                }
            }
        };
    </script>
    <style>
        .navbar-nav .nav-item p {
            line-height: inherit;
            margin-left: 5px;
        }
    </style>
