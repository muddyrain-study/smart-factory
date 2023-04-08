import * as THREE from "three";
import gsap from "gsap";
import vertexShader from "@/shader/flyLine/vertexShader.glsl";
import fragmentShader from "@/shader/flyLine/fragmentShader.glsl";
export default class FlyLineShader {
  constructor(position = { x: 0, z: 0 }, color = 0x00ffff) {
    // 根据点生成曲线
    let linePoints = [
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(position.x / 2, 4, position.z / 2),
      new THREE.Vector3(position.x, 0, position.z),
    ];
    // 创建曲线
    this.lineCurve = new THREE.CatmullRomCurve3(linePoints);
    // 根据曲线去生成 管道几何体
    const points = this.lineCurve.getPoints(1000);
    this.geometry = new THREE.BufferGeometry().setFromPoints(points);

    // 给每个顶点 设置属性
    const aSizeArray = new Float32Array(points.length);
    for (let i = 0; i < aSizeArray.length; i++) {
      aSizeArray[i] = i;
    }
    // 设置几何体顶点属性
    this.geometry.setAttribute(
      "aSize",
      new THREE.BufferAttribute(aSizeArray, 1)
    );
    // 设置着色器材质
    this.shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: {
          value: 0,
        },
        uLength: {
          value: points.length,
        },
        uColor: {
          value: new THREE.Color(color),
        },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    this.mesh = new THREE.Points(this.geometry, this.shaderMaterial);
    // 改变 uTime 来控制动画

    gsap.to(this.shaderMaterial.uniforms.uTime, {
      value: 1000,
      duration: 1,
      repeat: -1,
    });
  }
  remove() {
    this.mesh.remove();
    this.mesh.removeFromParent();
    this.mesh.geometry.dispose();
    this.mesh.material.dispose();
  }
}
