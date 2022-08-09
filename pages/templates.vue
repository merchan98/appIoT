<template>
    <div>
        <h2> Templates</h2>

        <iot-indicador></iot-indicador>
        <button @click="sendData()">Send</button>

    </div>
</template>

<script>
    export default{
        data(){
            return {
                value:false
            }
        },
        methods: {
            sendData(){
                this.value = !this.value;
                const toSend ={
                    value: this.value
                }
                this.$nuxt.$emit('widget-tipic', toSend);

            }
        }
    }
</script>
