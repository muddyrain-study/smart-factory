uniform vec3 aPosition;
uniform float uTime;
void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec3 direction = aPosition - modelPosition.xyz;

    vec3 targetPostion = modelPosition.xyz + direction * 0.1 * uTime;
    vec4 viewPosition = viewMatrix * vec4(targetPostion, 1.0);
    gl_Position = projectionMatrix * viewPosition;
    gl_PointSize = -50.0 / viewPosition.z;
}