import cameraModule from "./camera";
import renderModule from "./renderer";

// 监听画面变化，更新渲染画面
window.addEventListener("resize", () => {
  // 更新相机的 比例
  cameraModule.activeCamera.aspect = window.innerWidth / window.innerHeight;
  // 更新摄像机投影矩阵
  cameraModule.activeCamera.updateProjectionMatrix();
  // 更新渲染器
  renderModule.renderer.setSize(window.innerWidth, window.innerHeight);
  // 设置渲染器的像素比
  renderModule.renderer.setPixelRatio(window.devicePixelRatio);
  // 更新css渲染器
  renderModule.css3DRender.setSize(window.innerWidth, window.innerHeight);
  // 设置css渲染器的像素比
  renderModule.css3DRender.setPixelRatio(window.devicePixelRatio);
});
