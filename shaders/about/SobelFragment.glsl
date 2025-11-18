precision highp float;

uniform sampler2D uTexture;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uThreshold;
uniform float uRadius;

varying vec2 vUv;

float circle(vec2 uv, vec2 pos, vec2 res, float r) {
    uv -= pos;
    uv.y *= res.y / res.x;
    return 1.0 - smoothstep(r - (r * 0.01), r + (r * 0.01), dot(uv, uv) * 4.0);
}

float getLuminance(vec3 color) {
    return dot(color, vec3(0.2126, 0.7152, 0.0722));
}

void main() {
    vec2 st = vUv;
    vec2 texelSize = 1.0 / uResolution;

    float L_ul = getLuminance(texture2D(uTexture, st + vec2(-texelSize.x, texelSize.y)).rgb);
    float L_up = getLuminance(texture2D(uTexture, st + vec2(0.0, texelSize.y)).rgb);
    float L_ur = getLuminance(texture2D(uTexture, st + vec2(texelSize.x, texelSize.y)).rgb);

    float L_left = getLuminance(texture2D(uTexture, st + vec2(-texelSize.x, 0.0)).rgb);
    float L_right = getLuminance(texture2D(uTexture, st + vec2(texelSize.x, 0.0)).rgb);

    float L_dl = getLuminance(texture2D(uTexture, st + vec2(-texelSize.x, -texelSize.y)).rgb);
    float L_down = getLuminance(texture2D(uTexture, st + vec2(0.0, -texelSize.y)).rgb);
    float L_dr = getLuminance(texture2D(uTexture, st + vec2(texelSize.x, -texelSize.y)).rgb);

    float Gx = (L_ul + 2.0 * L_left + L_dl) - (L_ur + 2.0 * L_right + L_dr);
    float Gy = (L_ul + 2.0 * L_up + L_ur) - (L_dl + 2.0 * L_down + L_dr);

    float edgeStrength = abs(Gx) + abs(Gy);
    float line = smoothstep(uThreshold - 0.05, uThreshold + 0.05, edgeStrength);
    vec3 lineColor = vec3(1.0 - line);

    vec3 textureColor = texture2D(uTexture, st).rgb;

    float ring = circle(st, uMouse, uResolution, uRadius);
    vec3 finalColor = mix(textureColor, lineColor, ring);

    gl_FragColor = vec4(finalColor, 1.0);
}