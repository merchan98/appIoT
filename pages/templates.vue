<template>
    <div>
        <h2> Templates</h2>

        <iot-boton :config="configBoton"></iot-boton>
        <IotIndicador :config="config"></IotIndicador>
        <button @click="sendData()">Send</button>

    </div>
</template>

<script>
import IotBoton from '~/Widgets/IotBoton.vue';
import IotIndicador from '~/Widgets/IotIndicador.vue';
    export default{
    components: { IotBoton, IotIndicador },
        data(){
            return {
                value:false,

                configBoton:{
                    userId: 'userid',
                    selectedDevice: {
                        name: "Hogar",
                        dID: "9874",
                        templateName: "Senores",
                        templateID: "46468464",
                        saverRule:false,
                    },
                    variableFullName: "Pump",
                    variable: "ClaveUnicaString",
                    icon: "fa-sun",
                    column: 'col-6',
                    widgetType: "indicator",
                    class: 'danger',
                    message: "{'fanstatus': 'stop'}"
                } ,
                config: {
                    userId: 'userid',
                    selectedDevice: {
                        name: "Hogar",
                        dID: "9874",
                        templateName: "Senores",
                        templateID: "46468464",
                        saverRule:false,
                    },
                    variableFullName: "Pump",
                    variable: "ClaveUnicaString",
                    icon: "fa-sun",
                    column: 'col-6',
                    widgetType: "indicator",
                    class: 'danger'
                }
            }
        },
        methods: {
            sendData(){
                this.value = !this.value;
                const toSend ={
                    value: this.value
                }
                this.$nuxt.$emit('userid/9874/ClaveUnicaString/adata', toSend);

            }
        }
    }
</script>
