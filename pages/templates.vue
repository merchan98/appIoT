<template>
    <div>
        <h2> Templates</h2>
        <!-- 
        <iot-boton :config="configBoton"></iot-boton>
        <IotIndicador :config="config"></IotIndicador>
        <button @click="enviarDatos()">Send</button> -->

        <!--Configuracion Widgwts-->
        <card>
            <div slot="header">
                <h4 class="card-title">Widgets</h4>
            </div>

            <div class="row">
                <!--Selector y formulario-->
                <div class="col-6">
                    <!--Selector-->
                    <el-select v-model="widgetTipo" class="select-success" 
                        placeholder="Selecciona un Widget" style="width: 100%;">

                        <el-option class="text-dark" value="graficoNum" label="Grafico Num Input <-"></el-option>
                        <el-option class="text-dark" value="indicador" label="Indicador booleano Input <-"></el-option>
                        <el-option class="text-dark" value="switch" label="Switch Num Output ->"></el-option>
                        <el-option class="text-dark" value="boton" label="Boton Output ->"></el-option>

                    </el-select>
                    <br/>
                    
                    <!-- Formularios-->
                    <!-- Formularios tipo grafica-->
                    <div v-if="widgetTipo == 'graficoNum'">
                        <base-input v-model="ncConfig.variableFullName" label="Var Name" type="text"></base-input>
                        <base-input v-model="ncConfig.unidad" label="Unidad" type="text"></base-input>
                        <base-input v-model="ncConfig.icono" label="Icono" type="text"></base-input>
                        <base-input v-model="ncConfig.chartTimeAgo" label="Perido de tiempo" type="number"></base-input>
                    </div>

                    <!-- Formularios tipo switch-->
                    <div v-if="widgetTipo == 'switch'">
                        <base-input v-model="configSwitch.variableFullName" label="Var Name" type="text"></base-input>
                        <base-input v-model="configSwitch.icono" label="Icono" type="text"></base-input>
                        <br/>

                        <el-select v-model="configSwitch.class" class="select-success" placeholder="Selecciona una Clase" style="width 100%;">
                            <el-option class="text-success" value="success" label="Success"></el-option>
                            <el-option class="text-primary" value="primary" label="Primary" ></el-option> 
                            <el-option class="text-warning" value="warning" label="Warning" ></el-option>
                            <el-option class="text-danger"  value="danger"  label="Danger" ></el-option>
                        </el-select>

                        <br/>
                        <el-select v-model="configSwitch.column" class="select-success" placeholder="Selecciona el tam colum" style="width: 100%;"> 
                        <el-option class="text-dark" value="col-3" label="col-3" ></el-option>
                            <el-option class="text-dark" value="col-4" label="col-4" ></el-option>
                            <el-option class="text-dark" value="col-5" label="col-5" ></el-option>
                            <el-option class="text-dark" value="col-6" label="col-6" ></el-option>
                            <el-option class="text-dark" value="col-7" label="col-7" ></el-option>
                            <el-option class="text-dark" value="col-8" label="col-8" ></el-option>
                            <el-option class="text-dark" value="col-9" label="col-9" ></el-option>
                            <el-option class="text-dark" value="col-10" label="col-10" ></el-option>
                            <el-option class="text-dark" value="col-11" label="col-11" ></el-option>
                            <el-option class="text-dark" value="col-12" label="col-12" ></el-option>
                        </el-select>

                        <br/>
                    </div>

                    

                    <!-- Formularios tipo boton-->
                    <div v-if="widgetTipo == 'boton'">
                        <base-input v-model="configBoton2.variableFullName" label="Var Name" type="text"></base-input>
                        <base-input v-model="configBoton2.message" label="Mensage a enviar" type="text"></base-input>                        
                        <base-input v-model="configBoton2.text" label="Texto Boton" type="text"></base-input>
                        <base-input v-model="configBoton2.icono" label="Icono" type="text"></base-input>
                        
                        <br/>

                        <el-select v-model="configBoton2.class" class="select-success" placeholder="Selecciona una Clase" style="width 100%;">
                            <el-option class="text-success" value="success" label="Success"></el-option>
                            <el-option class="text-primary" value="primary" label="Primary" ></el-option> 
                            <el-option class="text-warning" value="warning" label="Warning" ></el-option>
                            <el-option class="text-danger"  value="danger"  label="Danger" ></el-option>
                        </el-select>

                        <br/>
                        <el-select v-model="configBoton2.column" class="select-success" placeholder="Selecciona el tam colum" style="width: 100%;"> <el-option class="text-dark" value="col-3" label="col-3" ></el-option>
                            <el-option class="text-dark" value="col-4" label="col-4" ></el-option>
                            <el-option class="text-dark" value="col-5" label="col-5" ></el-option>
                            <el-option class="text-dark" value="col-6" label="col-6" ></el-option>
                            <el-option class="text-dark" value="col-7" label="col-7" ></el-option>
                            <el-option class="text-dark" value="col-8" label="col-8" ></el-option>
                            <el-option class="text-dark" value="col-9" label="col-9" ></el-option>
                            <el-option class="text-dark" value="col-10" label="col-10" ></el-option>
                            <el-option class="text-dark" value="col-11" label="col-11" ></el-option>
                            <el-option class="text-dark" value="col-12" label="col-12" ></el-option>
                        </el-select>
                    </div>

                    <!-- Formularios tipo indicador-->
                    <div v-if="widgetTipo == 'indicador'">
                        <base-input v-model="configIndicador.variableFullName" label="Var Name" type="text"></base-input>
                        <base-input v-model="configIndicador.icono" label="Icono" type="text"></base-input>
                        <br/>

                        <el-select v-model="configIndicador.class" class="select-success" placeholder="Selecciona una Clase" style="width 100%;">
                            <el-option class="text-success" value="success" label="Success"></el-option>
                            <el-option class="text-primary" value="primary" label="Primary" ></el-option> 
                            <el-option class="text-warning" value="warning" label="Warning" ></el-option>
                            <el-option class="text-danger"  value="danger"  label="Danger" ></el-option>
                        </el-select>

                        <br/>
                        <el-select v-model="configIndicador.column" class="select-success" placeholder="Selecciona el tam colum" style="width: 100%;">
                            <el-option class="text-dark" value="col-3" label="col-3" ></el-option>
                            <el-option class="text-dark" value="col-4" label="col-4" ></el-option>
                            <el-option class="text-dark" value="col-5" label="col-5" ></el-option>
                            <el-option class="text-dark" value="col-6" label="col-6" ></el-option>
                            <el-option class="text-dark" value="col-7" label="col-7" ></el-option>
                            <el-option class="text-dark" value="col-8" label="col-8" ></el-option>
                            <el-option class="text-dark" value="col-9" label="col-9" ></el-option>
                            <el-option class="text-dark" value="col-10" label="col-10" ></el-option>
                            <el-option class="text-dark" value="col-11" label="col-11" ></el-option>
                            <el-option class="text-dark" value="col-12" label="col-12" ></el-option>
                        </el-select>

                        <br/>
                    </div>


                </div>

                <!-- Preview -->
                <div class="col-6">
                    <IotBoton v-if="widgetTipo == 'boton'" :config="configBoton2"></IotBoton>
                    <IotIndicador v-if="widgetTipo == 'indicador'" :config="configIndicador"></IotIndicador>
                    <IoTGraficaNum v-if="widgetTipo == 'graficoNum'" :config="ncConfig"></IoTGraficaNum>
                    <IotSwitch v-if="widgetTipo== 'switch'" :config="configSwitch"></IotSwitch>
                </div>

            </div>

            <!--Boton de Añadir-->
            <div class="row pull-right">
                <div class="cpl-12">
                    <base-button native-type="submit" @click="addNewWidget()" type="primary" class="mb-3" size="lg" >
                        Añadir Widget
                    </base-button>
                </div>
            </div>

            <!--Previsualizador Dashboard-->
            <!--el campo key es una variable unica que identifica al widget cojer el id cuandos e tenga la base de datos-->
            <div v-for="(widget, index) in widgets" :key="widget.variable" :class="[widget.column]">
                <i aria-hidden="true" class="fa fa-tash pull-right text-warning"
                    @click="deleteWidget(index)"
                    style="margin-bottom: 10px;"></i>
                
                <IotBoton v-if="widget.widget == 'boton'" :config="widget"></IotBoton>
                <IotIndicador v-if="widget.widget == 'indicador'" :config="widget"></IotIndicador>
                <IoTGraficaNum v-if="widget.widget == 'graficoNum'" :config="widget"></IoTGraficaNum>
                <IotSwitch v-if="widget.widget== 'switch'" :config="widget"></IotSwitch>

            </div>

        </card>

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



    export default{
    components: {
    IotBoton,
    IotIndicador,
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
        data(){
            return {
                widgets: [],
                templates: [],
                widgetTipo: "",
                templateName: "",
                templateDescipcion: "",

                ncConfig:{
                    userId: "EjemploUserId",
                    dispositvoSelecionado: {
                        name: "Casa",
                        dID: "49894"
                    },
                    variableFullName: "temperatura",
                    variable: "varname",
                    unidad: "Watios",
                    class: "success",
                    column: "col-12",
                    decimales: 2,
                    widget: "graficoNum",
                    icono: "fa-bath",
                    chartTimeAgo: 1566,
                    demo: true
                },
                configBoton2:{
                    userId: 'userid',
                    dispositvoSelecionado: {
                        name: "Hogar",
                        dID: "9874",
                    },
                    variableFullName: "Pump",
                    text: "send",
                    variable: "varname",
                    icono: "fa-sun",
                    column: 'col-6',
                    widget: "boton",
                    message: "{'fanstatus': 'stop'}"
                },
                configIndicador: {
                    userId: 'userid',
                    dispositvoSelecionado: {
                        name: "Hogar",
                        dID: "8674",
                    },
                    variableFullName: "Pump",
                    variable: "ClaveUnicaString",
                    icono: "fa-sun",
                    column: 'col-6',
                    widget: "indicador",
                    class: 'success'
                },
                configSwitch: {
                    userId: "userid",
                    dispositvoSelecionado: {
                        name: "Granja",
                        dID: "9798"
                    },
                    variableFullName: "Bombilla",
                    variable: "varname",
                    class: "danger",
                    widget: "switch",
                    icono: "fa-bath",
                    column: "col-6"
                },

                //Pruebas de maquetacion widgets
                // value:false,

                // configBoton:{
                //     userId: 'userid',
                //     dispositvoSelecionado: {
                //         name: "Hogar",
                //         dID: "9874",
                //         templateName: "Senores",
                //         templateID: "46468464",
                //         saverRule:false,
                //     },
                //     variableFullName: "Pump",
                //     variable: "ClaveUnicaString",
                //     icono: "fa-sun",
                //     column: 'col-6',
                //     widgetTipo: "indicator",
                //     class: 'danger',
                //     message: "{'fanstatus': 'stop'}"
                // } ,
                // config: {
                //     userId: 'userid',
                //     dispositvoSelecionado: {
                //         name: "Hogar",
                //         dID: "9874",
                //         templateName: "Senores",
                //         templateID: "46468464",
                //         saverRule:false,
                //     },
                //     variableFullName: "Pump",
                //     variable: "ClaveUnicaString",
                //     icono: "fa-sun",
                //     column: 'col-6',
                //     widgetTipo: "indicator",
                //     class: 'danger'
                // }
                //FIN Pruegas maquetacion widgets

            }
        },
        methods: {
            addNewWidget(){
                if(this.widgetTipo == "indicador"){
                    this.configIndicador.variable = this.realizarID(13);
                    this.widgets.push(JSON.parse(JSON.stringify(this.configIndicador)));
                }
                if(this.widgetTipo == "boton"){
                    this.configBoton2.variable = this.realizarID(13);
                    this.widgets.push(JSON.parse(JSON.stringify(this.configBoton2)));
                }
                if(this.widgetTipo == "switch"){
                    this.configSwitch.variable = this.realizarID(13);
                    this.widgets.push(JSON.parse(JSON.stringify(this.configSwitch)));
                }
                if(this.widgetTipo == "graficoNum"){
                    this.ncConfig.variable = this.realizarID(13);
                    this.widgets.push(JSON.parse(JSON.stringify(this.ncConfig)));
                }
            },
            //Fundicon de Prueba mirar el hash para hacer esto.
            realizarID(longitud){
                var cadena="";
                var caracteres="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!·$%&";
                for (var i=0;i<longitud;i++){
                    cadena += cadena.charAt(Math.floor(Math.random()*caracteres.length));
                }
                return cadena;
            },
            borarWidgetPreview(){
                this.widgets.splice(index, 1);
            },
            //Pruebas de maquetacion widgets
            enviarDatos(){
                this.value = !this.value;
                const toSend ={
                    value: this.value
                }
                this.$nuxt.$emit('userid/9874/ClaveUnicaString/adata', toSend);
            }
            //FIN Pruegas maquetacion widgets
        }
    }
</script>
