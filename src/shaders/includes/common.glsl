// Common GLSL utilities for ELEMENT UX shaders

// Precision settings
#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif

// Constants
#define PI 3.14159265359
#define TWO_PI 6.28318530718
#define HALF_PI 1.57079632679

// Math utilities
float inverseLerp(float a, float b, float t) {
    return (t - a) / (b - a);
}

float remap(float a, float b, float c, float d, float t) {
    return mix(c, d, inverseLerp(a, b, t));
}

// Noise functions
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

float perlinNoise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));

    vec2 u = f * f * (3.0 - 2.0 * f);

    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) +
           (d - b) * u.x * u.y;
}

// Smoothstep variant
float smoothstepCurve(float a, float b, float t) {
    return smoothstep(a, b, t);
}

// Fresnel effect
float fresnel(vec3 normal, vec3 viewDir, float power) {
    return pow(1.0 - max(0.0, dot(normal, viewDir)), power);
}

// Lighting utilities
vec3 calculateLighting(
    vec3 normal,
    vec3 viewDir,
    vec3 lightDir,
    vec3 surfaceColor,
    float metalness,
    float roughness
) {
    float diff = max(0.0, dot(normal, lightDir));
    vec3 diffuse = surfaceColor * diff;

    vec3 halfDir = normalize(lightDir + viewDir);
    float spec = pow(max(0.0, dot(normal, halfDir)), 32.0 * (1.0 - roughness));
    vec3 specular = vec3(1.0) * spec * metalness;

    return diffuse + specular;
}

// Fog
vec3 applyFog(vec3 color, vec3 fogColor, float fogDistance, float depth) {
    float fogFactor = 1.0 - exp(-depth * depth * fogDistance * fogDistance);
    return mix(color, fogColor, fogFactor);
}
