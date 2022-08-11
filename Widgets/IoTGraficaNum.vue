<template>
    <card type="chart">

        <template slot="header">
            <h5 class="card-category pull right">{{getTiempoRecibido((HoraActual -time)/1000)}}</h5>
            <h5 class="card-category">{{config.dispositvoSelecionado.name}} - {{config.variableFullName}}</h5>
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
                opcionesGrafico:{
                    creditos:{
                        enabled: false
                    },
                    Grafica: {
                        renderTo: 'container',
                        defaultSeriesType: 'line',
                        backgoundColor: 'rgba(1,1,1,1)',                    
                    },
                    titulo: {
                        texto: ""
                    },
                    xAxis: {
                        tipo: 'datetime',
                        labels: {
                            style: {
                                color: '#d4d2d3'
                            }
                        }
                    },
                    yAxis: {
                        titulo: {
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
                    plotOpciones: {
                        series:{
                            label: {
                                connectorAllowed: FileSystemHandle
                            },
                            pointStart: 2010
                        }
                    },
                    series: [{
                        nombre: '',
                        datos: [],
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
                                    layaout: 'hotizontal',
                                    aling:'center',
                                    verticalAling: 'bottom'
                                }
                            }
                        }]
                    }
                }

            };
        },
        reloj: {
            config: {
                inmediato: true,
                deep: true,
                handler(){
                    setTimeout(() => {
                        this.opcionesGrafico.series[0].name =this.config.variableFullName +" "+ this.config.unidad;
                        this.updateClassColor();
                        window.dispatchEvent(new Event('resize'));
                    }, 1000);
                }
            }
        },
        mounted() {
            const topic = this.config.userId + "/" + this.config.dispositvoSelecionado.dID + "/" + this.config.variable + "/sdata";
            this.$nuxt.$on(topic,this.procesadoDatosRecibidos);
            this.getTiempoActual();
            this.getChartData();
            this.updateClassColor();    
        },
        methods:{

            updateClassColor(){
                console.log("update"+ this.config.class);
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
                this.opcionesGrafico.series[0].name = this.config.variableFullName +" "+ this.config.unidad;
            },

            getChartData(){
                if(this.config.demo){
                    this.opcionesGrafico.series[0].data = [[1606659071668, 22], [1606659072668, 27], [1606659073668, 32], [1606659074668, 7]];
                    this.estaMontado =true;
                    return;
                }

                const axiosHeaders = {
                    headers: {
                        token: $nuxt.$store.state.auth.accessToken,
                    },
                    params: { dID: this.config.dispositvoSelecionado.dID, variable: this.config.variable,
                                charTimeAgo: this.config.chatTimeAgo}
                }
                this.$axios.get("/get-small-charts-data", axiosHeaders)
                    .then(res => {
                        const data = res.data.data;
                        console.log("Salida IOTGraficaNum 1");
                        console.log(res.data);

                        data.forEach(elemento => {
                            var aux=[];
                            aux.push(elemento.time + (new Date().getTimezoneOffset()*60*1000*(-1)));
                            aux.push(elemento.value);
                            this.opcionesGrafico.series[0].data.push(aux);
                        });

                        this.estaMontado=true;
                        return;
                    })
                    .catch(e =>{
                        console.log("Salida IoTGraficaNum 2");
                        console.log(e);
                        return;
                    });
            },

            getIconColorClass(){
                return `text-${this.config.class}`;
            },

            procesadoDatosRecibidos(data){
                this.time = Date.now();
                this.value = data.value;
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













