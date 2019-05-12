<template>
  <v-app id="app">
    <header-component></header-component>
    <router-view/>
  </v-app>
</template>

<script>
import HeaderComponent from './components/HeaderComponent.vue'
export default {
  components: { HeaderComponent }
}
</script>
