import * as THREE from "three";
import gsap from "gsap";

export default class FlyLine {
  constructor() {
    let linePoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(5, 4, 0),
      new THREE.Vector3(10, 0, 0),
    ];
    // 创建曲线
    this.lineCurve = new THREE.CatmullRomCurve3(linePoints);
    // 根据曲线去生成 管道几何体
    this.geometry = new THREE.TubeGeometry(
      this.lineCurve,
      1000,
      0.25,
      2,
      false
    );
    // 设置飞线材质
    // 创建纹理
    const textureLoader = new THREE.TextureLoader();
    this.texture = textureLoader.load("./textures/z_11.png");
    // y轴重复
    this.texture.repeat.set(1, 2);
    // 水平重复
    this.texture.wrapS = THREE.RepeatWrapping;
    // 垂直重复
    this.texture.wrapT = THREE.MirroredRepeatWrapping;

    this.material = new THREE.MeshBasicMaterial({
      map: this.texture,
      transparent: true,
    });
    // 创建飞线物体
    this.mesh = new THREE.Mesh(this.geometry, this.material);

    // 创建飞线的动画
    gsap.to(this.texture.offset, {
      x: -1,
      duration: 1,
      repeat: -1,
      ease: "none",
    });
  }
}
