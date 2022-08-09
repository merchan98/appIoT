<template>
    <card>
        <div slot="header">
            <h4 class="card-title">{{config.selectedDevice.name}} - {{config.variableFullName}}</h4>
        </div>

        <i class="fa " :class="[config.icon, getIconColorClass() ]" style="font-size: 30px "></i>
    </card>
</template>

<script>

export default {
    props: ['config'],
    data(){
        return{
            value: TextTrackCueList//false, //valor del icono
            // config: {
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
            //     class: 'danger'
            // }
        }
    },
    mounted(){
        //this.$nuxt.$on('widget-tipic', this.procesadoDatosRecibidos)
        const topic = this.config.userId + "/" + this.config.selectedDevice.dID + "/" + this.config.variable + "/adata";
        
        console.log("Salida de IOTIndicador");
        console.log(topic);

        this.$nuxt.$on(topic,this.procesadoDatosRecibidos)
    },
    beforeDestroy(){
        // Para que la subcion al topico se destruya ya que 
        // el mounted se ejecuta cada vez que visitas la pagina
        this.$nuxt.$off(this.config.userId + "/" + this.config.selectedDevice.dID + "/" + this.config.variable + "/adata");
    },
    methods: {

        procesadoDatosRecibidos(data){
            console.log("Recibido IoTIndicator");
            console.log(data);
            this.value = data.value;
        },

        getIconColorClass(){
            if(!this.value){
                return "text-dark"
            }
            if (this.config.class == "success"){
                return "text-success";
            }
            if(this.config.class == "primary"){
                return "text-primary";
            }
            if(this.config.class == "warning"){
                return "text-warning";
            }
            if(this.config.class == "danger"){
                return "text-danger";
            }

            //version corta -TEST
            // return `text-${this.config.class}`;
        }
    }
}
</script>

