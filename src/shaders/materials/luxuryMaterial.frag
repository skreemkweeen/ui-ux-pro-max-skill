// Luxury Material Fragment Shader
// Premium cinematic surface with metallic finish

#include <common>

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 vViewDir;

uniform vec3 uBaseColor;
uniform float uMetalness;
uniform float uRoughness;
uniform float uEmissiveIntensity;
uniform vec3 uLightDir;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(uLightDir);

    // Surface detail using noise
    float detail = perlinNoise(vUv * 5.0);
    normal = mix(normal, normalize(normal + vec3(detail * 0.1)), 0.5);

    // Fresnel effect for luxury feel
    float fresnelEffect = fresnel(normal, vViewDir, 5.0);

    // Metallic reflection
    vec3 reflected = reflect(-vViewDir, normal);
    float metalReflection = fresnelEffect * uMetalness;

    // Base lighting
    vec3 lighting = calculateLighting(
        normal,
        vViewDir,
        lightDir,
        uBaseColor,
        uMetalness,
        uRoughness
    );

    // Emissive glow
    vec3 emissive = uBaseColor * uEmissiveIntensity * (0.5 + 0.5 * sin(vPosition.y * 2.0));

    // Combine effects
    vec3 finalColor = lighting + emissive + metalReflection * 0.3;

    // Add atmospheric fog
    float depth = length(vPosition);
    finalColor = applyFog(finalColor, vec3(0.05), 0.01, depth);

    // Output with transparency
    gl_FragColor = vec4(finalColor, 1.0);
}
