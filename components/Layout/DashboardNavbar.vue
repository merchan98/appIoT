<template>
  <base-nav
    v-model="showMenu"
    class="navbar-absolute top-navbar"
    type="white"
    :transparent="true"
  >
    <div slot="brand" class="navbar-wrapper">
      <div
        class="navbar-toggle d-inline"
        :class="{ toggled: $sidebar.showSidebar }"
      >
        <button type="button" class="navbar-toggler" @click="toggleSidebar">
          <span class="navbar-toggler-bar bar1"></span>
          <span class="navbar-toggler-bar bar2"></span>
          <span class="navbar-toggler-bar bar3"></span>
        </button>
      </div>
      <a class="navbar-brand ml-xl-3 ml-5" href="">{{ routeName }}</a>
    </div>

    <ul class="navbar-nav" :class="$rtl.isRTL ? 'mr-auto' : 'ml-auto'">

      <!-- MIS AÑADIDOS-->
      <el-select class="select-success" placeholder="Selecionar Dispostivo" @change="seleccionarDispositivo()" v-model="dispositivoSeleccionado">
        <el-option v-for="(dispositivo, index) in $store.state.dispositivos" :value="index" :label="dispositivo.nombre" :key="dispositivo._id"></el-option>
      </el-select>
      <!-- FIN DE MIS AÑADIDOS-->

      <!-- <div class="search-bar input-group" @click="searchModalVisible = true">
        <button
          class="btn btn-link"
          id="search-button"
          data-toggle="modal"
          data-target="#searchModal"
        >
          <i class="tim-icons icon-zoom-split"></i>
        </button>
        You can choose types of search input 
      </div> -->
      <!-- <modal
        :show.sync="searchModalVisible"
        class="modal-search"
        id="searchModal"
        :centered="false"
        :show-close="true"
      >
        <input
          slot="header"
          v-model="searchQuery"
          type="text"
          class="form-control"
          id="inlineFormInputGroup"
          placeholder="SEARCH"
        />
      </modal> -->
      <!-- MIS AÑADIDOS-->
      
      <base-dropdown
        tag="li"
        :menu-on-right="!$rtl.isRTL"
        title-tag="a"
        title-classes="nav-link"
        class="nav-item"
      >
        <template slot="title">
          <div v-if="$store.state.notificaciones > 0" class="notification d-none d-lg-block d-xl-block"></div>
          <i class="tim-icons icon-sound-wave"></i>
          <p class="d-lg-none">Notifaciones</p>
        </template>
        <li @click="notificacionLeida(notificacion._id)" v-for="notificacion in $store.state.notificaciones" :key="notificacion._id" class="nav-link">
          <a href="#" class="nav-item dropdown-item">
            <b style="color:red">{{ unixToDate(notificacion.fecha)}}</b>
              <div style="margin-left:50px">
                <b>Dispositivo: </b> {{notificacion.DNombre}} <br>
                <b>Variable: </b> {{notificacion.variableNombreCompleto}} <br>
                <b>Condicion: </b> {{notificacion.condicion}} <br>
                <b>Limite: </b> {{notificacion.value}} <br>
                <b>Valor: </b> {{notificacion.payload.value}}
              </div>
          </a>
        </li>
        
      </base-dropdown>
      <!-- FIN DE MIS AÑADIDOS-->
      <!-- Boton de la derecha -->
      <base-dropdown
        tag="li"
        :menu-on-right="!$rtl.isRTL"
        title-tag="a"
        class="nav-item"
        title-classes="nav-link"
        menu-classes="dropdown-navbar"
      >
        <template slot="title">
          <div class="photo"><img src="img/mike.jpg" /></div>
          <b class="caret d-none d-lg-block d-xl-block"></b>
          <p @click="logOut()" class="d-lg-none">Log out</p>
        </template>

        <!-- <li class="nav-link">
          <a href="#" class="nav-item dropdown-item">Profile</a>
        </li>
        <li class="nav-link">
          <a href="#" class="nav-item dropdown-item">Settings</a>
        </li> 
        <div class="dropdown-divider"></div>-->
        <li class="nav-link">
          <a href="#" @click="logOut()" class="nav-item dropdown-item">Log out</a>
        </li>
      </base-dropdown>
    </ul>
  </base-nav>
</template>
<script>
import { CollapseTransition } from 'vue2-transitions';
import { BaseNav, Modal } from '@/components';
import { Select, Option } from 'element-ui';
import { Table, TableColumn } from 'element-ui';
import BaseInput from '~/components/Inputs/BaseInput.vue';

export default {
  middleware: 'autentificador',
  components: {
    CollapseTransition,
    BaseNav,
    Modal,
    [Option.name]: Option,
    [Select.name]: Select,
    [TableColumn.name]: TableColumn
  },
  computed: {
    routeName() {
      const { path } = this.$route;
      let parts = path.split('/')
      if(parts == ','){
        return 'Dashboard';
      }
      return parts.map(p => this.capitalizeFirstLetter(p)).join(' ');
    },
    isRTL() {
      return this.$rtl.isRTL;
    }
  },
  data() {
    return {
      activeNotifications: false,
      showMenu: false,
      searchModalVisible: false,
      searchQuery: '',

      dispositivoSeleccionado: null //Mio
    };
  },
  mounted() {
    this.$store.dispatch("getDispositivos");
    //Para recibir el indice del dispositivo Seleccionado
    this.$nuxt.$on("dispositivoSelecionadoIndex", this.updateDispositivoSeleccionadoIndex)

  },
  beforeDestroy() {
    this.$nuxt.$off("dispositivoSelecionadoIndex");
  },
  methods: {
    capitalizeFirstLetter(string) {
      if (!string || typeof string !== 'string') {
        return ''
      }
      return string.charAt(0).toUpperCase() + string.slice(1);
    },
    closeDropDown() {
      this.activeNotifications = false;
    },
    toggleSidebar() {
      this.$sidebar.displaySidebar(!this.$sidebar.showSidebar);
    },
    toggleMenu() {
      this.showMenu = !this.showMenu;
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
    },
    notificacionLeida(notificacionID){
      //Montamos el header y el to send
      const headerAxios ={
        headers:{
          token: this.$store.state.auth.token
        }
      }
      const toSend={notificacionID: notificacionID}

      //Llamada a la API
      this.$axios
        .put("/notificaciones", toSend, headerAxios)
        .then(res =>{
          this.$store.dispatch("getNotificaciones")
        })
        .catch(error =>{
          console.log(error);
          return;
        })

    },
    //Log out
    logOut(){
      //Notificamos por conolsa el deslogueo
      console.log("logout");
      //Limpiamos el local storage par aeliminar el token
      localStorage.clear()
      //Limpiamos nuestro store
      const authVacio= {};
      this.$store.commit("setAuth", authvacio)
      //Redirigimos al login
      window.location.href ="/login";

    },
    //UNIX A FECHA (NO es mia)
    unixToDate(ms) {
      var d = new Date(parseInt(ms)),
        yyyy = d.getFullYear(),
        mm = ("0" + (d.getMonth() + 1)).slice(-2), // Months are zero based. Add leading 0.
        dd = ("0" + d.getDate()).slice(-2), // Add leading 0.
        hh = d.getHours(),
        h = hh,
        min = ("0" + d.getMinutes()).slice(-2), // Add leading 0.
        ampm = "AM",
        time;

      if (hh > 12) {
        h = hh - 12;
        ampm = "PM";
      } else if (hh === 12) {
        h = 12;
        ampm = "PM";
      } else if (hh == 0) {
        h = 12;
      }

      // ie: 2013-02-18, 8:35 AM
      time = dd + "/" + mm + "/" + yyyy + ", " + h + ":" + min + " " + ampm;

      return time;
    },
  }
};
</script>
<style scoped>
.top-navbar {
  top: 0px;
}
</style>
