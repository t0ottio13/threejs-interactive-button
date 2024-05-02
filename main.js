import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

let renderer, scene, camera, controls;

function init(){
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: canvas
    });
    renderer.setSize(window.innerHeight, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    scene = new THREE.Scene();

    // カメラの設定
    camera = new THREE.PerspectiveCamera(
        45,
		window.innerWidth / window.innerHeight,
		1,
		2000
    );
    camera.position.set(1, 1, 1);
    camera.lookAt(-20, 0, -20);
    camera.updateProjectionMatrix();

    // 画面操作の設定
    controls = new OrbitControls(camera, canvas);
    // 操作を制限
    // controls.enableRotate = false;
    // controls.enablePan = false;
    // controls.enableDamping = true;

    // 照明の設定
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1,1,1);
    directionalLight.castShadow = true;
	directionalLight.shadow.camera.top = 180;
	directionalLight.shadow.camera.bottom = -100;
	directionalLight.shadow.camera.left = -120;
	directionalLight.shadow.camera.right = 120;

	// soft shadow
	directionalLight.shadow.mapSize.width = 1024;
	directionalLight.shadow.mapSize.height = 1024;
	directionalLight.shadow.camera.near = 0.5;
	directionalLight.shadow.camera.far = 500;
    scene.add(directionalLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x555555, 1);
	hemiLight.position.set(0, -1, 0);
	scene.add(hemiLight);

    const loader = new GLTFLoader();
    loader.load('gltf/button_animation.glb', (gltf) => {
        scene.add(gltf.scene);
    });

    console.log(loader);

    render();
}

function render(){
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    controls.update();
}

init();