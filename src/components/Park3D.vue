<template>
  <div class="park3d" id="park3d" />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Renderer from "./renderer";

@Options({})
export default class Park3d extends Vue {
  renderer: Renderer;

  constructor(props: unknown) {
    super(props);
    this.renderer = new Renderer();
  }

  mounted() {
    this.renderer.init();
  }
}
</script>

<style scoped>
.park3d {
  width: 100%;
  height: 100%;
}
</style>
