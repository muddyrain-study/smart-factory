import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { gsap } from "gsap";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import eventHub from "@/utils/eventHub";

export default class City {
  constructor(scene) {
    // 载入模型
    this.scene = scene;
    this.loader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    dracoLoader.setDecoderPath("./draco/");
    this.loader.setDRACOLoader(dracoLoader);
    this.floor1Group;
    this.floor2Group;
    this.fighterGroup;
    this.wallGroup;
    this.floor2Tags = [];
    this.loader.load("./model/floor2.glb", (gltf) => {
      this.floor2Group = gltf.scene;
      let array = ["小型会议室", "核心科技室", "科技展台", "设计总监办公室"];
      // 判断子元素是否是物体
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.material.emissiveIntensity = 15;
        }
        if (array.indexOf(child.name) != -1) {
          const cssObject3D = this.createTag(child);
          cssObject3D.visible = false;
          this.floor2Tags.push(cssObject3D);
          this.floor2Group.add(cssObject3D);
        }
      });
      this.floor2Group.visible = false;
      scene.add(gltf.scene);
    });
    this.loader.load("./model/floor1.glb", (gltf) => {
      this.floor1Group = gltf.scene;
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.material.emissiveIntensity = 5;
        }
      });
      this.floor1Group.visible = false;
      scene.add(gltf.scene);
    });

    this.loader.load("./model/wall.glb", (gltf) => {
      this.wallGroup = gltf.scene;
      scene.add(gltf.scene);
    });

    this.loader.load("./model/Fighter.glb", (gltf) => {
      this.fighterGroup = gltf.scene;
      scene.add(gltf.scene);
    });
    this.initEvent();
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
    const objectCss3D = new CSS3DObject(element);
    objectCss3D.scale.set(0.2, 0.2, 0.2);
    objectCss3D.position.copy(Object3D.position);
    return objectCss3D;
  }

  showFloor1() {
    this.floor1Group.visible = true;
  }
  hideFloor1() {
    this.floor1Group.visible = false;
  }
  showFloor2() {
    this.floor2Group.visible = true;
    this.floor2Tags.forEach((item) => {
      item.visible = true;
    });
  }
  hideFloor2() {
    this.floor2Group.visible = false;
    this.floor2Tags.forEach((item) => {
      item.visible = false;
    });
  }

  showWall() {
    this.wallGroup.visible = true;
  }
  hideWall() {
    this.wallGroup.visible = false;
  }
  initEvent() {
    eventHub.on("showFloor1", () => {
      this.showFloor1();
      this.hideWall();
      this.hideFloor2();
      gsap.to(this.floor1Group.position, {
        y: 0,
        duration: 1,
      });
    });
    eventHub.on("showFloor2", () => {
      this.showFloor2();
      this.hideWall();
      this.hideFloor1();
      gsap.to(this.floor2Group.position, {
        y: 0,
        duration: 1,
      });
    });
    eventHub.on("showWall", () => {
      this.showWall();
      gsap.to(this.wallGroup.position, {
        y: 0,
        duration: 1,
        // onComplete: () => {
        //   this.hideFloor1();
        //   this.hideFloor2();
        // },
      });
      gsap.to(this.floor1Group.position, {
        y: 0,
        duration: 1,
      });
      gsap.to(this.floor2Group.position, {
        y: 0,
        duration: 1,
      });
    });
    eventHub.on("showAll", () => {
      this.showFloor2();
      this.showWall();
      this.showFloor1();
      gsap.to(this.wallGroup.position, {
        y: 100,
        duration: 1,
      });
      gsap.to(this.floor1Group.position, {
        y: -100,
        duration: 1,
      });
    });
  }
}
