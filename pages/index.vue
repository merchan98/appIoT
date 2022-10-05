<template>

    <div>
        Ready!
    </div>

</template> 


<!-- Script para que redirija la pagina a dasboard-->
<script>

    export default {
        middleware: 'autentificador',
        mounted() {
            $nuxt.$router.push("/dashboard");
        },
    }
</script>

