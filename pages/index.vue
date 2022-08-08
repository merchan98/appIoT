<template>

    <div>
        Ready!
    </div>

</template> 


<!-- Script para que redirija la pagina a dasboard-->
<script>

    export default {
        mounted() {
            $nuxt.$router.push("/dashboard");
        },
    }
</script>

