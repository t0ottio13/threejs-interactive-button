import * as THREE from 'three';

let renderer, scene, camera;

function init(){
    const canvas = document.createElement("canvas");
    document.body.appendChild(canvas);

    renderer = new THREE.WebGLRenderer({canvas: canvas});
    renderer.setSize(window.innerHeight, window.innerHeight);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera();

    const light = new THREE.DirectionalLight();
    scene.add(light);

    render();
}

function render(){
    renderer.render(scene, camera);
    requestAnimationFrame(render);
}


init();