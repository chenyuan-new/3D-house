import * as THREE from "three";
import * as dat from "lil-gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const gui = new dat.GUI();

const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load("/textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("/textures/door/alpha.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "/textures/door/ambientOcclusion.jpg"
);
const doorHeightTexture = textureLoader.load("/textures/door/height.jpg");
const doorNormalTexture = textureLoader.load("/textures/door/normal.jpg");
const doorMetalnessTexture = textureLoader.load("/textures/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

const bricksColorTexture = textureLoader.load("/textures/bricks/color.jpg");
const bricksAmbientOcclusionTexture = textureLoader.load(
  "/textures/bricks/ambientOcclusion.jpg"
);
const bricksNormalTexture = textureLoader.load("/textures/bricks/normal.jpg");
const bricksRoughnessTexture = textureLoader.load(
  "/textures/bricks/roughness.jpg"
);

const grassColorTexture = textureLoader.load("/textures/grass/color.jpg");
const grassAmbientOcclusionTexture = textureLoader.load(
  "/textures/grass/ambientOcclusion.jpg"
);
const grassNormalTexture = textureLoader.load("/textures/grass/normal.jpg");
const grassRoughnessTexture = textureLoader.load(
  "/textures/grass/roughness.jpg"
);

grassColorTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);
// repeat should be used with wrapS and wrapT
// otherwise only the last pixel stretches and not repeat the texture
grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

const scene = new THREE.Scene();

const house = new THREE.Group();
scene.add(house);

/**
 *
 * house and environment
 *
 */

/**
 * walls
 */
const wallsSize = {
  width: 4,
  height: 2.5,
  depth: 4,
};

const walls = new THREE.Mesh(
  new THREE.BoxGeometry(wallsSize.width, wallsSize.height, wallsSize.depth),
  new THREE.MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
  })
);

walls.position.y = wallsSize.height / 2;

walls.castShadow = true;
// uv is 2d
walls.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
house.add(walls);

/**
 * roof
 */
const roofSize = {
  radius: 3.5,
  height: 1,
  segments: 4,
};
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(roofSize.radius, roofSize.height, roofSize.segments),
  new THREE.MeshStandardMaterial({ color: "#b35f45" })
);
roof.rotation.y = Math.PI / 4;
roof.position.y = wallsSize.height + roofSize.height / 2;
house.add(roof);

// Door
const door = new THREE.Mesh(
  // segments can add more details but may cause performant problem
  new THREE.PlaneGeometry(2, 2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    // only keep the texture of the door
    transparent: true,
    alphaMap: doorAlphaTexture,
    // add more details and should remember adding uv2 below
    aoMap: doorAmbientOcclusionTexture,
    // add depth
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
door.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.y = 1;
door.position.z = wallsSize.width / 2 + 0.01;
house.add(door);

/**
 * Bushes
 */
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.castShadow = true;
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.castShadow = true;
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.castShadow = true;
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.castShadow = true;
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);

/**
 * graves
 */

const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.1);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#727272" });

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2; // Random angle
  const radius = 3 + Math.random() * 6; // Random radius
  const x = Math.cos(angle) * radius; // Get the x position using cosinus
  const z = Math.sin(angle) * radius; // Get the z position using sinus

  // Create the mesh
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.castShadow = true;

  // Position
  grave.position.set(x, 0.3, z);

  // Rotation
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;

  // Add to the graves container
  graves.add(grave);
}

const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
);

floor.receiveShadow = true;
floor.geometry.setAttribute(
  "uv2",
  new THREE.Float32BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
scene.add(floor);

/**
 * ghosts
 */
const ghost1 = new THREE.PointLight("#ff00ff", 3, 3);
ghost1.castShadow = true;
ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 7;

const ghost2 = new THREE.PointLight("#00ffff", 3, 3);
ghost2.castShadow = true;
ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 7;

const ghost3 = new THREE.PointLight("#ff7800", 3, 3);
ghost3.castShadow = true;
ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 7;
scene.add(ghost1, ghost2, ghost3);

/**
 *
 * lights and gui
 *
 *
 */

const ambientLight = new THREE.AmbientLight("#b9d5ff", 0.12);
gui
  .add(ambientLight, "intensity")
  .min(0)
  .max(1)
  .step(0.01)
  .name("ambient light intensity");
scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight("#b9d5ff", 0.12);
moonLight.position.set(4, 5, -2);
moonLight.castShadow = true;
moonLight.shadow.mapSize.width = 256;
moonLight.shadow.mapSize.height = 256;
moonLight.shadow.camera.far = 15;
scene.add(moonLight);

/**
 * door light
 */
const doorLight = new THREE.PointLight("#ff7d46", 1, 7);
doorLight.castShadow = true;
doorLight.shadow.mapSize.width = 256;
doorLight.shadow.mapSize.height = 256;
doorLight.shadow.camera.far = 7;

doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

/**
 * fog
 */
const fog = new THREE.Fog("#262837", 1, 15);
scene.fog = fog;

const moonLightHelper = new THREE.DirectionalLightHelper(moonLight, 2);
moonLightHelper.visible = false;

const doorLightHelper = new THREE.PointLightHelper(doorLight, 1);
doorLightHelper.visible = false;

scene.add(moonLightHelper, doorLightHelper);

/**
 *
 * light gui settings
 *
 */

const helperFolder = gui.addFolder("helper visibility");
helperFolder
  .add(moonLightHelper, "visible")
  .name("moon light helper visibility");
helperFolder
  .add(doorLightHelper, "visible")
  .name("door light helper visibility");

const moonLightFolder = gui.addFolder("moon light setting");

moonLightFolder.add(moonLight, "intensity").min(0).max(1).step(0.001);
moonLightFolder.add(moonLight.position, "x").min(-5).max(5).step(0.001);
moonLightFolder.add(moonLight.position, "y").min(-5).max(5).step(0.001);
moonLightFolder.add(moonLight.position, "z").min(-5).max(5).step(0.001);

const doorLightFolder = gui.addFolder("door light setting");

doorLightFolder.add(doorLight, "intensity").min(0).max(1).step(0.001);
doorLightFolder.add(doorLight.position, "x").min(-5).max(5).step(0.001);
doorLightFolder.add(doorLight.position, "y").min(-5).max(5).step(0.001);
doorLightFolder.add(doorLight.position, "z").min(-5).max(5).step(0.001);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);

camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;

scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({ canvas });

renderer.render(scene, camera);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setClearColor("#262837");
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.max(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Ghosts
  const ghost1Angle = elapsedTime * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * 4;
  ghost1.position.z = Math.sin(ghost1Angle) * 4;
  ghost1.position.y = Math.sin(elapsedTime * 3);

  const ghost2Angle = -elapsedTime * 0.28;
  ghost2.position.x = Math.cos(ghost2Angle) * 5.5 + (Math.random() - 0.5) * 1.5;
  ghost2.position.z = Math.sin(ghost2Angle) * 5.5 + (Math.random() - 0.5) * 1.5;
  ghost2.position.y = Math.sin(elapsedTime * 2) + Math.sin(elapsedTime * 1.5);

  const ghost3Angle = -elapsedTime * 0.18;
  ghost3.position.x =
    Math.cos(ghost3Angle) * (8 + Math.sin(elapsedTime * 0.32));
  ghost3.position.z = Math.sin(ghost3Angle) * (8 + Math.sin(elapsedTime * 0.5));
  ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.max(window.devicePixelRatio, 2));
});
