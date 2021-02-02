<template>
  <div class="park3d" id="park3d">
    <img :src="loadingGif" v-if="loading" />
    <span class="err-msg" v-if="errMsg">{{errMsg}}</span>
  </div>
</template>

<script lang="ts">
import { Vue } from "vue-class-component";
import { getStaticRes } from "../utils/commonUtil";
import Renderer from "./renderer";

export default class Park3d extends Vue {
  loadingGif: string;
  loading: boolean;
  errMsg: string;
  renderer: Renderer;

  constructor(props: unknown) {
    super(props);
    this.loadingGif = getStaticRes("/static/images/loading.gif");
    this.loading = true;
    this.errMsg = "";
    this.renderer = new Renderer();
  }

  mounted() {
    this.init();
  }

  init = async (): Promise<void> => {
    try {
      await this.renderer.init();
    } catch (error) {
      console.warn(error);
      if (typeof error === "string") {
        this.errMsg = error;
      } else {
        this.errMsg = "加载失败";
      }
    } finally {
      this.loading = false;
    }
  }
}
</script>

<style scoped>
.park3d {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.err-msg {
  font-size: 40px;
}
</style>
