export type MeshRole = 0 | 1 | 2;

// Normalized viewport waypoints: each mesh follows its own reversible scroll route.
const routes = [
  [[0.29, 0.13, 0], [0.34, -0.2, -0.4], [0.18, 0.3, 0.2], [-0.31, 0.08, -0.8], [0.28, -0.27, 0], [0.33, 0.2, -0.3], [0.25, 0.08, 0]],
  [[0.34, -0.32, -0.8], [-0.3, 0.28, 0], [0.32, -0.25, -0.3], [0.3, 0.27, -0.7], [-0.32, -0.18, 0.2], [-0.28, 0.25, -0.4], [-0.32, -0.22, 0]],
  [[-0.42, 0.23, 0.4], [0.08, -0.32, 0.1], [-0.36, 0.25, 0.3], [-0.08, -0.3, 0], [0.35, 0.3, 0.5], [0.02, -0.25, 0.1], [0.03, 0.32, 0.4]],
] as const;

export function sampleMeshFlight(role: MeshRole, progress: number) {
  const position = Math.max(0, Math.min(1, progress)) * 6;
  const segment = Math.min(5, Math.floor(position));
  const fraction = position - segment;
  const ease = fraction * fraction * (3 - 2 * fraction);
  const from = routes[role][segment];
  const to = routes[role][segment + 1];
  return {
    x: from[0] + (to[0] - from[0]) * ease,
    y: from[1] + (to[1] - from[1]) * ease,
    z: from[2] + (to[2] - from[2]) * ease,
  };
}

