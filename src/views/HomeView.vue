<template>
  <div class="home">
    <Scene />
  </div>
</template>

<script setup>
import Scene from "@/components/scene.vue";
import BigScreen from "@/components/BigScreen.vue";
import { onMounted, reactive, ref } from "vue";
import gsap from "gsap";
</script>
