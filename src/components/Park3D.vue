<template>
  <div class="park3d" id="park3d" />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

@Options({})
export default class HelloWorld extends Vue {
  scene: THREE.Scene;
  camera: THREE.OrthographicCamera;
  renderer: THREE.WebGLRenderer;
  park?: GLTF;

  constructor(props: any) {
    super(props);
    this.scene = new THREE.Scene();
    this.camera = new THREE.OrthographicCamera(0, 0, 0, 0);
    this.renderer = new THREE.WebGLRenderer();
  }

  mounted() {
    this.init();
  }

  init = async () => {
    const scene = new THREE.Scene();
    /**
     * 创建网格模型
     */
    const loader = new GLTFLoader();
    this.park = await loader.loadAsync("/static/pittsburg.gltf");
    if (this.park) {
      scene.add(this.park.scene);
    }
    
    // let geometry = new THREE.SphereGeometry(60, 40, 40); //创建一个球体几何对象
    // const geometry = new THREE.BoxGeometry(100, 100, 100); //创建一个立方体几何对象Geometry
    // const material = new THREE.MeshLambertMaterial({
    //   color: 0x0000ff,
    // }); //材质对象Material
    // const mesh = new THREE.Mesh(geometry, material); //网格模型对象Mesh
    // scene.add(mesh); //网格模型添加到场景中
    /**
     * 光源设置
     */
    //点光源
    const point = new THREE.PointLight(0xffffff);
    point.position.set(400, 200, 300); //点光源位置
    scene.add(point); //点光源添加到场景中
    //环境光
    const ambient = new THREE.AmbientLight(0x444444);
    scene.add(ambient);
    //执行渲染操作   指定场景、相机作为参数
    const dom = document.getElementById("park3d");
    if (dom) {
      const width = dom.clientWidth; //窗口宽度
      const height = dom.clientHeight; //窗口高度
      const k = width / height; //窗口宽高比
      const s = 200; //三维场景显示范围控制系数，系数越大，显示的范围越大
      this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
      this.camera.position.set(200, 300, 200); //设置相机位置
      this.camera.lookAt(scene.position); //设置相机方向(指向的场景对象)
      this.renderer.setSize(dom.clientWidth, dom.clientHeight); //设置渲染区域尺寸
      this.renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
      dom.appendChild(this.renderer.domElement); //body元素中插入canvas对象
      this.renderer.render(scene, this.camera);
    }
  };
}
</script>

<style scoped>
.park3d {
  width: 100%;
  height: 100%;
}
</style>
