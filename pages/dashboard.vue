<template>
    <div>
        <h2> DashBoard</h2>
        <!--Previsualizador Dashboard -->
        <!--el campo key es una variable unica que identifica al widget cojer el id cuandos e tenga la base de datos-->
        <div class="row" v-if="$store.state.dispositivos.length > 0">
            <div v-for="(widget, index) in $store.state.dispositivoSeleccionado.plantilla.widgets" :key="widget.index" :class="[widget.column]">
                {{widget.dispositivoSeleccionado}}
                <IotBoton v-if="widget.widget == 'boton'" :config="completaWidgets(widget)"></IotBoton>
                <IotIndicador v-if="widget.widget == 'indicador'" :config="completaWidgets(widget)"></IotIndicador>
                <IoTGraficaNum v-if="widget.widget == 'graficoNum'" :config="completaWidgets(widget)"></IoTGraficaNum>
                <IotSwitch v-if="widget.widget== 'switch'" :config="completaWidgets(widget)"></IotSwitch>
            </div>
        </div>
        <!--FIN Previsualizador Dashboard -->
    </div>
</template>

<script>
    import IotBoton from '~/Widgets/IotBoton.vue';
    import IotIndicador from '~/Widgets/IotIndicador.vue';
    import {Table, TableColumn} from "element-ui";
    import {Select, Option} from 'element-ui';
    import BaseInput from '~/components/Inputs/BaseInput.vue';
    import IoTGraficaNum from '~/Widgets/IoTGraficaNum.vue';
    import IotSwitch from '~/Widgets/IotSwitch.vue';
        
    export default {
        middleware: 'autentificador',
        components: {
            BaseInput,
            [Select.name]: Select,
            [Table.name]: Table,
            [Option.name]: Option,
            [TableColumn.name]: TableColumn,
            IotBoton,
            IotIndicador,
            IoTGraficaNum,
            IotSwitch
        },
        name: 'Dashboard',
        data(){
            return{

            }
        },
        mounted(){

        },
        methods:{
            completaWidgets(widget){
                //Constantes y variables
                let widgetCopia = JSON.parse(JSON.stringify(widget));
                
                //Pongos los datos correctos en el widgets
                widgetCopia.dispositivoSeleccionado.dID = this.$store.state.dispositivoSeleccionado.dID;
                widgetCopia.dispositivoSeleccionado.nombre = this.$store.state.dispositivoSeleccionado.nombre;
                widgetCopia.userID = this.$store.state.dispositivoSeleccionado.userID;

                if (widget.widget =="graficoNum"){
                    widgetCopia.demo = false;
                }
                
                return widgetCopia;
            }
        }

    }
</script>
