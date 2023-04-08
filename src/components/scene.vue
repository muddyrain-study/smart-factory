<script setup>
import { onMounted, ref, watch } from "vue";
import * as THREE from "three";
import gsap from "gsap";

import scene from "@/model/scene";
import "@/model/init";
import cameraModule from "@/model/camera";
import renderer from "@/model/renderer";
import animate from "@/model/animate";
import createMesh, { updateMesh } from "@/model/createMesh";

// 场景元素
const sceneDiv = ref(null);

// 场景添加相机
scene.add(cameraModule.activeCamera);

createMesh();

onMounted(() => {
  sceneDiv.value.appendChild(renderer.domElement);
  animate();
});
</script>
<template>
  <div class="scene" ref="sceneDiv"></div>
</template>

<style lang="less">
.scene {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 100;
  left: 0;
  top: 0;
}
</style>
