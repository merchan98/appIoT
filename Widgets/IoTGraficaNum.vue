<template>
    <card type="chart">

        <template slot="header">
            <h5 class="card-category pull right">{{getTiempoRecibido((HoraActual -time)/1000)}}</h5>
            <h5 class="card-category">{{config.dispositivoSeleccionado.name}} - {{config.variableNombreCompleto}}</h5>
            <h3 class="card-title">
                <i class="fa " :class="[config.icono, getIconColorClass()]" aria-hidden="true" style="font-size: 30px;"></i>
                <span>{{value.toFixed(config.decimales)}} {{config.unidad}}</span>
            </h3>
        </template>

        <div class="chart-area" style="height: 300px">
            <highchart style="height: 100%" v-if="estaMontado" :options="opcionesGrafico"/>
        </div>

    </card>

</template>

<script>

    export default {
        name: "graficaNum",
        props: ['config'],
        data(){
            return{
                tiempoRecibido: 0,
                value: 0,
                time: Date.now(),
                HoraActual: Date.now(),
                estaMontado: false,
                topic: "",
                
                opcionesGrafico:{
                    credits:{
                        enabled: false
                    },
                    chart: {
                        renderTo: 'container',
                        defaultSeriesType: 'line',
                        backgoundColor: 'rgba(1,1,1,1)',                    
                    },
                    title: {
                        texto: ""
                    },
                    xAxis: {
                        type: 'datetime',
                        labels: {
                            style: {
                                color: '#d4d2d3'
                            }
                        }
                    },
                    yAxis: {
                        title: {
                            text: ""
                        },
                        labels: {
                            style: {
                                color: '#d4d2d3',
                                font: '10px Trebuchet MS, Verdana, sans-serif'
                            }
                        }
                    },
                    // Opciones de pintado de la grafica
                    plotOptions: {
                        series:{
                            label: {
                                connectorAllowed: FileSystemHandle
                            },
                            pointStart: 2010
                        }
                    },
                    series: [{
                        name: '',
                        data: [],
                        color: "#e14eca"
                    }],
                    legend: {
                        itemStyle: {
                            color: '#d4d2d3'
                        }
                    },
                    reponsive: {
                        rule:[{
                            condition: {
                                maxWidth: 500
                            },
                            chartOptions: {
                                legend: {
                                    layaout: 'horizontal',
                                    aling:'center',
                                    verticalAling: 'bottom'
                                }
                            }
                        }]
                    }
                }

            };
        },
        watch: {
            config: {
                inmediato: true,
                deep: true,
                handler(){
                    setTimeout(() => {
                        //PAra que al cmabio de dispositvio se cambia tb todo
                        //valor a 0
                        this.value = 0;
                        //Nos desubcribimos del topic antiguo
                        this.$nuxt.$off(this.topic + "/sdata");
                        //Nos subcribimos la nuevo
                        this.topic = this.config.userID + '/' + this.config.dispositivoSeleccionado.dID + '/' + this.config.variable.nombre;
                        this.$nuxt.$on(this.topic + "/sdata", this.procesadoDatosRecibidos);
                        //Recinciamos los datos de la tabal
                        this.opcionesGrafico.series[0].data = [];
                        //console.log(this.opcionesGrafico.series[0].data);
                        //Conseguimos los datos de nuevo dle servidor
                        this.getChartData();
                        console.log("Ya he llamado a get char data en el watch");
                        console.log(this.topic);

                        this.opcionesGrafico.series[0].name =this.config.variableNombreCompleto +" "+ this.config.unidad;
                        this.updateClassColor();
                        window.dispatchEvent(new Event('resize'));
                    }, 300);
                }
            }
        },
        mounted() {
            this.getTiempoActual();
            this.updateClassColor();    
        },
        beforeDestroy(){

            this.$nuxt.$off(this.topic,this.procesadoDatosRecibidos);
        },
        methods:{

            updateClassColor(){
                console.log("update"+ this.config.class);
                console.log(this.topic);
                //Primera recogida
                this.topic = this.config.userID + '/' + this.config.dispositivoSeleccionado.dID + '/' + this.config.variable.nombre;
                this.$nuxt.$on(this.topic + "/sdata", this.procesadoDatosRecibidos);
                //Recinciamos los datos de la tabal
                this.opcionesGrafico.series[0].data = [];
                //console.log(this.opcionesGrafico.series[0].data);
                //Conseguimos los datos de nuevo dle servidor
                this.getChartData();

                var c = this.config.class;

                if(c=="success") {
                    this.opcionesGrafico.series[0].color = "#00f2c3";
                }
                if(c=="primary") {
                    this.opcionesGrafico.series[0].color = "#e14eca";
                }
                if(c=="warning") {
                    this.opcionesGrafico.series[0].color = "#ff8d72";
                }
                if(c=="danger") {
                    this.opcionesGrafico.series[0].color = "#fd5d93";
                }
                this.opcionesGrafico.series[0].name = this.config.variableNombreCompleto +" "+ this.config.unidad;
                console.log("Fin del update Lass color");
            },

            getChartData(){
                if(this.config.demo){
                    this.opcionesGrafico.series[0].data = [[1606659071668, 22], [1606659072668, 27], [1606659073668, 32], [1606659074668, 7]];
                    this.estaMontado =true;
                    console.log("ESTE GRAF ES DEMO");
                    return;
                }
                console.log("ESTE GRAF NOOOOO ES DEMO");
                const axiosHeaders = {
                    headers: {
                        token: $nuxt.$store.state.auth.token, //CREO QUE ES UN ERROR
                    },
                    params: { 
                        dID: this.config.dispositivoSeleccionado.dID, 
                        variable: this.config.variable.nombre,
                        tablaTiempo: this.config.tablaTiempo
                    }
                }
                this.$axios.get("/get-small-charts-data", axiosHeaders)
                    .then(res => {
                        this.opcionesGrafico.series[0].data = [];
                        const data = res.data.data;
                        console.log("Salida IOTGraficaNum 1");
                        console.log(res.data);
                        // console.log(this.opcionesGrafico.series[0].data);
                        // let aux=[];
                        // aux.push(data[0].time + (new Date().getTimezoneOffset()*60*1000*(-1)));
                        // aux.push(data[0].value);
                        // this.opcionesGrafico.series[0].data.push(aux);
                        data.forEach(elemento => {
                            let aux=[];
                            aux.push(elemento.time + (new Date().getTimezoneOffset()*60*1000*(-1)));
                            aux.push(elemento.value);
                            this.opcionesGrafico.series[0].data.push(aux);
                        });
                        console.log(this.opcionesGrafico.series[0].data);
                        this.estaMontado=true;
                        // this.opcionesGrafico.series.push({name:'prueba',data:[], color: "#e166ca"})
                        // this.opcionesGrafico.series[1].data = [[Date.now(), 22], [Date.now()+10056, 27], [Date.now()+14665, 32], [Date.now()+25000, 7]];
                        return;
                    })
                    .catch(error =>{
                        console.log("Salida IoTGraficaNum 2");
                        console.log(error);
                        return;
                    });
            },

            getIconColorClass(){
                return `text-${this.config.class}`;
            },

            procesadoDatosRecibidos(data){
                try {
                    this.time = Date.now();
                    this.value = data.value;
                    //Para recargar si llegan nuevos datos (Retraso de 1 segundo por si acaso)
                    setTimeout(() =>{
                        if(data.save == 1){
                            this.getChartData();
                        }
                    },1000)
                } catch (error) {
                    console.log("Error en el procesado de datos Recibidos");
                    console.log(error);
                }
            },

            getTiempoActual(){
                this.HoraActual = Date.now();
                setTimeout(() =>{
                    this.getTiempoActual();
                }, 1000);
            },

            getTiempoRecibido(seconds){
                if(seconds<0){
                    seconds=0;
                }
                // REVISAR LOS IFS
                if(seconds < 59){ //if si es < de 1 min
                    return seconds.toFixed() + "sec";
                }else{
                    if(seconds <= 3600){ //if si es < 1 hora
                        seconds = seconds/60;
                        return seconds.toFixed()+"min";
                    }else{
                        if(seconds <= 86400){ //if si es < 1 dia
                            seconds = seconds/3600;
                            return seconds.toFixed()+"horas";
                        }else{
                            seconds = seconds / 86400;
                            return seconds.toFixed() + " day";
                        }
                    }
                }
                
            }
        }
    }
</script>
<style></style>













