import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

let renderer, scene, camera, controls, mixer;

let actions = {};

function init(){
    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: canvas
    });
    renderer.setSize(window.innerHeight, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    window.addEventListener("resize", onWindowResize);

    scene = new THREE.Scene();

    // カメラの設定
    camera = new THREE.PerspectiveCamera(
        45,
		window.innerWidth / window.innerHeight,
		1,
		2000
    );
    camera.position.set(1, 1, 1);
    //camera.lookAt(-20, 0, -20);

    // 画面操作の設定
    controls = new OrbitControls(camera, canvas);
    // 操作を制限
    // controls.enableRotate = false;
    // controls.enablePan = false;
    // controls.enableDamping = true;

    // 照明の設定
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
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
        const model = gltf.scene;
        scene.add(model);

        mixer = new THREE.AnimationMixer(model);

        if(gltf.animations.length > 0){
            let clips = [];

			console.log("original animation clips", gltf.animations);
			// split clips by names
			gltf.animations[0].tracks.forEach((track) => {
				const clip = clips.find(
					(clip) => clip.name == track.name.split(".")[0]
				);
				// if clip is exist
				if (clip) {
					clip.tracks.push(track);
				} else {
					//if not, make clip with their name
					const clip = new THREE.AnimationClip(track.name.split(".")[0], -1, [
						track,
					]);
					clips.push(clip);
				}
			});

            // split animation clips
			gltf.animations = clips;

			// link to actions
			clips.forEach((clip) => {
				actions[clip.name] = mixer.clipAction(clip);
				actions[clip.name].loop = THREE.LoopOnce;
			});
			// check animations
			console.log("Animations : ", actions);
        }

        render();
    });
}

// 画面のリサイズ
function onWindowResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}

function render(){
    requestAnimationFrame(render);
    renderer.render(scene, camera);
    animate();
}

// type below
const raycater = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// 画面のクリックイベントを取得
window.addEventListener("click", (event) => {
	// console.log(event.clientX, event.clientY);

	mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
	mouse.y = -1 *((event.clientY / window.innerHeight) * 2 - 1);
	// console.log(mouse);

	raycater.setFromCamera(mouse, camera);
	const intersects = raycater.intersectObjects(scene.children, true);

	if(intersects[0]){
		const targetAction = actions[intersects[0].object.name];
        console.log(targetAction);
		if(targetAction){
			targetAction.reset();
			targetAction.play();
            console.log("play");
		}
	}
});

const clock = new THREE.Clock();

function animate(){
    mixer.update(clock.getDelta());
}

init();