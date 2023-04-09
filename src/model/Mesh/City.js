import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { gsap } from "gsap";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import eventHub from "@/utils/eventHub";
import * as THREE from "three";
import camera from "../camera";
import fragmentShader from "@/shader/figther/fragmentShader.glsl";
import vertexShader from "@/shader/figther/vertexShader.glsl";
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
      this.fighterGroup.visible = false;
      scene.add(gltf.scene);
      this.fighterGroup.position.set(5, 40, 70);
      this.fighterGroup.traverse((child) => {
        if (child.isMesh) {
          child.material.emissiveIntensity = 5;
        }
      });
      // 创建射线
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();
      // 点击事件的监听
      window.addEventListener("click", (e) => {
        this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
        this.raycaster.setFromCamera(this.mouse, camera.activeCamera);
        e.mesh = e;
        e.alarm = this;
        const intersects = this.raycaster.intersectObject(this.fighterGroup);
        if (intersects.length > 0) {
          if (this.floor2Group.visible) {
            this.floor2Group.visible = false;
            this.floor2Tags.forEach((item) => {
              item.visible = false;
            });
          } else {
            this.floor2Group.visible = true;
            this.floor2Tags.forEach((item) => {
              item.visible = true;
            });
          }
        }
      });

      this.showFighter();
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
    this.fighterGroup.visible = true;
    this.floor2Tags.forEach((item) => {
      item.visible = true;
    });
  }
  hideFloor2() {
    this.floor2Group.visible = false;
    this.fighterGroup.visible = false;
    this.floor2Tags.forEach((item) => {
      item.visible = false;
    });
  }
  showFighter() {
    this.floor1Group && (this.floor1Group.visible = false);
    this.floor2Group && (this.floor2Group.visible = false);
    this.wallGroup && (this.wallGroup.visible = false);
    this.fighterGroup && (this.fighterGroup.visible = true);
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

    eventHub.on("flatFighter", () => {
      // 将飞机展成立方体
      const positions = [];
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          positions.push(new THREE.Vector3(i * 2 - 2, j * 2 - 2, j * 2 - 2));
        }
      }
      let n = 0;
      this.fighterGroup.traverse((child) => {
        if (child.isMesh) {
          const position = positions[n].multiplyScalar(20);
          child.position2 = child.position.clone();
          gsap.to(child.position, {
            x: position.x,
            y: position.y,
            z: position.z,
            duration: 1,
          });
          n++;
        }
      });
    });
    eventHub.on("recoverFighter", () => {
      this.fighterGroup.traverse((child) => {
        if (child.isMesh) {
          const position = child.position2;
          gsap.to(child.position, {
            x: position.x,
            y: position.y,
            z: position.z,
            duration: 1,
          });
        }
      });
    });

    eventHub.on("pointsFighter", () => {
      this.createPoints();
    });
    eventHub.on("pointsBlast", () => {
      this.pointsBlast();
    });
    eventHub.on("recoverBack", () => {});
  }

  createPoints() {
    if (!this.fighterPointsGroup) {
      this.fighterPointsGroup = this.transformPoints(this.fighterGroup);
      this.scene.add(this.fighterPointsGroup);
    }
  }

  transformPoints(object3D) {
    // 创建纹理图形
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("./assets/particles/1.png");
    const group = new THREE.Group();
    function createPoints(object3d, newObject3d) {
      if (object3d.children.length > 0) {
        object3d.children.forEach((child) => {
          if (child.isMesh) {
            // 随机生成颜色
            const color = new THREE.Color(
              Math.random(),
              Math.random(),
              Math.random()
            );
            // const material = new THREE.PointsMaterial({
            //   size: 0.1,
            //   color: color,
            //   map: texture,
            //   transparent: true,
            //   blending: THREE.AdditiveBlending,
            //   depthTest: false,
            // });
            const material = new THREE.ShaderMaterial({
              uniforms: {
                uColor: { value: color },
                uTexture: { value: texture },
                uTime: {
                  value: 0,
                },
              },
              vertexShader,
              fragmentShader,
              blending: THREE.AdditiveBlending,
              transparent: true,
              depthTest: false,
            });
            const points = new THREE.Points(child.geometry, material);
            points.position.copy(child.position);
            points.rotation.copy(child.rotation);
            points.scale.copy(child.scale);
            newObject3d.add(points);
            createPoints(child, points);
          }
        });
      }
    }
    createPoints(object3D, group);
    // object3D.traverse((child) => {
    //   if (child.isMesh) {
    //     const points = child.geometry.attributes.position.array;
    //     const geometry = new THREE.BufferGeometry();
    //     geometry.setAttribute("position", new THREE.BufferAttribute(points, 3));
    //     // 随机生成颜色
    //     const color = new THREE.Color(
    //       Math.random(),
    //       Math.random(),
    //       Math.random()
    //     );
    //     const material = new THREE.PointsMaterial({
    //       size: 0.1,
    //       color: color,
    //     });
    //     const pointsMesh = new THREE.Points(geometry, material);
    //     pointsMesh.position.copy(child.position);
    //     pointsMesh.rotation.copy(child.rotation);
    //     pointsMesh.scale.copy(child.scale);

    //     group.add(pointsMesh);
    //   }
    // });
    return group;
  }
  pointsBlast() {
    this.fighterPointsGroup.traverse((child) => {
      if (child.isPoints) {
        let randomPositionArray = new Float32Array(
          child.geometry.attributes.position.count * 3
        );
        for (let i = 0; i < child.geometry.attributes.position.count; i++) {
          randomPositionArray[i * 3 + 0] = (Math.random() * 2 - 1) * 10;
          randomPositionArray[i * 3 + 1] = (Math.random() * 2 - 1) * 10;
          randomPositionArray[i * 3 + 2] = (Math.random() * 2 - 1) * 10;
        }

        child.geometry.setAttribute(
          "aPostion",
          new THREE.BufferAttribute(randomPositionArray, 3)
        );
        gsap.to(child.material.uniforms.uTime, {
          value: 10,
          duration: 5,
        });
      }
    });
  }
}
