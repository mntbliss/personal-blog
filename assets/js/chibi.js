import * as THREE from "https://esm.sh/three@0.160.0"
import { GLTFLoader } from "https://esm.sh/three@0.160.0/examples/jsm/loaders/GLTFLoader.js"
import { OrbitControls } from "https://esm.sh/three@0.160.0/examples/jsm/controls/OrbitControls.js"

const canvas = document.getElementById("chibi")

const renderer = new THREE.WebGLRenderer({
  canvas,
  alpha:true,
  antialias:true
})

renderer.setSize(200,200)
renderer.setClearColor(0x000000,0)

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(35,1,0.1,100)
camera.position.set(0,2,8)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableZoom = false
controls.enablePan = false
controls.target.set(0,1,0)
controls.update()

let isDragging = false
let model = null

controls.addEventListener("start", ()=>{ isDragging = true })
controls.addEventListener("end", ()=>{ isDragging = false })

const light = new THREE.DirectionalLight(0xffffff,1)
light.position.set(1,1,2)
scene.add(light)

const loader = new GLTFLoader()
let modelGroup = new THREE.Group()
scene.add(modelGroup)

loader.load("./assets/models/chibi.glb",(gltf)=>{

  const model = gltf.scene
  model.position.y = -1

  modelGroup.add(model)

})

const ambient = new THREE.AmbientLight(0xffffff,0.6)
scene.add(ambient)
// loader.load("./assets/models/chibi.glb",(gltf)=>{

//   model = gltf.scene
//   model.position.y = -1

//   scene.add(model)

// })

function animate(){

  requestAnimationFrame(animate)

  if(modelGroup && !isDragging){
    modelGroup.rotation.y += 0.005
  }

  if(model && !isDragging){
    model.rotation.y += 0.005
  }

  controls.update()
  renderer.render(scene,camera)

}

animate()