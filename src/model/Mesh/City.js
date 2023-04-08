import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { gsap } from "gsap";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";

export default class City {
  constructor(scene) {
    // 载入模型
    this.scene = scene;
    this.loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./draco/");
    this.loader.setDRACOLoader(dracoLoader);
    this.loader.load("./model/floor2.glb", (gltf) => {
      console.log(gltf);
      this.scene.add(gltf.scene);
      gltf.scene.traverse((child) => {
        // 如果子元素是物体
        if (child.isMesh) {
          // 调整物体发光亮度
          child.material.emissiveIntensity = 5;
        }
        if (child.type === "Object3D" && child.children.length === 0) {
          this.createTag(child);
        }
      });
    });
  }
  createTag(Object3D) {
    const element = document.createElement("div");
    element.className = "elementTag";
    element.innerHTML = `
    <div class="elementContent">
      <h3>${Object3D.name}</h3>
      <p>温度: 26°</p>
      <p>湿度: 50°</p>
    </div>`;
    console.log(element);
    const objectCss3D = new CSS3DObject(element);
    objectCss3D.scale.set(0.2, 0.2, 0.2);
    objectCss3D.position.copy(Object3D.position);
    this.scene.add(objectCss3D);
  }
}
