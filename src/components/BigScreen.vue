<template>
  <div id="bigScreen">
    <div class="header">智慧园区管理系统平台</div>
    <div class="main">
      <div class="left">
        <div class="cityEvent">
          <h3>
            <span>热气球控制</span>
          </h3>
          <h1 @click="toggleAction(0)">
            <img src="../assets/bg/bar.svg" class="icon" />
            <span>设置热气球以横穿园区的动画显示</span>
          </h1>
          <h1 @click="toggleAction(1)">
            <img src="../assets/bg/bar.svg" class="icon" />
            <span>设置热气球以环绕园区进行运动</span>
          </h1>
          <div class="footerBoder"></div>
        </div>
        <div class="cityEvent">
          <h3>
            <span>相机控制</span>
          </h3>
          <h1 @click="toggleCamera('default')">
            <img src="../assets/bg/bar.svg" class="icon" />
            <span>默认相机视角</span>
          </h1>
          <h1 @click="toggleCamera('carcamera_Orientation')">
            <img src="../assets/bg/bar.svg" class="icon" />
            <span>设置相机追随汽车导览园区</span>
          </h1>
          <h1 @click="toggleCamera('rightcamera_Orientation')">
            <img src="../assets/bg/bar.svg" class="icon" />
            <span>设置相机查看汽车司机视角</span>
          </h1>
          <div class="footerBoder"></div>
        </div>
      </div>
      <div class="right">
        <div class="cityEvent list">
          <h3>
            <span>切换观览模式</span>
          </h3>
          <ul>
            <li @click="toggleControls('Orbit')">
              <h1>
                <div>
                  <img class="icon" src="../assets/bg/dianli.svg" />
                  <span>轨道观览模式</span>
                </div>
              </h1>
              <p>可以使得相机围绕目标进行轨道运动。</p>
            </li>
            <li @click="toggleControls('Fly')">
              <h1>
                <div>
                  <img class="icon" src="../assets/bg/dianli.svg" />
                  <span>飞行观览模式</span>
                </div>
              </h1>
              <p>
                启用了一种类似于数字内容创建工具（例如Blender）中飞行模式的导航方式
              </p>
            </li>
            <li @click="toggleControls('FirstPerson')">
              <h1>
                <div>
                  <img class="icon" src="../assets/bg/dianli.svg" />
                  <span>第一人称观览模式</span>
                </div>
              </h1>
              <p>第一人称控制器</p>
            </li>
            <li @click="togglePerson()">
              <h1>
                <div>
                  <img class="icon" src="../assets/bg/dianli.svg" />
                  <span>切换小人视角</span>
                </div>
              </h1>
              <p>切换小人视角</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import eventHub from "@/utils/eventHub";
import { ref } from "vue";
const props = defineProps(["dataInfo", "eventList"]);
const imgs = {
  电力: require("@/assets/bg/dianli.svg"),
  火警: require("@/assets/bg/fire.svg"),
  治安: require("@/assets/bg/jingcha.svg"),
};

const toFixInt = (num) => {
  return num.toFixed(0);
};

const currentActive = ref(null);
eventHub.on("spriteClick", (data) => {
  // console.log(data);
  currentActive.value = data.i;
});

const toggleEvent = (i) => {
  currentActive.value = i;
  eventHub.emit("eventToggle", i);
};

const toggleAction = (i) => {
  eventHub.emit("actionClick", i);
};

const toggleCamera = (name) => {
  eventHub.emit("toggleCamera", name);
};

const toggleControls = (name) => {
  eventHub.emit("toggleControls", name);
};
const togglePerson = () => {
  eventHub.emit("togglePerson");
};
</script>

<style scoped>
#bigScreen {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 100;

  left: 0;
  top: 0;
  pointer-events: none;
  display: flex;
  flex-direction: column;
}

.header {
  /* width: 1920px;
          height: 100px; */

  width: 19.2rem;
  height: 1rem;
  background-image: url(@/assets/bg/title.png);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  text-align: center;
  color: rgb(226, 226, 255);
  font-size: 0.4rem;
}

.main {
  flex: 1;
  width: 19.2rem;
  display: flex;
  justify-content: space-between;
}

.left {
  width: 4rem;
  /* background-color: rgb(255,255,255,0.5); */
  background-image: url(@/assets/bg/line_img.png);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: right center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.4rem 0;
}

.right {
  width: 4rem;
  /* background-color: rgb(255,255,255,0.5); */
  background-image: url(@/assets/bg/line_img.png);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: left center;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.4rem 0;
}

.cityEvent {
  position: relative;
  width: 3.5rem;
  /* height: 3rem; */
  margin-bottom: 0.5rem;
  background-image: url(@/assets/bg/bg_img03.png);
  background-repeat: repeat;
}

.cityEvent::before {
  width: 0.4rem;
  height: 0.4rem;
  position: absolute;
  left: 0;
  top: 0;
  border-top: 4px solid rgb(34, 133, 247);
  border-left: 4px solid rgb(34, 133, 247);
  content: "";
  display: block;
}

.cityEvent::after {
  width: 0.4rem;
  height: 0.4rem;
  position: absolute;
  right: 0;
  top: 0;
  border-top: 4px solid rgb(34, 133, 247);
  border-right: 4px solid rgb(34, 133, 247);
  content: "";
  display: block;
}
.footerBorder {
  position: absolute;
  bottom: 0;
  bottom: 0;
  width: 3.5rem;
  height: 0.4rem;
}
.footerBorder::before {
  width: 0.4rem;
  height: 0.4rem;
  position: absolute;
  left: 0;
  top: 0;
  border-bottom: 4px solid rgb(34, 133, 247);
  border-left: 4px solid rgb(34, 133, 247);
  content: "";
  display: block;
}

.footerBorder::after {
  width: 0.4rem;
  height: 0.4rem;
  position: absolute;
  right: 0;
  top: 0;
  border-bottom: 4px solid rgb(34, 133, 247);
  border-right: 4px solid rgb(34, 133, 247);
  content: "";
  display: block;
}

.icon {
  width: 40px;
  height: 40px;
}

h1 {
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 0.3rem 0.3rem;
  justify-content: space-between;
  font-size: 0.2rem;
  pointer-events: auto;
  cursor: pointer;
}
h3 {
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0.3rem 0.3rem;
}

h1 > div {
  display: flex;
  align-items: center;
}
h1 span.time {
  font-size: 0.1rem;
  font-weight: normal;
}

.cityEvent li > p {
  color: #eee;
  padding: 0rem 0.3rem 0.3rem;
}
.list h1 {
  padding: 0.1rem 0.3rem;
}
.cityEvent.list ul {
  pointer-events: auto;
  cursor: pointer;
}

.cityEvent li.active h1 {
  color: red;
}
.cityEvent li.active p {
  color: red;
}

ul,
li {
  list-style: none;
}
</style>
