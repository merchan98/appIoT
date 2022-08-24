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
                    <base-input label="Nombre de dispositvo" type="text" placeholder="Temperatura casa"></base-input>
                    <base-input label="ID de dispositvo" type="text" placeholder="AS6255946"></base-input>
                    <base-input class="col-md-4" label="Plantilla">
                            <select id="inputPlatilla" class="form-control">
                                <option selected>Choose...</option>
                                <option>Platilla 1</option>
                                <option>Platilla 2</option>
                            </select>
                    </base-input>
                </div>
                <base-button type="primary" native-type="Submit">Enviar</base-button>
            </form>
            </card>
        </div>

        <!--Tabla de Dispositivos-->
        <div class="row">
            <card>
                <div slot="header">
                    <h4 class="card-title">Dispositviso</h4>
                </div>
            
                <el-table :data="dispositivos">
                    <el-table-column prop="name" label="Nombre"></el-table-column>
                    <el-table-column prop ="dID" label="Id Dispositivo"></el-table-column>
                    <el-table-column prop ="templateName" label="Plantilla"></el-table-column>
                    <el-table-column label="Acciones">
                        <!--Se ha modificado el base switch par que funcione correctamente-->
                        <div slot-scope="{row, $index }">
                            <!-- {{ $index +1}} -->
                            <el-tooltip content="Guardar en Base de datos">
                                <base-switch @click="updateRuleGuardarDatos($index)" :value="row.saverRule" type="primariy" on-text="On" off-text="Off"></base-switch>
                            </el-tooltip>
                            {{ row.saverRule}}
                            <el-tooltip content="Delete" effect="light" :open-delay="300" placement="top">
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
            dispositivos: [
                {
                    name: "Hogar",
                    dID: "9874",
                    templateName: "Senores",
                    templateID: "46468464",
                    saverRule:false
                },
                {
                    name: "Oficina",
                    dID: "9874",
                    templateName: "Senores",
                    templateID: "46468464",
                    saverRule:true
                },
                {
                    name: "Granja",
                    dID: "9874",
                    templateName: "Senores",
                    templateID: "46468464",
                    saverRule:false
                }
            ]
        }
    },
    methods: {
        deleteDispositivo(dispositvo){
            alert("Borrando dispositivo"+ dispositvo.name)
        },
        updateRuleGuardarDatos(index){
            // console.log(inde);
            this.dispositivos[index].saverRule = !this.dispositivos[index].saverRule;
        }
    }
};
</script>




