import { Scene, OrthographicCamera, WebGLRenderer, PointLight, AmbientLight, MOUSE } from "three";
import { GLTF, GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as Cesium from "cesium";
import { getStaticRes } from "../utils/commonUtil";
import "cesium/Build/Cesium/Widgets/widgets.css";

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

    init = async (): Promise<void> => {
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

    loadModel = async (): Promise<void> => {
        const loader = new GLTFLoader();
        try {
            this.park = await loader.loadAsync(getStaticRes("/static/models/city.gltf"));
            this.scene.add(this.park.scene);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    initLight = (): void => {
        //点光源
        const point = new PointLight(0xffffff);
        point.position.set(400, 200, 300); //点光源位置
        this.scene.add(point); //点光源添加到场景中
        // 环境光
        const ambient = new AmbientLight(0x444444);
        this.scene.add(ambient);
    }

    initCamera = (width: number, height: number): void => {
        this.camera.position.set(200, 300, 200);
        this.camera.lookAt(this.scene.position);
        this.camera.zoom = 20;
        this.resizeCamera(width, height);
    }

    initController = (): void => {
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

    initRenderer = (width: number, height: number): void => {
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0xb9d3ff, 1);
    }

    resizeCamera = (width: number, height: number): void => {
        this.renderer.setSize(width, height);
        const k = width / height;
        const s = 200;
        this.camera.left = -s * k;
        this.camera.right = s * k;
        this.camera.top = s;
        this.camera.bottom = -s;
        this.camera.updateProjectionMatrix();
    }

    render = (): void => {
        if (this.rotate) {
            this.park?.scene.rotateY(0.0002);
        }
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame(this.render);
    }

    onResize = (): void => {
        const dom = document.getElementById("park3d");
        if (!dom) {
            return;
        }
        this.resizeCamera(dom.clientWidth, dom.clientHeight);
        this.renderer.setSize(dom.clientWidth, dom.clientHeight);
    }

    onMouseDown = (): void => {
        this.rotate = false;
    }

    initCesium = (): void => {
        Object.assign(window, { CESIUM_BASE_URL: "/static/cesium/" });
        Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYTIzMzUyOS1hNTFiLTQzMzQtYmUwYS02OTRlNTFhNzI0MWUiLCJpZCI6NDMyODMsImlhdCI6MTYxMjQwNDEzOX0.c_qcuv76y5cAnA9Hag2Iqpk1KbbrkwpgUUwPa6NsKqQ";
        // Initialize the Cesium Viewer in the HTML element with the "cesiumContainer" ID.
        const viewer = new Cesium.Viewer("park3d", {
            // terrainProvider: Cesium.createWorldTerrain(),
            animation: false,
            baseLayerPicker: false,
            vrButton: false,
            geocoder: false,
            navigationHelpButton: false,
            navigationInstructionsInitiallyVisible: false,
            fullscreenButton: false,
            homeButton: false,
            infoBox: false,
            sceneModePicker: false,
            selectionIndicator: false,
            timeline: false,
            useBrowserRecommendedResolution: false
        });
        (viewer.cesiumWidget.creditContainer as HTMLDivElement).style.display = "none";
        const tileset = new Cesium.Cesium3DTileset({
            url: getStaticRes("/static/tiles/tileset.json")
        });
        //添加到球体上
        viewer.scene.primitives.add(tileset);
        //定位过去
        viewer.zoomTo(tileset);
        // Fly the camera to San Francisco at the given longitude, latitude, and height.
        // viewer.camera.flyTo({
        //     destination: Cesium.Cartesian3.fromDegrees(-122.4175, 37.655, 400),
        //     orientation: {
        //         heading: Cesium.Math.toRadians(0.0),
        //         pitch: Cesium.Math.toRadians(-15.0),
        //     }
        // });
    }
}