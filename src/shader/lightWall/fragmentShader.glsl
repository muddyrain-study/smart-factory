varying vec3 vPosition;
uniform float uHeight;
void main() {
    // 混合的 百分比
    float gradMix = (vPosition.y + uHeight / 25.0) / uHeight;
    gl_FragColor = vec4(1.0, 1.0, 0.0, gradMix);
}