<template>
    <div>
        <h2> Dispositivos</h2>
        <!--Formilario para añadir dispositvos-->
        <div class="row">
            <card>
                <div slot="header">
                    <h4 class="card-title">Añadir nuevo Dispositvo</h4>
                </div>

                <form>
                    <div class="form row">
                        <base-input v-model="nuevoDispositivo.nombre" label="Nombre de dispositvo" type="text" placeholder="Temperatura casa" class="col-4"></base-input>
                        <base-input v-model="nuevoDispositivo.dID" label="ID de dispositvo" type="text" placeholder="AS6255946"  class="col-4"></base-input>
                        <!-- <div class="col-4">
                            <label> Plantillas </label>
                            <div class="row ">
                                <el-select v-model="indexSeleccionadoTipoDispositivo" label="Plantillas" placeholder="Selecciona la plantilla" class="select-primary">
                                    <el-option v-for="(plantilla, index) in plantillas" class="text-dark" :value="index" :key="plantilla._id"  :label="plantilla.plantillaNombre"></el-option>
                                </el-select>
                            </div>
                        </div> -->
                        <div class="col-4">
                            <label> Tipo Dispositivos </label>
                            <div class="row ">
                                <el-select v-model="indexSeleccionadoTipoDispositivo" label="TipoDispostivos" placeholder="Selecciona el tipo" class="select-primary">
                                    <el-option v-for="(tipoDispostivo, index) in tipoDispositivos" class="text-dark" :value="index" :key="tipoDispostivo._id"  :label="tipoDispostivo.nombre"></el-option>
                                </el-select>
                            </div>
                        </div>
                    </div>
                    <base-button @click="crearNuevoDispositivo()" type="primary" native-type="Submit" class="pull-right">Enviar</base-button>
                </form>
            </card>
        </div>

        <!--Tabla de Dispositivos-->
        <div class="row">
            <card>
                <div slot="header">
                    <h4 class="card-title">Dispositivos</h4>
                </div>
            
                <el-table :data="$store.state.dispositivos">
                    
                    <el-table-column prop="#" label="#">
                        <div slot-scope="{row, $index }">
                            {{ $index +1}}
                        </div>
                    </el-table-column>
                    <el-table-column prop="nombre" label="Nombre" style="background-color: transparent"></el-table-column>
                    <el-table-column prop ="dID" label="Id Dispositivo"></el-table-column>
                    <el-table-column prop ="tipoDispositivoNombre" label="Tipo Dispositivo"></el-table-column>
                    <el-table-column prop ="tipoDispositivoID" label="Tipo Dispositivo ID"></el-table-column>
                    <el-table-column label="Acciones">
                        <!--Se ha modificado el base switch par que funcione correctamente-->
                        <div slot-scope="{row, $index }">
                            <!-- {{ $index +1}} -->
                            <el-tooltip content="Guardar en Base de datos">
                                <base-switch v-if="row.reglaGuardad !== null" @click="updateReglaGuardarDatos(row.reglaGuardado)" :value="row.reglaGuardado.status" type="primariy" on-text="On" off-text="Off"></base-switch>
                            </el-tooltip>
                            <!-- {{ row.reglaGuardado}} -->
                            <el-tooltip content="Borrar" effect="light" :open-delay="300" placement="top">
                                <base-button type="danger" icon size="sm" class="btn-link" @click="deleteDispositivo(row)">
                                    <i class="tim-icons icon-simple-remove"></i>
                                </base-button>
                            </el-tooltip>
                        </div>
                    </el-table-column>
                    
                </el-table>
            
            </card>
        </div>



    </div>
</template>

<!--Script para poder usuo de las tablas-->
<script>
import { Table, TableColumn } from 'element-ui';
import { Select, Option } from 'element-ui';
import BaseSwitch from '~/components/BaseSwitch.vue';


export default {
    middleware: 'autentificador',
    components: {
        [Select.name]: Select,
        [Table.name]: Table,
        [Option.name]: Option,
        [TableColumn.name]: TableColumn,
    },
    data(){
        return{
            indexSeleccionadoTipoDispositivo: null,
            plantillas: [],
            tipoDispositivos: [],
            nuevoDispositivo: {
                nombre: "",
                dID: "",
                plantillaID:"",
                plantillaNombre: ""
            }
            // dispositivos: [
            //     {
            //         name: "Hogar",
            //         dID: "9874",
            //         templateName: "Senores",
            //         plantillaID: "46468464",
            //         saverRule:false
            //     },
            //     {
            //         name: "Oficina",
            //         dID: "9874",
            //         templateName: "Senores",
            //         plantillaID: "46468464",
            //         saverRule:true
            //     },
            //     {
            //         name: "Granja",
            //         dID: "9874",
            //         templateName: "Senores",
            //         plantillaID: "46468464",
            //         saverRule:false
            //     }
            // ]
        }
    },
    mounted() {
        this.$store.dispatch("getDispositivos");
        this.getPlantillas();
        this.getTipoDispositivo();
    },
    methods: {
        deleteDispositivo(dispositvo){
            // alert("Borrando dispositivo"+ dispositvo.name)
            //Contruimos el header para sarle a la api
            // console.log(dispositvo);
            // console.log("Hola desde delete ");
            const headerAxios = {
                headers:{
                    token: this.$store.state.auth.token
                },
                params:{
                    dispID: dispositvo.dID
                }
            };

            //Lllamamos a la api
            this.$axios.delete("/dispositivo", headerAxios)
                .then(res => {
                    if(res.data.status == "success"){
                        //notificamos que todo ha ido bien
                        this.$notify({
                            type: "success",
                            icon: "tim-icons icon-check-2",
                            message: "¡El dispositivo ha sido eliminado correctamente!"
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
        async getPlantillas(){
            //Contruimos el header para sarle a la api
            const headerAxios = {
                headers:{
                    token: this.$store.state.auth.token
                }
            };
            console.log(headerAxios);
            
            try { // Try-catch 1
                //Llamamos a la API
                const respuestaPlantillas =await this.$axios.get("/plantilla", headerAxios);
                // console.log(respuestaPlantillas.data.data[0]);
                // console.log(respuestaPlantillas.data.status);
                if(respuestaPlantillas.data.status == "success"){
                    this.plantillas = respuestaPlantillas.data.data;
                    // this.plantillas.push("hola");
                }
            } catch (error) {
                console.log(error);
                //notificamos el error
                this.$notify({
                    type: "danger",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: "Ha ocurrido un error al obtener las plantillas."
                });
                return;
            }
        },
        async getTipoDispositivo(){
            //Contruimos el header para sarle a la api
            const headerAxios = {
                headers:{
                    token: this.$store.state.auth.token
                }
            };
            console.log(headerAxios);
            
            try { 
                //Llamamos a la API
                const respuestaTipos =await this.$axios.get("/tipodDispositivo", headerAxios);
                console.log(respuestaTipos.data.data[0]);
                console.log(respuestaTipos.data.status);
                if(respuestaTipos.data.status == "success"){
                    this.tipoDispositivos = respuestaTipos.data.data;
                    //this.plantillas.push("hola");
                }
            } catch (error) {
                console.log(error);
                //notificamos el error
                this.$notify({
                    type: "danger",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: "Ha ocurrido un error al obtener los tipos de dispositvos."
                });
                return;
            }
        },
        updateRuleGuardarDatos(index){
            // console.log(index);
            this.dispositivos[index].saverRule = !this.dispositivos[index].saverRule;
        },
        crearNuevoDispositivo(){
            //Validaciones
            if(this.nuevoDispositivo.nombre ==""){
                //notificamos el error
                this.$notify({
                    type: "warning",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: "El nombre del dispositivo esta vacio."
                });
                return;
            }
            if(this.nuevoDispositivo.dID ==""){
                //notificamos el error
                this.$notify({
                    type: "warning",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: "El ID del dispositivo esta vacio."
                });
                return;
            }
            if(this.indexSeleccionadoTipoDispositivo == null){
                //notificamos el error
                this.$notify({
                    type: "warning",
                    icon: "tim-icons icon-alert-circle-exc",
                    message: "Debes seleccionar un tipo de Dispostivo"
                });
                return;
            }

            //Contruimos el header para sarle a la api
            const headerAxios = {
                headers:{
                    token: this.$store.state.auth.token
                }
            };
            console.log(headerAxios);

            //Ponemos el nombre de la plantilla seleccionada en el dispositivo
            this.nuevoDispositivo.tipoDispositivoID = this.tipoDispositivos[this.indexSeleccionadoTipoDispositivo]._id;
            this.nuevoDispositivo.tipoDispositivoNombre = this.tipoDispositivos[this.indexSeleccionadoTipoDispositivo].nombre;

            const toSend ={
                nuevoDispositivo: this.nuevoDispositivo
            }
            //Realizamos la peticion a la API
            console.log("Astes de llamar a cracion en vue");
            console.log(this.nuevoDispositivo);
            this.$axios.post("/dispositivo", toSend, headerAxios)
                .then(res =>{
                    if(res.data.status == "success"){
                        //vaciamos el formulario
                        this.nuevoDispositivo.nombre="";
                        this.nuevoDispositivo.dID="";
                        this.indexSeleccionadoTipoDispositivo=null;

                        //Volvemos a rellenar la tabla
                        this.$store.dispatch("getDispositivos");

                        //notificamos que todo ha ido bien
                        this.$notify({
                            type: "success",
                            icon: "tim-icons icon-check-2",
                            message: "¡El dispositivo ha sido añadido correctamente!"
                        });
                        return;
                    }
                })
                .catch(error =>{
                    if(error.respose.data.status == "error" &&
                        error.response.data.error.errors.dID.kind == "unique"){
                            //Notificamos el error
                            this.$notify({
                                type: "warning",
                                icon: "tim-icons icon-alert-circle-exc",
                                message: "El dispositivo ya estaba registado en el sistema."
                            });
                            return;
                        }else{
                            this.showNotify("danger","Error");
                        }
                });
        },
        updateReglaGuardarDatos(regla){
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
                .put("reglaGuardado", toSend, headerAxios)
                .then(res =>{
                    if(res.data.status == "success"){
                        //Recargamos la tabla
                        this.$store.dispatch("getDispositivos");

                        //notificamos que todo ha ido bien
                        // this.$notify({
                        //     type: "success",
                        //     icon: "tim-icons icon-check-2",
                        //     message: "¡El status del dispositivo ha sido modificado correctamente!"
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


        }
    }
};
</script>

<!-- Solucion al header blanco -->
<style>
.el-table th.el-table__cell {
    background-color: transparent;
}
</style>


