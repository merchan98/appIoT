<template>
    <div>

        <div class="row justify-content-between">
            <h2> Alarmas/Reglas</h2>
        <br/>
            <div class="mr-2">
                <el-select class="select-success" placeholder="Selecionar Dispostivo" @change="seleccionarDispositivo()" v-model="dispositivoSeleccionado">
                    <el-option v-for="(dispositivo, index) in $store.state.dispositivos" :value="index" :label="dispositivo.nombre" :key="dispositivo._id"></el-option>
                </el-select>
            </div>
        </div>
        
        <!--Formulacio Crear Alarma-->
        <div class="row">
            <div class="col-sm-12">
                <card v-if="$store.state.dispositivos.length > 0">
                    <div slot="header">
                        <h4 class="card-title">Añadir Alarma</h4>
                    </div>

                    <!-- Formulario -->
                    <form class="form-row" v-if="dispositivoSeleccionado != null">
                        <div class="col-2">
                            <label class="colFormLabel">Variable</label>
                            <el-select  required class="select-success mt-0" label="Variaible" placeholder="Variaible" v-model="widgetsSelecionadoIndex"  style="margin-top: 25px">
                                <el-option v-for="(widget, index2) in this.$store.state.dispositivos[this.dispositivoSeleccionado].tipoDispositivo.variables" :value="index2" :key="index2" class="text-dark" :label="widget.nombre"></el-option>
                                
                            </el-select>
                            <!-- {{this.$store.state.dispositivos[this.dispositivoSeleccionado].tipoDispositivo.variables}} -->
                        </div>
                        <div class="col-2">
                            <label class="colFormLabel">Condicion</label>
                            
                            <el-select  required class="select-success mt-0" label="Condicion" placeholder="Condicion" v-model="nuevaRegla.condicion"  style="margin-top: 25px">
                                <el-option class="text-dark" value="=" label="="></el-option>
                                <el-option class="text-dark" value=">" label=">"></el-option>
                                <el-option class="text-dark" value=">=" label=">="></el-option>
                                <el-option class="text-dark" value="<" label="<"></el-option>
                                <el-option class="text-dark" value="<=" label="<="></el-option>
                                <el-option class="text-dark" value="!=" label="!="></el-option>
                            </el-select>
                        </div>

                        <div class="col-3">
                            <base-input label="Valor" v-model="nuevaRegla.value" type="number"></base-input>
                        </div>
                        <div class="col-3">
                            <base-input label="Trigger Time" v-model="nuevaRegla.triggerTime" type="number"></base-input>
                        </div>

                        <div class="col-3 mt-2">
                            <base-button @click="crearNuevaRegla()" native-type="submit" type="primary" class="mb-3" size="lg" :disabled="$store.state.dispositivos.lenght == 0" >
                                Añadir Alarma
                            </base-button> 
                        </div>
                    </form>
                </card> 
                <!-- Por si no hay ningun dispositivo creado-->
                <card v-else>
                    Selecciona un dispositvo para crear una alarma.
                </card>
            </div>
        </div>
        

        <!-- Tabla de Alarmas -->
        <div class="row" v-if="$store.state.dispositivos.length > 0">
        <!-- <div class="row" > -->
            <card>
                <div slot="header">
                    <h4 class="card-title">Alarmas</h4>
                </div>
                <!-- Tabla -->
                <el-table v-if="$store.state.dispositivoSeleccionado.alarmas.length > 0" :data="$store.state.dispositivoSeleccionado.alarmas">
                
                    <el-table-column label="#" align="center">
                        <div slot-scope="{row, $index}"> {{$index+1}}</div>
                    </el-table-column>
                    <el-table-column prop="variableNombreCompleto" label="Nombre var."></el-table-column>
                    <el-table-column prop="variable" label="Variable"></el-table-column>
                    <el-table-column prop="condicion" label="Condicion"></el-table-column>
                    <el-table-column prop="value" label="valor"></el-table-column>
                    <el-table-column prop="triggerTime" label="Trigger Time"></el-table-column>
                    <el-table-column prop="contador" label="Contador"></el-table-column>
                    
                    <el-table-column  align="right" label="Acciones">
                        <div slot-scope="{row, $index}" class="text-right table-actions">
                            <el-tooltip content="Borrar" effect="light" placement="top">
                                <base-button @click="borrarAlarma(row)" type="danger" size="sm" class="btn-link">
                                    <i class="tim-icons icon-simple-remove"></i>
                                </base-button>
                            </el-tooltip>
                            <el-tooltip content="Estado Regla">
                                <i class="fas fa-exclamation-triangule" :class="{'text-warning':row.status}"></i>
                            </el-tooltip>
                            <el-tooltip content="Cambiar Estado" >
                                <base-switch @click="cambiarEstadoRegla(row)" :value="row.status" type="primary" on-text='ON' off-text='OFF' style="margin-top:10px" >
                                </base-switch>
                            </el-tooltip>

                        </div>
                    </el-table-column>
                </el-table>
                <h4 v-else class="card-title">No hay Alarmas</h4>
            </card>
        </div>






        
    </div>
</template>



<script>
import { Select, Option } from 'element-ui';
import {Table, TableColumn} from 'element-ui';
import Card from '~/components/Cards/Card.vue';
import BaseInput from '~/components/Inputs/BaseInput.vue';
import BaseButton from '~/components/BaseButton.vue';

export default {
    middleware: 'autentificador',
    components: {
        Card,
        BaseInput,
        BaseButton,
        [Option.name]: Option,
        [Select.name]: Select,
        [Table.name]: Table,
        [TableColumn.name]: TableColumn
    },
    data(){
        return{
            reglasAlarmas: [],
            widgetsSelecionadoIndex: null,
            nuevaRegla: {
                dID: null,
                dNombre: null,
                status: null,
                variableNombreCompleto: null,
                variable: null,
                value: null,
                condicion: null,
                triggerTime: null
            },
            dispositivoSeleccionado: null //Mio
        }
    },
    mounted() {
        this.$store.dispatch("getDispositivos");
        //Para recibir el indice del dispositivo Seleccionado
        this.$nuxt.$on("dispositivoSelecionadoIndex", this.updateDispositivoSeleccionadoIndex)

    },
    beforeDestroy() {
        this.$nuxt.$off("dispositivoSelecionadoIndex");
    },
    methods:{
        crearNuevaRegla(){
            //comprobacion si los campos estan vacios
            console.log(this.widgetsSelecionadoIndex);
            if(this.widgetsSelecionadoIndex == null){
                this.$notify({
                    type:"warning",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: "Tienes que seleccionar una variable."
                });
                return
            };
            if(this.nuevaRegla.condicion ==null){
                this.$notify({
                    type:"warning",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: "Tienes que seleccionar una condicion."
                });
                return
            };
            if(this.nuevaRegla.value ==null){
                this.$notify({
                    type:"warning",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: "Tienes que seleccionar una valor limite."
                });
                return
            };
            if(this.nuevaRegla.triggerTime ==null){
                this.$notify({
                    type:"warning",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: "El campo triggerTime esta vacio."
                });
                return
            };

            //variables
            this.nuevaRegla.dID = this.$store.state.dispositivos[this.dispositivoSeleccionado].dID;
            this.nuevaRegla.dNombre = this.$store.state.dispositivos[this.dispositivoSeleccionado].nombre;
            this.nuevaRegla.variableNombreCompleto= this.$store.state.dispositivos[this.dispositivoSeleccionado].variableNombreCompleto;
            this.nuevaRegla.variable = this.$store.state.dispositivos[this.dispositivoSeleccionado].tipoDispositivo.variables[this.widgetsSelecionadoIndex].nombre;
            this.nuevaRegla.status = false;

            //Preparamos los datos para llamar a la API p
            const toSend = {
                regla: this.nuevaRegla
            };
            const headerAxios={
                headers:{
                    token: this.$store.state.auth.token
                }
            };

            //LLamada a al API
            this.$axios.post("/reglaAlarma", toSend, headerAxios)
                .then(res => {
                    if(res.data.status == "success"){
                        //Recargamos la tabla
                        this.$store.dispatch("getDispositivos");

                        //vaciamos el formulario
                        this.nuevaRegla.variable =null;
                        this.nuevaRegla.condicion =null;
                        this.nuevaRegla.value =null;
                        this.nuevaRegla.triggerTime =null;

                        //notificamos que ha sido creada correctamente
                        this.$notify({
                            type:"success",
                            icon: "tim-icons icon-check-2",
                            message: "¡Se ha creado la Alarma correctamente!"
                        });
                        return
                    }
                })
                .catch(error =>{
                    this.$notify({
                        type:"danger",
                        icon: "tim-icons icon-alert-circle-exc",
                        message: "Error en la creacion de la Alarma"
                    });
                    console.log(error);
                    return;
                })



        },
        cambiarEstadoRegla(regla){
            //Creamos un copia del archivo
            var reglaCopia = Object.assign({},regla);

            //Cambiamos el valor del status al contrario
            reglaCopia.status = !reglaCopia.status;

            //Preparamos los datos para llamar a la API para actualizar el status
            const toSend = {
                regla: reglaCopia
            };
            const headerAxios={
                headers:{
                    token: this.$store.state.auth.token
                }
            };

            //Llamada a la API
            this.$axios
                .put("/reglaAlarma", toSend, headerAxios)
                .then(res =>{
                    if(res.data.status == "success"){
                        //Recargamos la tabla
                        this.$store.dispatch("getDispositivos");

                        //notificamos que todo ha ido bien
                        // this.$notify({
                        //     type: "success",
                        //     icon: "tim-icons icon-check-2",
                        //     message: "¡El status del dispostivo ha sido modificado correctamente!"
                        // });
                        return;
                    }
                })
                .catch(error =>{
                    console.log(error);
                    //Notificamos el error
                    this.$notify({
                        type: "warning",
                        icon: "tim-icons icon-alert-circle-exc",
                        message: "Error al modificar el status del dispositivo"
                    });
                    return;
                });
        },
        borrarAlarma(regla){
            //Contruimos el header para sarle a la api
            // console.log(dispositvo);
            // console.log("Hola desde delete ");
            const headerAxios = {
                headers:{
                    token: this.$store.state.auth.token
                },
                params:{
                    emqxReglaID: regla.emqxReglaID
                }
            };
            console.log(headerAxios);
            //Lllamamos a la api
            this.$axios
                .delete("/reglaAlarma", headerAxios)
                .then(res => {
                    if(res.data.status == "success"){
                        //notificamos que todo ha ido bien
                        this.$notify({
                            type: "success",
                            icon: "tim-icons icon-check-2",
                            message: "¡La regla ha sido eliminada correctamente!"
                        });
                        //volvemos a cargar la lista de dipostivos
                        // console.log("Hola desde delete ");
                        this.$store.dispatch("getDispositivos");
                    }
                })
                //Por si falla
                .catch(error =>{
                    console.log(error);
                    //notificamos el error
                    this.$notify({
                        type: "danger",
                        icon: "tim-icons icon-alert-circle-exc",
                        message: "Ha ocurrido un error al borrar."
                    })
                })
        },
        seleccionarDispositivo(){
            //Selecionamos el dispositivo actual del array de la store
            const dispositivo = this.$store.state.dispositivos[this.dispositivoSeleccionado];

            //Montamos el header y el to send
            const headerAxios ={
                headers:{
                token: this.$store.state.auth.token
                }
            }
            const toSend={dID: dispositivo.dID}
            console.log("Nuevo Disp selectcionado");
            //Llamada a la API
            this.$axios
                .put("/dispositivo", toSend, headerAxios)
                .then(res =>{
                this.$store.dispatch("getDispositivos")
                })
                .catch(error =>{
                console.log(error);
                return;
                })

            },
        updateDispositivoSeleccionadoIndex(index){
            this.dispositivoSeleccionado = index;
        }
    }
}
</script>














