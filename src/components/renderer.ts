import * as THREE from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default class Renderer {
    scene: THREE.Scene;
    camera: THREE.OrthographicCamera;
    renderer: THREE.WebGLRenderer;
    park?: GLTF;

    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.OrthographicCamera(0, 0, 0, 0);
        this.renderer = new THREE.WebGLRenderer();
    }

    init = async () => {
        try {
            await this.loadModel();
            //点光源
            const point = new THREE.PointLight(0xffffff);
            point.position.set(400, 200, 300); //点光源位置
            this.scene.add(point); //点光源添加到场景中
            //环境光
            const ambient = new THREE.AmbientLight(0x444444);
            this.scene.add(ambient);
            //执行渲染操作   指定场景、相机作为参数
            const dom = document.getElementById("park3d");
            if (dom) {
                const width = dom.clientWidth; //窗口宽度
                const height = dom.clientHeight; //窗口高度
                const k = width / height; //窗口宽高比
                const s = 200; //三维场景显示范围控制系数，系数越大，显示的范围越大
                this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 1, 1000);
                this.camera.position.set(200, 300, 200); //设置相机位置
                this.camera.lookAt(this.scene.position); //设置相机方向(指向的场景对象)
                this.camera.zoom = 40;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(dom.clientWidth, dom.clientHeight); //设置渲染区域尺寸
                this.renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
                dom.appendChild(this.renderer.domElement); //body元素中插入canvas对象
                //创建控件对象
                const controls = new OrbitControls(this.camera, this.renderer.domElement);
                controls.minPolarAngle = -Math.PI * (0 / 180);
                controls.maxPolarAngle = Math.PI * (90 / 180);
                this.render();
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }

    render = () => {
        // this.park?.scene.translateY(0.1);
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render);
    }

    loadModel = async () => {
        const loader = new GLTFLoader();
        try {
            const path = process.env.NODE_ENV !== "github" ? "/static/pittsburg.gltf" : process.env.VUE_APP_PATH + "/static/pittsburg.gltf";
            this.park = await loader.loadAsync(path);
            if (this.park) {
                this.scene.add(this.park.scene);
                this.park.scene.translateX(10);
                this.park.scene.translateY(20);
                this.park.scene.translateZ(0);
                this.park.scene.rotateX(-0.1);
                this.park.scene.rotateZ(0.1);
            }
        } catch (error) {
            return Promise.reject(error);
        }
    }
}