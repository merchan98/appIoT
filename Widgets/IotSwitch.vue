<template>
    <card>
        <template slot="header">
            
            <h5 class="card-category">{{config.dispositivoSeleccionado.name}} - {{config.variableNombreCompleto}}</h5>
            <h3 class="card-title">
                <i class="fa " :class="[config.icono, getIconColorClass()]" aria-hidden="true" style="font-size: 30px;"></i>
                <base-switch @click="value = !value; enviarValor()" :value="value" type="primary"
                    on-text="ON" off-text="OFF" style="margin-top: 10px;" class="pull-right"></base-switch>
            </h3>
        </template>
    </card>
</template>

<script>
    export default {
        name: 'IotSwitch',
        props: ['config'],

        data(){
            return {
                value: true
            };
        },
        //Revisar si esto lo utilzia
        reloj: {
            config: {
                inmediato: true,
                deep: true,
                handler(){
                }
            }
        },
        
        methods:{
            getIconColorClass(){
                
                if(!this.value){
                    return "text-dark"
                }
                // if (this.config.class == "success"){
                //     return "text-success";
                // }
                // if(this.config.class == "primary"){
                //     return "text-primary";
                // }
                // if(this.config.class == "warning"){
                //     return "text-warning";
                // }
                // if(this.config.class == "danger"){
                //     return "text-danger";
                // }

                //version corta -TEST
                
                return `text-${this.config.class}`;
            },

            enviarValor(){
                const toSend ={
                    topic: this.config.userId + "/" + this.config.dispositivoSeleccionado.dID + "/" + this.config.variable.nombre + "/actdata",
                    msg: {
                        svalue: this.value//this.config.message
                    }
                };
                    console.log("Salida IOT Switch");
                    console.log(toSend);

                this.$nuxt.$emit('mqtt-sender', toSend);
            }
        }
    };
</script>





