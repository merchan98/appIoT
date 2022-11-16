<!-- Template por defecto de Creative Tim -->

<template>
  <div class="wrapper" :class="{ 'nav-open': $sidebar.showSidebar }">

    <notifications></notifications>
    
    <side-bar
      :background-color="sidebarBackground"
      short-title="DashIOT"
      title="DashBoard IoT"
    >
      <template slot-scope="props" slot="links">
        <sidebar-item
          :link="{
            name: 'Dashboard',
            icon: 'tim-icons icon-chart-pie-36',
            path: '/dashboard'
          }"
        >
        </sidebar-item>
        
        <sidebar-item
          :link="{
            name: 'Dispositivos',
            icon: 'tim-icons icon-atom',
            path: '/dispositivos'
          }"
        >
        </sidebar-item>
        
        <sidebar-item
          :link="{
            name: 'Alarmas/Reglas',
            icon: 'tim-icons icon-atom',
            path: '/alarmas'
          }"
        >
        </sidebar-item>
        <sidebar-item
          :link="{
            name: 'Plantillas',
            icon: 'tim-icons icon-atom',
            path: '/templates'
          }"
        >
        </sidebar-item>
        <!-- Descativado el boton Upgrade a PRO -->
        <!-- <li class="active-pro">
          <a href="https://www.creative-tim.com/product/nuxt-black-dashboard-pro" target="_blank">
            <i class="tim-icons icon-spaceship"></i>
            <p>Upgrade to PRO</p>
          </a>
        </li> -->

      </template>
    </side-bar>

    <!--Share plugin (for demo purposes). You can remove it if don't plan on using it-->
    <!-- <sidebar-share :background-color.sync="sidebarBackground"> </sidebar-share> -->
    
    <!-- Panel central-->
    <div class="main-panel" :data="sidebarBackground">
      <!--Barra de arriba-->
      <dashboard-navbar></dashboard-navbar>
      <router-view name="header"></router-view>

      <div
        :class="{ content: !isFullScreenRoute }"
        @click="toggleSidebar"
      >
        <zoom-center-transition :duration="200" mode="out-in">

          <!-- your content here -->

          <nuxt>          </nuxt>
          
        </zoom-center-transition>
      </div>
      <!--Footer-->
      <content-footer v-if="!isFullScreenRoute"></content-footer>
    </div>

  </div>
</template>
<script>
  /* eslint-disable no-new */
  import PerfectScrollbar from 'perfect-scrollbar';
  import 'perfect-scrollbar/css/perfect-scrollbar.css';
  import SidebarShare from '@/components/Layout/SidebarSharePlugin';
  function hasElement(className) {
    return document.getElementsByClassName(className).length > 0;
  }

  function initScrollbar(className) {
    if (hasElement(className)) {
      new PerfectScrollbar(`.${className}`);
    } else {
      // try to init it later in case this component is loaded async
      setTimeout(() => {
        initScrollbar(className);
      }, 100);
    }
  }

  import DashboardNavbar from '@/components/Layout/DashboardNavbar.vue';
  import ContentFooter from '@/components/Layout/ContentFooter.vue';
  import DashboardContent from '@/components/Layout/Content.vue';
  import { SlideYDownTransition, ZoomCenterTransition } from 'vue2-transitions';
  import mqtt from 'mqtt';

  export default {
    components: {
      DashboardNavbar,
      ContentFooter,
      DashboardContent,
      SlideYDownTransition,
      ZoomCenterTransition,
      SidebarShare
    },
    data() {
      return {
        sidebarBackground: 'vue', //vue|blue|orange|green|red|primary
        client: null,
        options: { //Opciones de mqtt
          port: 8083,
          host: 'localhost',
          endpoint: '/mqtt',
          clean: true,
          connectTimeout: 5000,
          reconnectPeriod: 5000,

          clientId: 'web' + this.$store.state.auth.datosUsuarios.nombre + "_" + Math.floor(Math.random()*(1-10000) * -1),
          username: 'superuser',
          password: 'superuser',
        },
        
      };
    },
    computed: {
      isFullScreenRoute() {
        return this.$route.path === '/maps/full-screen'
      }
    },
    methods: {
      toggleSidebar() {
        if (this.$sidebar.showSidebar) {
          this.$sidebar.displaySidebar(false);
        }
      },
      initScrollbar() {
        let docClasses = document.body.classList;
        let isWindows = navigator.platform.startsWith('Win');
        if (isWindows) {
          // if we are on windows OS we activate the perfectScrollbar function
          initScrollbar('sidebar');
          initScrollbar('main-panel');
          initScrollbar('sidebar-wrapper');

          docClasses.add('perfect-scrollbar-on');
        } else {
          docClasses.add('perfect-scrollbar-off');
        }
      },
      async getMqttCredenciales(){
        try {
          //Cabecera de AXIOS
          const headerAxios ={
            headers:{
              token: this.$store.state.auth.token
            }
          }
          console.log("LLEGO A GET CREDENCIALES");
          //LLAmada a xios para llamar a la API
          const credenciales = await this.$axios.post("/getMqttcredenciales", null, headerAxios);
  
          //Grabamos las credeciales en opcion del data
          if(credenciales.data.status == "success"){
            this.options.username = credenciales.data.username;
            this.options.password = credenciales.data.password;
          }else{
            console.log("Las credenciales no se han grabado correctamente");
          }
        } catch (error) {
          console.log(error);
          if(error.response.status ==401){
            console.log("El token no es valido");
            localStorage.clear();
            window.location.href ="/login";
          }
        }
      },
      async getMqttCredencialesReconnect(){
        try {
          //Cabecera de AXIOS
          const headerAxios ={
            headers:{
              token: this.$store.state.auth.token
            }
          }
          //LLAmada a xios para llamar a la API
          const credenciales = await this.$axios.post("/getMqttcredencialesReconexion", null, headerAxios);
          console.log("Data de las credenciales");
          console.log(credenciales.data);
  
          //Grabamos las credeciales en opcion del data
          if(credenciales.data.status == "success"){
            this.client.options.username = 'superuser'//credenciales.data.username;
            this.client.options.password = 'superuser'//credenciales.data.password;
          }else{
            console.log("Las credenciales no se han grabado correctamente");
          }
        } catch (error) {
          console.log(error);
          //Por si se ha vencido el token
          if(error.response.status ==401){
            console.log("El otken no es valido");
            localStorage.clear();
            window.location.href ="/login";
          }
        }
      },
      async startMqttClient(){
        //Constantes y variables

        //Conseguimos las credenciales
        await this.getMqttCredenciales();
        
        //Contrucion de los tipicos
        const topicDispositivo =  this.$store.state.auth.datosUsuarios._id + '/+/+/sdata';
        const topicNotificaciones =  this.$store.state.auth.datosUsuarios._id + "/+/+/notif";
        //Url de construccion
        const urlconnect = "ws://" + this.options.host + ":" + this.options.port + this.options.endpoint;
        

        //Conexion del cliente
        try {
          this.client = mqtt.connect(urlconnect, this.options);
          
        } catch (error) {
          console.log("Error en el cliente MQTT del front");
          console.log(error);
        }
        


        //Hooks o ganchos
        this.client.on('connect', () => {
          console.log("MQTT CONEXION -> SUCCESSS; \n");
  
          //Nos subcribimos al topic del dispositivo
          
          
          this.client.subscribe(topicDispositivo, { qos:0 }, (error) =>{
            if(error){
              console.log("Error al subcibirse al topic del Dispositivo");
              console.log(error);
              return;
            }
            // this.client.publish(topicDispositivo,'hello');
            console.log("Conexion correcta con el topic del Dispositivo");
            console.log(topicDispositivo);
            return 0;
          });
          
          
          //Nos subcribimos al topic del notificaciones
          this.client.subscribe(topicNotificaciones, {qos:0}, (error)=>{
            if(error){
              console.log("Error al subcibirse al topic del Notificaciones");
              console.log(error);
              return;
            }
            console.log("Conexion correcta con el topic del Notificaciones");
            console.log(topicNotificaciones);
          })
          // console.log(this.client);
        });

        //Reconexion
        this.client.on('reconnect', error => {
          console.log("RECONECTANDO \n");
          console.log(error);
  
          this.getMqttCredencialesReconnect();
        });
        //Error
        this.client.on('error', error => {
          console.log("MQTT CONEXION -> FAIL; \n");
          console.log(error);
        });

        this.client.on("disconnect", error => {
          console.log("MQTT disconnect EVENT FIRED:", error);
        });

        console.log(this.client);
        //Recibimos un mensaje
        this.client.on('message',(topic, message) =>{
          console.log("Menseje desde el topic"+ topic+" => ");
          console.log(message.toString()); 
  
          try {
            //Dividimos el topic
            const splitTopic= topic.split("/");
            const tipoMensaje= splitTopic[3];
  
            if(tipoMensaje == "notif"){
              this.$notify({
                type: 'danger',
                icon: 'tim-icons icon-alert-circle-exec',
                message: message.toString()
              })
              //para recibir las notificaciones
              this.$store.dispatch("getNotificaciones");
              return;
            }else if (tipoMensaje == "sdata"){
              //pasamos el mesnaje a los dispositivos atrves de mensajeria de nuxt
              $nuxt.$emit(topic, JSON.parse(message.toString()));
              return;
            }
          } catch (error) {
            console.log("Error en al manejar el mensaje recibido de mqtt");
            console.log(error);
          }
        });
  
        $nuxt.$on('mqtt-sender', (toSend) => {
          //
          this.client.publish(toSend.topic, JSON.stringify(toSend.msg));
        });
  
      }
    },
    beforeDestroy() {
    this.$nuxt.$off("mqtt-sender");
    },
    mounted() {
      this.initScrollbar(); 
      //para recibir las notificaciones
      this.$store.dispatch("getNotificaciones");
      //Iniciamos el cliente MQTT
      setTimeout(() =>{
        this.startMqttClient();
      }, 2000)
    }
  };
</script>
<style lang="scss">
  $scaleSize: 0.95;
  @keyframes zoomIn95 {
    from {
      opacity: 0;
      transform: scale3d($scaleSize, $scaleSize, $scaleSize);
    }
    to {
      opacity: 1;
    }
  }

  .main-panel .zoomIn {
    animation-name: zoomIn95;
  }

  @keyframes zoomOut95 {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
      transform: scale3d($scaleSize, $scaleSize, $scaleSize);
    }
  }

  .main-panel .zoomOut {
    animation-name: zoomOut95;
  }
</style>

