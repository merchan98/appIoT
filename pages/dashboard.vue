<template>
    <div>
        <div class="row justify-content-between">
            <div><h2> DashBoard</h2></div>
        <br/>
            <div class="mr-2">
                <el-select class="select-success pull-right mr-2" placeholder="Selecionar Plantilla" v-model="plantillaSeleccionada">
                    <el-option v-for="(plantilla, index) in $store.state.plantillas" :value="plantilla" :label="plantilla.plantillaNombre" :key="plantilla._id"></el-option>
                </el-select>
            </div>
        </div>
        
        <!--Previsualizador Dashboard -->
        <!--el campo key es una variable unica que identifica al widget cojer el id cuandos e tenga la base de datos-->
        <div class="row" v-if="plantillaSeleccionada !=  null">
            <div v-for="(widget, index) in plantillaSeleccionada.widgets" :key="widget.index" :class="[widget.column]">
                <!-- {{widget.dispositivoSeleccionado}} -->
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
                plantillaSeleccionada: {}
            }
        },
        mounted(){
            this.$store.dispatch("getPlantillas");
        },
        methods:{
            completaWidgets(widget){
                //Constantes y variables
                let widgetCopia = JSON.parse(JSON.stringify(widget));
                
                //Pongos los datos correctos en el widgets
                widgetCopia.dispositivoSeleccionado.dID = widgetCopia.dispositivo.dID;
                widgetCopia.dispositivoSeleccionado.name = widgetCopia.dispositivo.nombre;
                widgetCopia.userID = widgetCopia.dispositivo.userID;

                console.log(widgetCopia.dispositivo.dID);
                if (widget.widget =="graficoNum"){
                    widgetCopia.demo = false;
                }
                
                return widgetCopia;
            }
        }

    }
</script>
