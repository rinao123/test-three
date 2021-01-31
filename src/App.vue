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
body {
  margin: 0;
}
</style>