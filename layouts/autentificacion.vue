<!-- Layouts para autentificacion-->

<template>
    <div class="wrapper">

        <notifications></notifications>

        <div style="margin-top: 18px"><!-- Panel central-->
        <zoom-center-transition :duration="200" mode="out-in">
            <!-- Poner aqui el contenido-->
            <nuxt>          </nuxt>
        </zoom-center-transition></div>
    </div>
</template>

<script>
  /* eslint-disable no-new */
import PerfectScrollbar from 'perfect-scrollbar';
import 'perfect-scrollbar/css/perfect-scrollbar.css';

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

import { SlideYDownTransition, ZoomCenterTransition } from 'vue2-transitions';

export default {
    components: {
        SlideYDownTransition,
        ZoomCenterTransition,
    },
        computed: {
            isFullScreenRoute() {
                return this.$route.path === '/maps/full-screen'
            }
        },
        methods: {
            initScrollbar() {
                let docClasses = document.body.classList;
                let isWindows = navigator.platform.startsWith('Win');
                if (isWindows) {
                    // if we are on windows OS we activate the perfectScrollbar function
                    initScrollbar('main-panel');
                    docClasses.add('perfect-scrollbar-on');
                } else {
                    
                }
            }
        },
        mounted() {
            this.initScrollbar();
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
