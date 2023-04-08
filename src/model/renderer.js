import * as THREE from "three";

// 创建渲染函数
const renderer = new THREE.WebGLRenderer({
  // 抗锯齿
  antialias: true,
  // 是否使用对数深度缓存
  logarithmicDepthBuffer: true,
  // 是否使用物理上正确的光照模式
  physicallyCorrectLights: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
// 开启 阴影贴图的引用
renderer.shadowMap.enabled = true;
// 渲染器 色调映射
renderer.toneMapping = THREE.ACESFilmicToneMapping;
// 设置渲染的曝光程度
renderer.toneMappingExposure = 0.75;
renderer;
export default renderer;
