// Luxury Material Vertex Shader
// Premium surface rendering with procedural detail

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vViewDir;

uniform float uTime;
uniform float uWaveAmplitude;

void main() {
    vUv = uv;
    vPosition = position;

    // Calculate view direction
    vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    vViewDir = normalize(cameraPosition - worldPos);

    // Calculate normal
    vNormal = normalize(normalMatrix * normal);

    // Subtle wave deformation for luxury effect
    vec3 pos = position;
    pos.y += sin(position.x * 2.0 + uTime) * uWaveAmplitude;
    pos.z += cos(position.z * 2.0 + uTime) * uWaveAmplitude;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
