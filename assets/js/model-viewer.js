import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

export async function mountModelViewer(container, source) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf1eeea);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.01, 10000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  container.innerHTML = "";
  container.classList.add("model-viewer");
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.3;

  scene.add(new THREE.HemisphereLight(0xffffff, 0x78736f, 2.1));

  const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
  keyLight.position.set(4, 5, 6);
  keyLight.castShadow = true;
  scene.add(keyLight);

  const fillLight = new THREE.DirectionalLight(0x8da7ff, 1.5);
  fillLight.position.set(-5, 1, -3);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffffff, 1.2);
  rimLight.position.set(0, -4, 5);
  scene.add(rimLight);

  const dracoLoader = new DRACOLoader();
  dracoLoader.setDecoderPath(
    new URL("../vendor/three/examples/jsm/libs/draco/", import.meta.url).href
  );
  dracoLoader.setWorkerLimit(2);

  const loader = new GLTFLoader();
  loader.setDRACOLoader(dracoLoader);

  let gltf;
  try {
    gltf = await loader.loadAsync(source);
  } finally {
    dracoLoader.dispose();
  }
  const importedScene = gltf.scene || gltf.scenes?.[0];

  if (!importedScene) {
    throw new Error("The GLB file does not contain a renderable scene.");
  }

  importedScene.traverse((object) => {
    if (!object.isMesh) return;
    object.castShadow = true;
    object.receiveShadow = true;
  });

  const modelRoot = new THREE.Group();
  modelRoot.add(importedScene);
  scene.add(modelRoot);
  modelRoot.updateMatrixWorld(true);

  const initialBounds = new THREE.Box3().setFromObject(modelRoot);
  if (initialBounds.isEmpty()) {
    throw new Error("The GLB scene does not contain visible model geometry.");
  }

  const initialCenter = initialBounds.getCenter(new THREE.Vector3());
  modelRoot.position.sub(initialCenter);
  modelRoot.updateMatrixWorld(true);

  const bounds = new THREE.Box3().setFromObject(modelRoot);
  const size = bounds.getSize(new THREE.Vector3());
  const maxDimension = Math.max(size.x, size.y, size.z) || 1;

  const initialWidth = Math.max(container.clientWidth, 1);
  const initialHeight = Math.max(container.clientHeight, 1);
  camera.aspect = initialWidth / initialHeight;
  renderer.setSize(initialWidth, initialHeight, false);

  const boundingSphere = bounds.getBoundingSphere(new THREE.Sphere());
  const modelCenter = boundingSphere.center;
  const modelRadius = Math.max(boundingSphere.radius, maxDimension * 0.5, 0.001);
  const verticalFov = THREE.MathUtils.degToRad(camera.fov);
  const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * camera.aspect);
  const limitingFov = Math.min(verticalFov, horizontalFov);
  const distance = (modelRadius / Math.sin(limitingFov / 2)) * 1.08;
  const viewDirection = new THREE.Vector3(1, 0.65, 1).normalize();

  camera.position.copy(modelCenter).addScaledVector(viewDirection, distance);
  camera.near = Math.max(maxDimension / 1000, 0.001);
  camera.far = Math.max(maxDimension * 100, distance * 10);
  camera.updateProjectionMatrix();
  controls.target.copy(modelCenter);
  controls.minDistance = modelRadius * 0.5;
  controls.maxDistance = modelRadius * 12;
  controls.update();

  let frameId = 0;
  const resize = () => {
    const width = Math.max(container.clientWidth, 1);
    const height = Math.max(container.clientHeight, 1);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };

  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);
  resize();

  const render = () => {
    controls.update();
    renderer.render(scene, camera);
    frameId = requestAnimationFrame(render);
  };
  render();

  return () => {
    cancelAnimationFrame(frameId);
    resizeObserver.disconnect();
    controls.dispose();

    const geometries = new Set();
    const materials = new Set();
    const textures = new Set();

    modelRoot.traverse((object) => {
      if (object.geometry) geometries.add(object.geometry);
      const objectMaterials = Array.isArray(object.material)
        ? object.material
        : object.material
          ? [object.material]
          : [];

      objectMaterials.forEach((material) => {
        materials.add(material);
        Object.values(material).forEach((value) => {
          if (value?.isTexture) textures.add(value);
        });
      });
    });

    geometries.forEach((geometry) => geometry.dispose());
    textures.forEach((texture) => texture.dispose());
    materials.forEach((material) => material.dispose());
    renderer.dispose();
    container.classList.remove("model-viewer");
  };
}
