import * as THREE from './three.module.js';
import {OrbitControls} from './OrbitControls.js';
import {GLTFLoader} from './GLTFLoader.js';

let mixer;
let model;
let prevTime = Date.now();
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(60, innerWidth / innerHeight, 1, 1000);
camera.position.set(300, 80, 0);
camera.lookAt(scene.position);
let renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setClearColor(0x151515);
renderer.setSize(innerWidth, innerHeight);
document.body.appendChild(renderer.domElement);

let controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 80, 0);
controls.enablePan = false;
controls.update();

var light = new THREE.DirectionalLight(0xffffff, 1);
light.position.setScalar(10);
scene.add(light);
scene.add(new THREE.DirectionalLight(0xffffff, 1));

let uniforms = {
  isXRay: {value: false},
  rayAng: {value: 0.975},
  rayOri: {value: new THREE.Vector3()},
  rayDir: {value: new THREE.Vector3()}
}

var loader = new GLTFLoader();
loader.load( "Horse.glb", function ( gltf ) {

  let container = new THREE.Group();

  let mesh = gltf.scene.children[ 0 ];
 // mesh.material.color.set(0x997755);
	mesh.material.color.set(0xFFCCAA);

  gltf.scene.traverse(function (child) {
    if (child.isMesh) {

      child.material.transparent = true;
      child.material.side = THREE.DoubleSide;
      child.material.onBeforeCompile = shader => {
        shader.uniforms.isXRay = uniforms.isXRay;
        shader.uniforms.rayAng = uniforms.rayAng;
        shader.uniforms.rayOri = uniforms.rayOri;
        shader.uniforms.rayDir = uniforms.rayDir;
        shader.vertexShader = `
          uniform vec3 rayOri;
          varying vec3 vPos;
          varying float vXRay;
          ${shader.vertexShader}
        `.replace(
          `#include <displacementmap_vertex>`,
          `#include <displacementmap_vertex>
            vPos = transformed;
            
            vec3 vNormal = normalize( normalMatrix * normal );
            vec3 vNormel = normalize( normalMatrix * normalize(rayOri - vPos) );
            vXRay = pow(1. - dot(vNormal, vNormel), 3. );
          `
        );
        console.log(shader.vertexShader);
        shader.fragmentShader = `
          uniform float isXRay;
          uniform float rayAng;
          uniform vec3 rayOri;
          uniform vec3 rayDir;
          
         varying vec3 vPos;
         varying float vXRay;
          ${shader.fragmentShader}
        `.replace(
          `#include <dithering_fragment>`,
          `#include <dithering_fragment>
          
          if(abs(isXRay) > 0.5){
          
            vec3 xrVec = vPos - rayOri;
            vec3 xrDir = normalize( xrVec );
            float angleCos = dot( xrDir, rayDir );

            vec4 col = vec4(0, 1, 1, 0.5);
            gl_FragColor = mix(gl_FragColor, col, smoothstep(rayAng - 0.02, rayAng, angleCos));

          }
          
          `
        );
        console.log(shader.fragmentShader);
      }
    }
  });
  model = gltf.scene;
  scene.add(model);
  
  scene.add(mesh);
  
  mixer = new THREE.AnimationMixer( mesh );

  mixer.clipAction( gltf.animations[ 0 ] ).setDuration( 1 ).play();

} );


let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();

renderer.domElement.addEventListener("pointerdown", event => {
  //console.log(event);
  //setXRay(event);
  if (event.button == 2){
    uniforms.isXRay.value = true;
  }
});
renderer.domElement.addEventListener("pointerup", event => {
  if (event.button == 2){
    uniforms.isXRay.value = false;
  }
})
renderer.domElement.addEventListener("pointermove", event => {

    setXRay(event);

})

renderer.setAnimationLoop(()=>{
  
  if ( mixer ) {
    const time = Date.now();
    mixer.update( ( time - prevTime ) * 0.001 );
    prevTime = time;
  }

  renderer.render(scene, camera);
});

function setXRay(event){
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
  raycaster.setFromCamera(mouse, camera);
  if (model && uniforms.isXRay.value){
        uniforms.rayOri.value.copy(raycaster.ray.origin)
        uniforms.rayDir.value.copy(raycaster.ray.direction);
  }
}