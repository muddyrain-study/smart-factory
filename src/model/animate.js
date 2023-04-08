import controlsModule from "@/model/controls";
import renderModule from "./renderer";
import * as THREE from "three";
import scene from "./scene";
import cameraModule from "./camera";
import { updateMesh } from "@/model/createMesh";

// 设置时钟
const clock = new THREE.Clock();
function animate() {
  let time = clock.getDelta();
  controlsModule.controls.update(time);
  updateMesh(time);
  renderModule.renderer.render(scene, cameraModule.activeCamera);
  renderModule.css3DRender.render(scene, cameraModule.activeCamera);
  window.requestAnimationFrame(animate);
}

export default animate;
