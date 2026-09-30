export const meshVertexShader = /* glsl */ `
  attribute vec3 aBarycentric;
  attribute float aSeed;
  attribute float aActivity;
  varying vec3 vBarycentric;
  varying vec3 vPosition;
  varying float vSeed;
  varying float vActivity;
  void main() {
    vBarycentric = aBarycentric;
    vSeed = abs(aSeed);
    vActivity = aActivity;
    vec4 viewPosition = modelViewMatrix * vec4(position, 1.0);
    vPosition = viewPosition.xyz;
    gl_Position = projectionMatrix * viewPosition;
  }
`;
export const meshFragmentShader = /* glsl */ `
  uniform float uTime;
  uniform float uStage;
  uniform float uOpacity;
  uniform float uFormation;
  uniform float uHue;
  varying vec3 vBarycentric;
  varying vec3 vPosition;
  varying float vSeed;
  varying float vActivity;
  void main() {
    vec3 normal = normalize(cross(dFdx(vPosition), dFdy(vPosition)));
    if (!gl_FrontFacing) normal = -normal;
    vec3 viewDirection = normalize(-vPosition);
    float fresnel = pow(1.0 - abs(dot(normal, viewDirection)), 2.4);
    float light = max(0.0, dot(normal, normalize(vec3(-0.4, 0.9, 0.8))));
    float reflection = pow(max(0.0, dot(reflect(-normalize(vec3(-0.4, 0.9, 0.8)), normal), viewDirection)), 22.0);
    vec3 cyan = vec3(0.20, 0.80, 0.91);
    vec3 violet = vec3(0.57, 0.37, 0.96);
    vec3 accent = mix(cyan, violet, clamp(smoothstep(-1.5, 1.8, vPosition.y + normal.x + sin(uStage * 1.4)) + uHue, 0.0, 1.0));
    accent = mix(accent, vec3(0.65, 1.0, 1.0), vActivity);
    vec3 widths = fwidth(vBarycentric);
    vec3 lines = smoothstep(vec3(0.0), widths * 1.15, vBarycentric);
    float edge = 1.0 - min(min(lines.x, lines.y), lines.z);
    float scan = pow(0.5 + 0.5 * sin(vPosition.y * 2.0 - uTime * 0.5), 14.0);
    vec3 surface = vec3(0.008, 0.015, 0.035) + accent * (light * 0.085 + fresnel * 0.09 + vSeed * 0.02);
    surface += vec3(0.55, 0.74, 0.9) * reflection * 0.45;
    vec3 color = mix(surface, accent * (0.7 + fresnel * 0.65 + scan * 0.5 + vActivity * 1.8), edge);
    float alpha = mix(0.3, 0.65, uFormation) + edge * 0.35;
    gl_FragColor = vec4(color, uOpacity * alpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }
`;
