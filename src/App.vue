<template>
  <Park3D />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Park3D from "./components/Park3D.vue";

@Options({
  components: {
    Park3D
  }
})
export default class App extends Vue {}
</script>

<style>
html {
  width: 100%;
  height: 100%;
}

body {
  margin: 0;
  width: 100%;
  height: 100%;
}

#app {
  width: 100%;
  height: 100%;
}
</style>