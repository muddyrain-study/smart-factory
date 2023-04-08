import { SHAHDER_END, SHAHDER_COMMON } from "@/constant";
import gsap from "gsap";
import * as THREE from "three";
export default function modifycityMaterial(mesh) {
  mesh.material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      "#include <dithering_fragment>",
      `
        #include <dithering_fragment>
        ${SHAHDER_END}
        `
    );
    addGradColor(shader, mesh);
    addSpread(shader);
    addLightLine(shader);
    addToTopLine(shader);
  };
}

/**
 * 模型颜色渐变
 * @param {*} shader 着色器
 * @param {*} mesh 物体
 */
export function addGradColor(shader, mesh) {
  // 先计算建筑模型
  mesh.geometry.computeBoundingBox();
  // 再获取模型属性
  const { max, min } = mesh.geometry.boundingBox;
  // 获取物体的高度差
  let uHeight = max.y - min.y;

  shader.uniforms.uTopColor = {
    value: new THREE.Color("#aaaeff"),
  };
  shader.uniforms.uHeight = {
    value: uHeight,
  };

  shader.vertexShader = shader.vertexShader.replace(
    "#include <common>",
    `
    #include <common>
    varying vec3 vPosition;
  `
  );

  shader.vertexShader = shader.vertexShader.replace(
    "#include <begin_vertex>",
    `
    #include <begin_vertex>
    vPosition = position;
    `
  );
  shader.fragmentShader = shader.fragmentShader.replace(
    "#include <common>",
    `
      #include <common>
      varying vec3 vPosition;
      uniform vec3 uTopColor;
      uniform float uHeight;
    `
  );
  shader.fragmentShader = shader.fragmentShader.replace(
    SHAHDER_END,
    `
    vec4 distGradColor = gl_FragColor;

    // 混合的 百分比
    float gradMix = (vPosition.y + uHeight / 2.0) / uHeight;
    // 计算混合颜色
    vec3 gradMixColor = mix(distGradColor.xyz,uTopColor,gradMix);
    gl_FragColor = vec4(gradMixColor, 1);

    ${SHAHDER_END}
    `
  );
}
/**
 * 添加扩散
 * @param {*} shader
 */
export function addSpread(shader) {
  // 设置扩散的中心点
  shader.uniforms.uSpreadCounter = {
    value: new THREE.Vector2(0, 0),
  };
  // 设置扩散的时间
  shader.uniforms.uSpreadTime = { value: 0 };
  // 设置条带的宽度
  shader.uniforms.uSpreadWidth = { value: 40 };

  shader.fragmentShader = shader.fragmentShader.replace(
    SHAHDER_COMMON,
    `
    ${SHAHDER_COMMON}
    uniform vec2  uSpreadCounter;
    uniform float uSpreadTime;
    uniform float uSpreadWidth;
    `
  );
  shader.fragmentShader = shader.fragmentShader.replace(
    SHAHDER_END,
    `
    float spreadRadius = distance(vPosition.xz, uSpreadCounter);
    // 设置扩散范围的函数
    float spreadIndex = -(spreadRadius - uSpreadTime) * (spreadRadius - uSpreadTime) + uSpreadWidth;

    if(spreadIndex > 0.0){
        gl_FragColor = mix(gl_FragColor,vec4(1.0,1.0,1.0,1.0),spreadIndex / uSpreadWidth);
    }
    ${SHAHDER_END}
    `
  );

  gsap.to(shader.uniforms.uSpreadTime, {
    value: 800,
    duration: 3,
    ease: "none",
    repeat: -1,
  });
}

/**
 * 添加光带
 * @param {*} shader
 */
export function addLightLine(shader) {
  // 设置扩散的时间
  shader.uniforms.uLightLineTime = { value: -1000 };
  // 设置条带的宽度
  shader.uniforms.uLightLineWidth = { value: 400 };

  shader.fragmentShader = shader.fragmentShader.replace(
    SHAHDER_COMMON,
    `
    ${SHAHDER_COMMON}
    uniform float uLightLineTime;
    uniform float uLightLineWidth;
    `
  );
  shader.fragmentShader = shader.fragmentShader.replace(
    SHAHDER_END,
    `
    // 设置扩散范围的函数
    float LightLineMix = -(vPosition.x + vPosition.z - uLightLineTime) * (vPosition.x + vPosition.z - uLightLineTime) + uLightLineWidth;

    if(LightLineMix > 0.0){
        // gl_FragColor = mix(gl_FragColor,vec4(1.0,1.0,1.0,1.0),LightLineMix / uLightLineWidth);
        gl_FragColor = mix(gl_FragColor,vec4(1.0,0.8,0.8,1.0),LightLineMix / uLightLineWidth);
    } 
    ${SHAHDER_END}
    `
  );

  gsap.to(shader.uniforms.uLightLineTime, {
    value: 1500,
    duration: 4,
    ease: "none",
    repeat: -1,
  });
}

/**
 * 添加光带 向上
 * @param {*} shader
 */
export function addToTopLine(shader) {
  // 设置扩散的时间
  shader.uniforms.uToTopTime = { value: 0 };
  // 设置条带的宽度
  shader.uniforms.uToTopWidth = { value: 400 };

  shader.fragmentShader = shader.fragmentShader.replace(
    SHAHDER_COMMON,
    `
    ${SHAHDER_COMMON}
    uniform float uToTopTime;
    uniform float uToTopWidth;
    `
  );
  shader.fragmentShader = shader.fragmentShader.replace(
    SHAHDER_END,
    `
    // 设置扩散范围的函数
    float ToTopMix = -(vPosition.y - uToTopTime) * (vPosition.y - uToTopTime) + uToTopWidth;

    if(ToTopMix > 0.0){
        // gl_FragColor = mix(gl_FragColor,vec4(1.0,1.0,1.0,1.0),ToTopMix / uToTopWidth);
        gl_FragColor = mix(gl_FragColor,vec4(0.8,0.8,1.0,1.0),ToTopMix / uToTopWidth);
    } 
    ${SHAHDER_END}
    `
  );

  gsap.to(shader.uniforms.uToTopTime, {
    value: 500,
    duration: 3,
    ease: "none",
    repeat: -1,
  });
}
