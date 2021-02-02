import { Scene, OrthographicCamera, WebGLRenderer, PointLight, AmbientLight, MOUSE } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { getStaticRes } from "../utils/commonUtil";

export default class Renderer {
    scene: Scene;
    camera: OrthographicCamera;
    renderer: WebGLRenderer;
    park?: GLTF;
    rotate: boolean;

    constructor() {
        this.scene = new Scene();
        this.camera = new OrthographicCamera(0, 0, 0, 0);
        this.renderer = new WebGLRenderer();
        this.rotate = true;
    }

    init = async () => {
        const dom = document.getElementById("park3d");
        if (!dom) {
            return Promise.reject("找不到dom节点");
        }
        try {
            await this.loadModel();
            this.initLight();
            this.initCamera(dom.clientWidth, dom.clientHeight);
            this.initController();
            this.initRenderer(dom.clientWidth, dom.clientHeight);
            dom.appendChild(this.renderer.domElement);
            this.render();
            window.onresize = this.onResize;
        } catch (error) {
            return Promise.reject(error);
        }
    }

    loadModel = async () => {
        const loader = new GLTFLoader();
        try {
            this.park = await loader.loadAsync(getStaticRes("/static/models/city.gltf"));
            this.scene.add(this.park.scene);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    initLight = () => {
        //点光源
        const point = new PointLight(0xffffff);
        point.position.set(400, 200, 300); //点光源位置
        this.scene.add(point); //点光源添加到场景中
        // 环境光
        const ambient = new AmbientLight(0x444444);
        this.scene.add(ambient);
    }

    initCamera = (width: number, height: number) => {
        this.camera.position.set(200, 300, 200);
        this.camera.lookAt(this.scene.position);
        this.camera.zoom = 20;
        this.resizeCamera(width, height);
    }

    initController = () => {
        const controls = new OrbitControls(this.camera, this.renderer.domElement);
        controls.mouseButtons = {
            LEFT: MOUSE.PAN,
            MIDDLE: MOUSE.DOLLY,
            RIGHT: MOUSE.ROTATE
        };
        controls.minPolarAngle = Math.PI * (0 / 180);
        controls.maxPolarAngle = Math.PI * (75 / 180);
        controls.minZoom = 10;
        controls.addEventListener("start", this.onMouseDown);
    }

    initRenderer = (width: number, height: number) => {
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0xb9d3ff, 1);
    }

    resizeCamera = (width: number, height: number) => {
        this.renderer.setSize(width, height);
        const k = width / height;
        const s = 200;
        this.camera.left = -s * k;
        this.camera.right = s * k;
        this.camera.top = s;
        this.camera.bottom = -s;
        this.camera.updateProjectionMatrix();
    }

    render = () => {
        if (this.rotate) {
            this.park?.scene.rotateY(0.0002);
        }
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render);
    }

    onResize = () => {
        const dom = document.getElementById("park3d");
        if (!dom) {
            return;
        }
        this.resizeCamera(dom.clientWidth, dom.clientHeight);
        this.renderer.setSize(dom.clientWidth, dom.clientHeight);
    }

    onMouseDown = (event: MouseEvent) => {
        this.rotate = false;
    }
}