import * as THREE from "https://unpkg.com/three@0.160.0/build/three.module.js"
import { GLTFLoader } from "https://unpkg.com/three@0.160.0/examples/jsm/loaders/GLTFLoader.js"

const canvas = document.getElementById("chibi");

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha: true
})

renderer.setSize(200,200)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(35,1,0.1,100)
camera.position.z = 3

const loader = new GLTFLoader()

loader.load("./chibi.glb", (gltf)=>{
  scene.add(gltf.scene)
})

function animate(){
  requestAnimationFrame(animate)
  renderer.render(scene,camera)
}

animate()
