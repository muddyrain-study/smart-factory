import eventHub from "@/utils/eventHub";
import * as THREE from "three";
// 初始化相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  1,
  100000
);
// 设置相机位置
camera.position.set(1000, 1000, 1000);
// 更新摄像头
camera.aspect = window.innerWidth / window.innerHeight;
//   更新摄像机的投影矩阵
camera.updateProjectionMatrix();

class CameraModule {
  constructor() {
    this.activeCamera = camera;
    this.collection = {
      default: camera,
    };
    eventHub.on("toggleCamera", (name) => {
      this.setActive(name);
    });
  }
  add(name, camera) {
    this.collection[name] = camera;
  }
  setActive(name) {
    this.activeCamera = this.collection[name];
  }
}

export default new CameraModule();
