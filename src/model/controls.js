import cameraModule from "./camera";
import renderModule from "./renderer";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FlyControls } from "three/addons/controls/FlyControls.js";
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";
import eventHub from "@/utils/eventHub";

// minAzimuthAngle  maxAzimuthAngle 水平

class ControlsModule {
  constructor() {
    this.setOrbitControls();
    eventHub.on("toggleControls", (name) => {
      this[`set${name}Controls`]();
    });
  }
  setOrbitControls() {
    // 创建轨道控制器
    this.controls = new OrbitControls(
      cameraModule.activeCamera,
      renderModule.renderer.domElement
    );
    // 设置控制器的阻尼，让控制器更真实
    this.controls.enableDamping = true;

    // 垂直旋转的角度的上限
    this.controls.maxPolarAngle = Math.PI / 2;
    // 垂直旋转的角度的下限
    this.controls.minPolarAngle = 0;
  }
  setFlyControls() {
    // 创建飞行控制器
    this.controls = new FlyControls(
      cameraModule.activeCamera,
      renderModule.renderer.domElement
    );
    this.controls.movementSpeed = 100;
    this.controls.rollSpeed = Math.PI / 60;
  }
  setFirstPersonControls() {
    // 第一人称控制器
    this.controls = new FirstPersonControls(
      cameraModule.activeCamera,
      renderer.domElement
    );
    this.controls.movementSpeed = 100;
    this.controls.rollSpeed = Math.PI / 60;
    this.controls.lookSpeed = Math.PI / 125;
  }
}

export default new ControlsModule();
