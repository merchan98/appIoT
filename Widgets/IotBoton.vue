<template>
    <card>
        <div slot="header">
            <h4 class="card-title">{{config.selectedDevice.name}} - {{config.variableFullName}}</h4>
        </div>

        <i class="fa " :class="[config.icon, getIconColorClass() ]" style="font-size: 30px "></i>

        <div class="row pull-right">
            <base-button @click="enviarValor()" type="primary" class="mb-3" size="lg">Añadir</base-button>
        </div>

    </card>
</template>

<script>

export default {
    props: ['config'],
    data(){
        return{
            value: TextTrackCueList,//false, //valor del icono
            enviado: false,
            // config:{
            //     userId: 'userid',
            //     selectedDevice: {
            //         name: "Hogar",
            //         dID: "9874",
            //         templateName: "Senores",
            //         templateID: "46468464",
            //         saverRule:false,
            //     },
            //     variableFullName: "Pump",
            //     variable: "ClaveUnicaString",
            //     icon: "fa-sun",
            //     column: 'col-6',
            //     widgetType: "indicator",
            //     class: 'danger',
            //     message: "{'fanstatus': 'stop'}"
            // }
        }
    },
    mounted(){
        //this.$nuxt.$on('widget-tipic', this.procesadoDatosRecibidos)
        const topic = this.config.userId + "/" + this.config.selectedDevice.dID + "/" + this.config.variable + "/actdata";
        
        this.$nuxt.$on(topic,this.procesadoDatosRecibidos);
    },
    deforeDestroy(){
        this.$nuxt.$off(this.config.userId + "/" + this.config.selectedDevice.dID + "/" + this.config.variable + "/actdata");
    },
    methods: {

        procesadoDatosRecibidos(data){
            console.log("Recibido");
            console.log(data);
            this.value = data.value;
        },
        enviarValor(){
            this.enviado = true;

            //truco para la maquetacion - Modificar para comprobar el estado real.
            setTimeout(() => {
                this.enviado=false;
            }, 1000)

            const toSend ={
                topic: this.config.userId + "/" + this.config.selectedDevice.dID + "/" + this.config.variable + "/actdata",
                msg: {
                    value: this.config.message
                }
            };

            console.log("Salida IOT Boton");
            console.log(toSend);

            this.$nuxt.$emit('mqtt-sender', toSend);
        },

        getIconColorClass(){
            if(!this.enviado){
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
        }
    }
}
</script>

