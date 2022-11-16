<template>
    <div>
        <h2> Plantillas</h2>
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
                        <base-input v-model="ncConfig.variableNombreCompleto" label="Var Name" type="text"></base-input>
                        <base-input v-model="ncConfig.unidad" label="Unidad" type="text"></base-input>
                        <base-input v-model="ncConfig.icono" label="Icono" type="text"></base-input>
                        
                        <label>Clase icono</label>
                        <el-select v-model="ncConfig.class" class="select-success" label="Clase icono" placeholder="Selecciona una Clase" style="width: 100%;" >
                            <el-option class="text-success" value="success" label="Success"></el-option>
                            <el-option class="text-primary" value="primary" label="Primary"></el-option> 
                            <el-option class="text-warning" value="warning" label="Warning"></el-option>
                            <el-option class="text-danger"  value="danger"  label="Danger"></el-option>
                        </el-select>

                        <br/><br/>
                        
                        <label>Tamaño columna</label>
                        <el-select v-model="ncConfig.column" class="select-success" label="Tamaño Columna" placeholder="Selecciona el tam colum" style="width: 100%;"> 
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
                        

                        <br/><br/>

                        <label>Dispostivo</label>
                        <base-input>
                            <el-select v-model="ncConfig.dispositivo" label="TipoDispostivos" placeholder="Selecciona el dispostivo" class="select-primary">
                                <el-option v-for="(dispositivo, index) in $store.state.dispositivos" class="text-dark" :value="dispositivo" :key="dispositivo._id"  :label="dispositivo.nombre"></el-option>
                            </el-select>
                        </base-input>


                        <label v-if="ncConfig.dispositivo  !=  null">Variable</label>
                        <!-- {{ $store.state.dispositivos[ncConfig.dispositivo].tipoDispositivo.variables}} -->
                        <base-input v-if="ncConfig.dispositivo  !=  null">
                            <el-select v-model="ncConfig.variable" label="TipoDispostivos" placeholder="Selecciona el dispostivo" class="select-primary">
                                <el-option v-for="(widget, index) in ncConfig.dispositivo.tipoDispositivo.variables " class="text-dark" :value="widget" :key="widget._id"  :label="widget.nombre"></el-option>
                            </el-select>
                        </base-input>

                    </div>

                    <!-- Formularios tipo switch-->
                    <div v-if="widgetTipo == 'switch'">
                        <base-input v-model="configSwitch.variableNombreCompleto" label="Var Name" type="text"></base-input>
                        <base-input v-model="configSwitch.icono" label="Icono" type="text"></base-input>
                        
                        <label>Clase icono</label>
                        <el-select v-model="configSwitch.class" class="select-success" label="Clase icono" placeholder="Selecciona una Clase" style="width: 100%;" >
                            <el-option class="text-success" value="success" label="Success"></el-option>
                            <el-option class="text-primary" value="primary" label="Primary"></el-option> 
                            <el-option class="text-warning" value="warning" label="Warning"></el-option>
                            <el-option class="text-danger"  value="danger"  label="Danger"></el-option>
                        </el-select>

                        <br/><br/>
                        
                        <label>Tamaño columna</label>
                        <el-select v-model="configSwitch.column" class="select-success" label="Tamaño Columna" placeholder="Selecciona el tam colum" style="width: 100%;"> 
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
                        <br/>

                        <label>Dispostivo</label>
                        <base-input>
                            <el-select v-model="configSwitch.dispositivo" label="TipoDispostivos" placeholder="Selecciona el dispostivo" class="select-primary">
                                <el-option v-for="(dispositivo, index) in $store.state.dispositivos" class="text-dark" :value="dispositivo" :key="dispositivo._id"  :label="dispositivo.nombre"></el-option>
                            </el-select>
                        </base-input>

                        <label v-if="configSwitch.dispositivo  !=  null">Variable</label>
                        <!-- {{ $store.state.dispositivos[configSwitch.dispositivo].tipoDispositivo.variables}} -->
                        <base-input v-if="configSwitch.dispositivo  !=  null">
                            <el-select v-model="configSwitch.variable" label="TipoDispostivos" placeholder="Selecciona el dispostivo" class="select-primary">
                                <el-option v-for="(widget, index) in configSwitch.dispositivo.tipoDispositivo.variables " class="text-dark" :value="widget" :key="widget._id"  :label="widget.nombre"></el-option>
                            </el-select>
                        </base-input>
                    </div>

                    

                    <!-- Formularios tipo boton-->
                    <div v-if="widgetTipo == 'boton'">
                        <base-input v-model="configBoton2.variableNombreCompleto" label="Var Name" type="text"></base-input>
                        <base-input v-model="configBoton2.message" label="Mensage a enviar" type="text"></base-input>                        
                        <base-input v-model="configBoton2.text" label="Texto Boton" type="text"></base-input>
                        <base-input v-model="configBoton2.icono" label="Icono" type="text"></base-input>
                        
                        

                        <label>Clase icono</label>
                        <br/>
                        <el-select v-model="configBoton2.class" label="Clase icono" class="select-success" placeholder="Selecciona una Clase" style="width 100%;">
                            <el-option class="text-success" value="success" label="Success"></el-option>
                            <el-option class="text-primary" value="primary" label="Primary" ></el-option> 
                            <el-option class="text-warning" value="warning" label="Warning" ></el-option>
                            <el-option class="text-danger"  value="danger"  label="Danger" ></el-option>
                        </el-select>

                        <br/><br/>

                        <label>Tamaño columna</label>
                        <el-select v-model="configBoton2.column" label="Tamaño Columna" class="select-success" placeholder="Selecciona el tam colum" style="width: 100%;"> <el-option class="text-dark" value="col-3" label="col-3" ></el-option>
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

                        <br/><br/>

                        <label>Dispostivo</label>
                        <base-input>
                            <el-select v-model="configBoton2.dispositivo" label="TipoDispostivos" placeholder="Selecciona el dispostivo" class="select-primary">
                                <el-option v-for="(dispositivo, index) in $store.state.dispositivos" class="text-dark" :value="dispositivo" :key="dispositivo._id"  :label="dispositivo.nombre"></el-option>
                            </el-select>
                        </base-input>

                        <label v-if="configBoton2.dispositivo  !=  null">Variable</label>
                        <!-- {{ $store.state.dispositivos[configBoton2.dispositivo].tipoDispositivo.variables}} -->
                        <base-input v-if="configBoton2.dispositivo  !=  null">
                            <el-select v-model="configBoton2.variable" label="TipoDispostivos" placeholder="Selecciona el dispostivo" class="select-primary">
                                <el-option v-for="(widget, index) in configBoton2.dispositivo.tipoDispositivo.variables " class="text-dark" :value="widget" :key="widget._id"  :label="widget.nombre"></el-option>
                            </el-select>
                        </base-input>

                    </div>

                    <!-- Formularios tipo indicador-->
                    <div v-if="widgetTipo == 'indicador'">
                        <base-input v-model="configIndicador.variableNombreCompleto" label="Var Name" type="text"></base-input>
                        <base-input v-model="configIndicador.icono" label="Icono" type="text"></base-input>

                        <label>Clase icono</label>
                        <br/>
                        <el-select v-model="configIndicador.class" class="select-success" placeholder="Selecciona una Clase" style="width 100%;">
                            <el-option class="text-success" value="success" label="Success"></el-option>
                            <el-option class="text-primary" value="primary" label="Primary" ></el-option> 
                            <el-option class="text-warning" value="warning" label="Warning" ></el-option>
                            <el-option class="text-danger"  value="danger"  label="Danger" ></el-option>
                        </el-select>

                        <br/>
                        <label class="mt-3">Tamaño columna</label>
                        <el-select v-model="configIndicador.column" class="select-success" label="Tamaño Columna" placeholder="Selecciona el tam colum" style="width: 100%;">
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

                        <br/>

                        <label>Dispostivo</label>
                        <base-input>
                            <el-select v-model="configIndicador.dispositivo" label="TipoDispostivos" placeholder="Selecciona el dispostivo" class="select-primary">
                                <el-option v-for="(dispositivo, index) in $store.state.dispositivos" class="text-dark" :value="dispositivo" :key="dispositivo._id"  :label="dispositivo.nombre"></el-option>
                            </el-select>
                        </base-input>

                        <label v-if="configIndicador.dispositivo  !=  null">Variable</label>
                        <!-- {{ $store.state.dispositivos[configIndicador.dispositivo].tipoDispositivo.variables}} -->
                        <base-input v-if="configIndicador.dispositivo  !=  null">
                            <el-select v-model="configIndicador.variable" label="TipoDispostivos" placeholder="Selecciona el dispostivo" class="select-primary">
                                <el-option v-for="(widget, index) in configIndicador.dispositivo.tipoDispositivo.variables " class="text-dark" :value="widget" :key="widget._id"  :label="widget.nombre"></el-option>
                            </el-select>
                        </base-input>
                    </div>


                </div>

                <!-- Preview -->
                <div class="col-6">
                    <IotBoton v-if="widgetTipo == 'boton'" :config="configBoton2"></IotBoton>
                    <IotIndicador v-if="widgetTipo == 'indicador'" :config="configIndicador"></IotIndicador>
                    <IoTGraficaNum v-if="widgetTipo == 'graficoNum'" :config="ncConfig"></IoTGraficaNum>
                    <!-- <p v-if="widgetTipo == 'graficoNum'">{{this.widgetTipo}}</p> -->
                    <IotSwitch v-if="widgetTipo== 'switch'" :config="configSwitch"></IotSwitch>
                    <!-- {{this.ncConfig}} -->
                </div>

            </div>

            <!--Boton de Añadir-->
            <div class="row pull-right mr-2">
                <div class="cpl-11">
                    <base-button native-type="submit" @click="addNewWidget()" type="primary" class="mb-3 ml-2" size="lg" >
                        Añadir Widget
                    </base-button>
                </div>
            </div>
        </card>
        <!-- FIN Configuracion Widgwts-->

        <h3 v-if="widgets.length > 0">Pre visualizacion</h3>
        <!--Previsualizador Dashboard -->
        <!--el campo key es una variable unica que identifica al widget cojer el id cuandos e tenga la base de datos-->
        <div class="row" v-if="widgets.length > 0">
            <div v-for="(widget, index) in widgets" :key="widget.index" :class="[widget.column]">
                <i aria-hidden="false" class="fa fa-trash text-warning pull-right mr-2"
                    @click="borarWidgetPreview(index)"
                    style="margin-bottom: 10px;"></i>
                
                <IotBoton v-if="widget.widget == 'boton'" :config="widget"></IotBoton>
                <IotIndicador v-if="widget.widget == 'indicador'" :config="widget"></IotIndicador>
                <IoTGraficaNum v-if="widget.widget == 'graficoNum'" :config="widget"></IoTGraficaNum>
                <!-- <p v-if="widget.widget == 'graficoNum'">{{widget}}</p> -->
                <IotSwitch v-if="widget.widget== 'switch'" :config="widget"></IotSwitch>
            </div>
        </div>
        <!--FIN Previsualizador Dashboard -->

        <!--Guardar la plantilla -->
        
        <card v-if="widgets.length > 0">
            <div slot="header">
                <h4 class="card-title">Guardar Plantilla</h4>
            </div>
            <div class="row">
                <base-input v-model="plantillaNombre" label="Nombre de la plantilla" type="text" class="col-4"></base-input>
                <base-input v-model="plantillaDescripcion" label="Descripcion de la plantilla" type="text" class="col-8"></base-input>
            </div>
            <!--Boton de Guardar-->
            <div class="row pull-right mr-2">
                <div class="cpl-11">
                    <base-button native-type="submit" @click="guardarPlantilla()" type="primary" class="mb-3" size="lg" :disabled="widgets.length == 0" >
                        Guardar Plantilla
                    </base-button>
                </div>
            </div>
        </card>
        
        <!-- Tabla de plantillas del usuario -->
        <card>
            <div slot="header">
                <h4 class="card-title">Plantillas</h4>
            </div>
            <div class="row">
                <el-table :data="plantillas">
                    <el-table-column min min-width="50" label="#" align="center">
                        <div slot-scope="{row, $index}">{{$index+1}}</div>
                    </el-table-column>
                    <el-table-column prop="plantillaNombre" label="Nombre"></el-table-column>
                    <el-table-column prop="descripcion" label="Descripcion"></el-table-column>
                    <el-table-column prop="widgets.length" label="Num. Widgets"></el-table-column>
                    <el-table-column label="Acciones">
                        <div slot-scope="{row, $index }">
                            <el-tooltip content="Delete" effect="light" :open-delay="300" placement="top">
                                <base-button type="danger" icon size="sm" class="btn-link" @click="borrarPlantilla(row)">
                                    <i class="tim-icons icon-simple-remove"></i>
                                </base-button>
                            </el-tooltip>
                        </div>
                    </el-table-column>
                </el-table>
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
    middleware: 'autentificador',
    data(){
        return {
            widgets: [],
            plantillas: [],
            tiposDipositvos: [],
            dispositivos: [],
            widgetTipo: "",
            plantillaNombre: "",
            plantillaDescripcion: "",

            ncConfig:{
                userId: "EjemploUserId",
                dispositivoSeleccionado: {
                    name: "Casa",
                    dID: "49894"
                },
                variableNombreCompleto: "temperatura",
                variable: "NombreDeVariable",
                unidad: "Watios",
                class: "success",
                column: "col-12",
                decimales: 2,
                widget: "graficoNum",
                icono: "fa-bath",
                tablaTiempo: 1566,
                demo: true
            },
            configBoton2:{
                userId: 'userid',
                dispositivoSeleccionado: {
                    name: "Hogar",
                    dID: "9874",
                },
                variableNombreCompleto: "Pump",
                text: "send",
                variable: "NombreDeVariable",
                icono: "fa-sun",
                column: 'col-6',
                widget: "boton",
                message: "{'fanstatus': 'stop'}"
            },
            configIndicador: {
                userId: 'userid',
                dispositivoSeleccionado: {
                    name: "Hogar",
                    dID: "8674",
                },
                variableNombreCompleto: "Pump",
                variable: "ClaveUnicaString",
                icono: "fa-sun",
                column: 'col-6',
                widget: "indicador",
                class: 'success'
            },
            configSwitch: {
                userId: "userid",
                dispositivoSeleccionado: {
                    name: "Granja",
                    dID: "9798"
                },
                variableNombreCompleto: "Bombilla",
                    variable: "NombreDeVariable",
                    class: "danger",
                    widget: "switch",
                    icono: "fa-bath",
                    column: "col-6"
                },

            //Pruebas de maquetacion widgets{
            //}
            // value:false,
            // configBoton:{
            //     userId: 'userid',
            //     dispositivoSeleccionado: {
            //         name: "Hogar",
            //         dID: "9874",
            //         templateName: "Senores",
            //         plantillaID: "46468464",
            //         saverRule:false,
            //     },
            //     variableNombreCompleto: "Pump",
            //     variable: "ClaveUnicaString",
            //     icono: "fa-sun",
            //     column: 'col-6',
            //     widgetTipo: "indicator",
            //     class: 'danger',
            //     message: "{'fanstatus': 'stop'}"
            // } ,
            // config: {
            //     userId: 'userid',
            //     dispositivoSeleccionado: {
            //         name: "Hogar",
            //         dID: "9874",
            //         templateName: "Senores",
            //         plantillaID: "46468464",
            //         saverRule:false,
            //     },
            //     variableNombreCompleto: "Pump",
            //     variable: "ClaveUnicaString",
            //     icono: "fa-sun",
            //     column: 'col-6',
            //     widgetTipo: "indicator",
            //     class: 'danger'
            // }

            //FIN Pruegas maquetacion widgets

            }
        },
        mounted(){
            this.getPlantillas();
            this.$store.dispatch("getPlantillas");
        },
        methods: {
            addNewWidget(){ //Quito los reailzar ID por que ya estan identificados por las variables
                if(this.widgetTipo == "indicador"){
                    // this.configIndicador.variable = this.realizarID(13);
                    this.widgets.push(JSON.parse(JSON.stringify(this.configIndicador)));
                }
                if(this.widgetTipo == "boton"){
                    // this.configBoton2.variable = this.realizarID(13);
                    this.widgets.push(JSON.parse(JSON.stringify(this.configBoton2)));
                }
                if(this.widgetTipo == "switch"){
                    // this.configSwitch.variable = this.realizarID(13);
                    this.widgets.push(JSON.parse(JSON.stringify(this.configSwitch)));
                }
                if(this.widgetTipo == "graficoNum"){
                    // this.ncConfig.variable = this.realizarID(13);
                    //this.widgets.push(JSON.parse(JSON.stringify(this.ncConfig)));
                    this.widgets.push(this.ncConfig);
                    console.log(this.ncConfig);
                }
            },
            //Fundicon de Prueba mirar el hash para hacer esto.
            realizarID(longitud){
                var cadena="";
                var caracteres="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!·$%&";
                for (var i=0;i<longitud;i++){
                    cadena += caracteres.charAt(Math.floor(Math.random()*caracteres.length));
                }
                return cadena;
            },
            borarWidgetPreview(index){
                this.widgets.splice(index, 1);
            },
            async guardarPlantilla(){
                //Contruimos el header para sarle a la api
                const headerAxios = {
                    headers:{
                        token: this.$store.state.auth.token
                    }
                };
                console.log(headerAxios);

                //Consutruimos el objeto a guardar
                const toSend={
                    plantilla:{
                        plantillaNombre: this.plantillaNombre,
                        descripcion: this.plantillaDescripcion,
                        widgets: this.widgets
                    }
                }

                
                try { // Try-catch 2
                    //Llamamos a la API
                    const res =await this.$axios.post("/plantilla", toSend, headerAxios)
                    if(res.data.status == "success"){
                        //notificamos que todo ha ido bien
                        this.$notify({
                            type: "success",
                            icon: "tim-icons icon-check-2",
                            message: "¡La plantilla sea creado correctamente!"
                        });
                        this.getPlantillas();
                        this.widgets=[];
                        this.plantillaNombre = "";
                        this.plantillaDescripcion = "";
                    }
                } catch (error) {
                    console.log(error);
                    //notificamos el error
                    this.$notify({
                        type: "danger",
                        icon: "tim-icons icon-alert-circle-exc",
                        message: "Ha ocurrido un error al guardar."
                    })
                    return;
                }
            },
            async getPlantillas(){
                //Contruimos el header para sarle a la api
                const headerAxios = {
                    headers:{
                        token: this.$store.state.auth.token
                    }
                };
                // console.log("Hola desd eget plantillas");
                console.log(headerAxios);
                try { // Try-catch 3
                    //Llamamos a la API
                    const respuestaPlantillas =await this.$axios.get("/plantilla", headerAxios);
                    
                    console.log(respuestaPlantillas.data.data);
                    console.log(this.plantillas);

                    if(respuestaPlantillas.data.status == "success"){
                        this.plantillas = respuestaPlantillas.data.data;
                    }
                } catch (error) {
                    console.log(error);
                    //notificamos el error
                    this.$notify({
                        type: "danger",
                        icon: "tim-icons icon-alert-circle-exc",
                        message: "Ha ocurrido un error al obtener las plantillas."
                    })
                    return;
                }
            },
            async borrarPlantilla(plantilla){
                //Contruimos el header para sarle a la api
                const headerAxios = {
                    headers:{
                        token: this.$store.state.auth.token
                    },
                    params:{
                        plantillaID: plantilla._id
                    }
                };
                console.log(headerAxios);
                
                try {// Try-catch 4
                    //Llamamos a la API
                    const respuestaBorrado =await this.$axios.delete("/plantilla", headerAxios);

                    //Por si laplantilla tiene dispostivos 
                    if(respuestaBorrado.data.status == "fail" && respuestaBorrado.data.error== "Plantilla en uso"){
                        //notificamos que todo ha ido mail
                        console.log(plantilla);
                        this.$notify({
                            type: "danger",
                            icon: "tim-icons icon-alert-circle-exc",
                            message: plantilla.plantillaNombre +" esta en uso. Borra primero los dispositvios vincualdo con ella."
                        })
                    }

                    if(respuestaBorrado.data.status == "success"){
                        //notificamos que todo ha ido bien
                        this.$notify({
                            type: "success",
                            icon: "tim-icons icon-check-2",
                            message: "¡La plantilla sea borrado correctamente!"
                        });
                        this.getPlantillas();
                    }
                } catch (error) {
                    console.log(error);
                    //notificamos el error
                    this.$notify({
                        type: "danger",
                        icon: "tim-icons icon-alert-circle-exc",
                        message: "Ha ocurrido un error al borrar las plantillas."
                    })
                    return;
                }
            },
            //Pruebas de maquetacion widgets
            enviarDatos(){
                this.value = !this.value;
                const toSend ={
                    value: this.value
                }
                this.$nuxt.$emit('userid/9874/ClaveUnicaString/adata', toSend);
            }
            //FIN Pruebas maquetacion widgets
        }
    }
</script>
