import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TextureLoader } from 'three';

let scene, camera, renderer, controls, sun, earth, externalModel, heartMesh;

init();
animate();

function init() {
    // Scene setup
    scene = new THREE.Scene();

    // Background texture
    const textureLoader = new TextureLoader();
    const backgroundTexture = textureLoader.load('/galaxia.jpg');
    scene.background = backgroundTexture;

    // Camera setup
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 20, 50);

    // Renderer setup
    renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Orbit controls
    controls = new OrbitControls(camera, renderer.domElement);

    // Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.0); // Aumente a intensidade da luz ambiente
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2.0); // Aumente a intensidade da luz direcional
    directionalLight.position.set(50, 50, 50);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xffffff, 2.0, 100); // Aumente a intensidade da luz pontual
    pointLight.position.set(0, 0, 50);
    scene.add(pointLight);

    // Load textures
    const texture = textureLoader.load('/texture.jpg');

    // Sun setup
    const width = 8;
    const height = 8;
    const depth = 8;
    const widthSegments = 4;
    const heightSegments = 4;
    const depthSegments = 4;
    const sunGeometry = new THREE.BoxGeometry(
        width, height, depth,
        widthSegments, heightSegments, depthSegments
    );
    const sunMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        metalness: 0.5,
        roughness: 0.1
    });
    sun = new THREE.Mesh(sunGeometry, sunMaterial);
    scene.add(sun);

    // Earth setup
    const radius = 7;
    const detail = 2;
    const earthGeometry = new THREE.IcosahedronGeometry(radius, detail);
    const earthMaterial = new THREE.MeshStandardMaterial({ map: texture });
    earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    // External model setup
    const loader = new GLTFLoader();
    loader.load('/liliana/scene.gltf', function (gltf) {
        externalModel = gltf.scene;
        externalModel.scale.set(5, 5, 5);
        externalModel.position.set(0, 10, 0);
        externalModel.traverse((child) => {
            if (child.isMesh) {
                child.material.metalness = 0.5;
                child.material.roughness = 0.5;
            }
        });
        scene.add(externalModel);

        // Create shape and extruded geometry
        const shape = new THREE.Shape();
        const x = -0.5; // Ajustado para o tamanho correto
        const y = -1;
        shape.moveTo(x + 0.5, y + 0.5);
        shape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
        shape.bezierCurveTo(x - 0.75, y, x - 0.75, y + 0.75, x - 0.75, y + 0.75);
        shape.bezierCurveTo(x - 0.75, y + 1.25, x - 0.25, y + 1.5, x + 0.5, y + 1.75);
        shape.bezierCurveTo(x + 1.25, y + 1.5, x + 1.6, y + 1, x + 1.6, y + 0.75);
        shape.bezierCurveTo(x + 1.6, y + 0.75, x + 1.6, y, x + 1, y);
        shape.bezierCurveTo(x + 0.75, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);

        const extrudeSettings = {
            steps: 2,
            depth: 0.5, // Ajustado para o tamanho correto
            bevelEnabled: true,
            bevelThickness: 0.25,
            bevelSize: 0.25,
            bevelSegments: 2
        };

        const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

        // Create material with texture
        const heartTexture = textureLoader.load('/texture.jpg');
        const material = new THREE.MeshStandardMaterial({
            map: heartTexture,
            emissive: 0xff0000, // Adicione uma cor emissiva vermelha para dar brilho
            emissiveIntensity: 0.5, // Ajuste a intensidade emissiva
            metalness: 0.7, // Aumente o valor de metalness
            roughness: 0.3 // Diminua o valor de roughness
        });

        heartMesh = new THREE.Mesh(geometry, material);

        // Find the head bone or mesh and attach the heartMesh to it
        const head = externalModel.getObjectByName('Head'); // Substitute 'Head' with the actual name of the head bone or mesh
        if (head) {
            heartMesh.position.set(0, 2, 0); // Ajuste para a posição acima da cabeça
            heartMesh.rotation.set(Math.PI, 0, 0); // Ajuste de rotação para estar em pé
            head.add(heartMesh);
        } else {
            // If the head node is not found, add the heartMesh to the scene and position it manually
            heartMesh.position.set(0, 20, 0); // Ajuste para ficar acima do modelo
            heartMesh.rotation.set(Math.PI, 0, 0); // Ajuste de rotação para estar em pé
            scene.add(heartMesh);
        }
    });

    // Handle window resize
    window.addEventListener('resize', onWindowResize, false);
}

function animate() {
    requestAnimationFrame(animate);

    // Rotate the earth around the sun
    const time = Date.now() * 0.0005;
    earth.position.x = Math.sin(time) * 30;
    earth.position.z = Math.cos(time) * 30;

    // Rotate the sun
    sun.rotation.y += 0.01;

    // Make the external model dance or spin
    if (externalModel) {
        externalModel.rotation.y += 0.01;

        // Rotate the heartMesh if it's attached to the head
        if (heartMesh) {
            heartMesh.rotation.y += 0.01; // Make the heartMesh rotate with the model
        }
    }

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
