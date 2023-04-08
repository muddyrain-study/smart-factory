import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import * as THREE from "three";
import eventHub from "@/utils/eventHub";
import { gsap } from "gsap";
import cameraModule from "@/model/camera";
import controlsModule from "../controls";

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
          console.log(child);
        }
      });
    });
  }
}
