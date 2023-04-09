uniform vec3 uColor;
uniform sampler2D uTexture;

void main() {
    vec4 uTextureColor = texture2D(uTexture, gl_PointCoord);
    gl_FragColor = vec4(uColor, uTextureColor.x);
}