import * as THREE from 'three';

export const MESH_DETAIL = 4;

/** All six sculptures share vertex order so every triangle travels continuously. */
export function createSculptureGeometry(detail = MESH_DETAIL) {
  const source = new THREE.IcosahedronGeometry(1, detail);
  const vertices = source.getAttribute('position');
  const coarse = new THREE.IcosahedronGeometry(1, 0);
  const coarseVertices = coarse.getAttribute('position');
  const planes: THREE.Plane[] = [];
  const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
  for (let i = 0; i < coarseVertices.count; i += 3) {
    a.fromBufferAttribute(coarseVertices, i);
    b.fromBufferAttribute(coarseVertices, i + 1);
    c.fromBufferAttribute(coarseVertices, i + 2);
    planes.push(new THREE.Plane().setFromCoplanarPoints(a, b, c));
  }
  const targets = Array.from({ length: 6 }, () => new Float32Array(vertices.count * 3));
  const barycentric = new Float32Array(vertices.count * 3);
  const faceSeeds = new Float32Array(vertices.count);
  const n = new THREE.Vector3();
  for (let i = 0; i < vertices.count; i++) {
    n.fromBufferAttribute(vertices, i).normalize();
    let radius = Infinity;
    for (const plane of planes) {
      const dot = plane.normal.dot(n);
      if (dot > 0.001) radius = Math.min(radius, -plane.constant / dot);
    }
    const octa = 1 / (Math.abs(n.x) + Math.abs(n.y) + Math.abs(n.z));
    const cube = 1 / Math.max(Math.abs(n.x), Math.abs(n.y), Math.abs(n.z));
    const twist = n.y * 1.2;
    const alignment = Math.max(...planes.map(plane => plane.normal.dot(n)));
    const star = radius * (1 + 0.7 * Math.pow(Math.max(0, (alignment - 0.79465) / 0.20535), 3));
    const positions = [
      [n.x * radius * 2.35, n.y * radius * 2.35, n.z * radius * 2.35],
      [0, 0, 0], // Replaced below with a closed torus with matching face count.
      [n.x * octa * 2.15, n.y * octa * 3.2, n.z * octa * 2.15],
      [(n.x * Math.cos(twist) - n.z * Math.sin(twist)) * cube * 1.35, n.y * cube * 1.6, (n.x * Math.sin(twist) + n.z * Math.cos(twist)) * cube * 1.35],
      [n.x * star * 2.4, n.y * star * 2.4, n.z * star * 2.4],
      [n.x * radius * 2.1, n.y * radius * 2.1, n.z * radius * 2.1],
    ];
    positions.forEach((position, shape) => targets[shape].set(position, i * 3));
    barycentric[i * 3 + i % 3] = 1;
    faceSeeds[i] = (Math.sin(Math.floor(i / 3) * 127.1 + 311.7) * 43758.5453) % 1;
  }

  // A sphere-to-torus UV projection creates triangles across the hole. Instead,
  // pair real torus faces to nearby core faces for continuous surface morphing.
  const torus = new THREE.TorusGeometry(1.7, 0.58, (detail + 1) * 2, (detail + 1) * 5);
  const torusFaces = torus.toNonIndexed();
  const torusPositions = torusFaces.getAttribute('position');
  const faceCount = vertices.count / 3;
  const remaining = new Set(Array.from({ length: faceCount }, (_, i) => i));
  const centers = Array.from({ length: faceCount }, (_, face) => {
    const center = new THREE.Vector3();
    for (let vertex = 0; vertex < 3; vertex++) center.add(a.fromBufferAttribute(torusPositions, face * 3 + vertex));
    return center.divideScalar(3);
  });
  const permutations = [[0, 1, 2], [1, 2, 0], [2, 0, 1]];
  for (let face = 0; face < faceCount; face++) {
    const center = new THREE.Vector3();
    for (let vertex = 0; vertex < 3; vertex++) center.add(a.fromArray(targets[0], face * 9 + vertex * 3));
    center.divideScalar(3);
    let nearest = 0, distance = Infinity;
    for (const candidate of remaining) {
      const cost = centers[candidate].distanceToSquared(center);
      if (cost < distance) { nearest = candidate; distance = cost; }
    }
    remaining.delete(nearest);
    let order = permutations[0], cost = Infinity;
    for (const permutation of permutations) {
      let candidateCost = 0;
      for (let vertex = 0; vertex < 3; vertex++) {
        a.fromArray(targets[0], face * 9 + vertex * 3);
        b.fromBufferAttribute(torusPositions, nearest * 3 + permutation[vertex]);
        candidateCost += a.distanceToSquared(b);
      }
      if (candidateCost < cost) { order = permutation; cost = candidateCost; }
    }
    for (let vertex = 0; vertex < 3; vertex++) {
      a.fromBufferAttribute(torusPositions, nearest * 3 + order[vertex]).toArray(targets[1], face * 9 + vertex * 3);
    }
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(targets[0].slice(), 3).setUsage(THREE.DynamicDrawUsage));
  geometry.setAttribute('aBarycentric', new THREE.BufferAttribute(barycentric, 3));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(faceSeeds, 1));
  geometry.setAttribute('aActivity', new THREE.BufferAttribute(new Float32Array(vertices.count), 1).setUsage(THREE.DynamicDrawUsage));
  geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 15);
  source.dispose();
  coarse.dispose();
  torus.dispose();
  torusFaces.dispose();
  return { geometry, targets, triangleCount: vertices.count / 3 };
}

export interface MeshDynamics {
  offsets: Float32Array;
  velocities: Float32Array;
}

export function createMeshDynamics(triangleCount: number): MeshDynamics {
  return { offsets: new Float32Array(triangleCount * 3), velocities: new Float32Array(triangleCount * 3) };
}

export interface LivingMeshOptions {
  formation?: number;
  time?: number;
  energy?: number;
  ray?: THREE.Ray;
  pressed?: boolean;
  impulse?: number;
  delta?: number;
  instant?: boolean;
  dynamics?: MeshDynamics;
}

/** Faces grow from a travelling cloud; local spring forces respond to the cursor. */
export function updateSculpture(geometry: THREE.BufferGeometry, targets: Float32Array[], stage: number, options: LivingMeshOptions = {}) {
  const from = Math.min(5, Math.max(0, Math.floor(stage)));
  const to = Math.min(5, from + 1);
  const t = Math.min(1, Math.max(0, stage - from));
  const formation = THREE.MathUtils.clamp(options.formation ?? 1, 0, 1);
  const time = options.time ?? 0;
  const energy = options.energy ?? 0;
  const dt = Math.min(0.05, options.delta ?? 1 / 60);
  const output = geometry.getAttribute('position') as THREE.BufferAttribute;
  const positions = output.array as Float32Array;
  const seeds = geometry.getAttribute('aSeed');
  const activity = geometry.getAttribute('aActivity') as THREE.BufferAttribute;
  const highlights = activity.array as Float32Array;
  const first = targets[from], second = targets[to];
  let maxActivity = 0;
  for (let face = 0; face < positions.length; face += 9) {
    let cx = 0, cy = 0, cz = 0;
    for (let v = 0; v < 9; v += 3) {
      cx += first[face + v] + (second[face + v] - first[face + v]) * t;
      cy += first[face + v + 1] + (second[face + v + 1] - first[face + v + 1]) * t;
      cz += first[face + v + 2] + (second[face + v + 2] - first[face + v + 2]) * t;
    }
    cx /= 3; cy /= 3; cz /= 3;
    const seed = Math.abs(seeds.getX(face / 3));
    const length = Math.max(0.001, Math.hypot(cx, cy, cz));
    const local = THREE.MathUtils.clamp((formation - seed * 0.22) / (1 - seed * 0.22), 0, 1);
    const complete = local * local * (3 - 2 * local);
    const scatter = 1 - complete;
    const growth = 0.4 + complete * 0.6;
    const nx = cx / length, ny = cy / length, nz = cz / length;
    const drift = scatter * (time * (0.07 + seed * 0.04) + seed * 4);
    const cosine = Math.cos(drift), sine = Math.sin(drift);
    const radius = scatter * (2.2 + seed * 4.2 + energy * 0.7);
    const breathe = Math.sin(time * 1.25 + cy * 1.1) * 0.065 * complete;
    const expansion = breathe;
    const centerX = cx * growth + (nx * cosine - nz * sine) * radius + nx * expansion;
    const centerY = cy * growth + ny * radius * 0.7 + Math.sin(time * 0.4 + seed * 17) * scatter * 0.45 + ny * expansion;
    const centerZ = cz * growth + (nx * sine + nz * cosine) * radius + nz * expansion;
    const shrink = 0.15 + complete * 0.838;
    let forceX = 0, forceY = 0, forceZ = 0, influence = 0;

    if (options.ray) {
      const ray = options.ray;
      const along = Math.max(0, (centerX - ray.origin.x) * ray.direction.x + (centerY - ray.origin.y) * ray.direction.y + (centerZ - ray.origin.z) * ray.direction.z);
      const dx = centerX - ray.origin.x - ray.direction.x * along;
      const dy = centerY - ray.origin.y - ray.direction.y * along;
      const dz = centerZ - ray.origin.z - ray.direction.z * along;
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      // A spatial field acts only on faces near the actual projected pointer.
      influence = Math.exp(-distance * distance / (options.pressed ? 4.5 : 1.5));
      const amount = influence * (options.pressed ? -2.5 : 1.15 + energy * 0.4 + (options.impulse ?? 0) * 5);
      const divisor = Math.max(0.2, distance);
      forceX = dx / divisor * amount - ray.direction.x * influence * 0.45;
      forceY = dy / divisor * amount - ray.direction.y * influence * 0.45;
      forceZ = dz / divisor * amount - ray.direction.z * influence * 0.45;
    }

    const dynamicsIndex = face / 3;
    let offsetX = 0, offsetY = 0, offsetZ = 0;
    if (options.dynamics) {
      const { offsets, velocities } = options.dynamics;
      for (let axis = 0; axis < 3; axis++) {
        const index = dynamicsIndex + axis;
        const force = axis === 0 ? forceX : axis === 1 ? forceY : forceZ;
        if (options.instant) {
          offsets[index] = force;
          velocities[index] = 0;
        } else {
          velocities[index] += (force - offsets[index]) * 48 * dt;
          velocities[index] *= Math.exp(-8 * dt);
          offsets[index] = THREE.MathUtils.clamp(offsets[index] + velocities[index] * dt, -3, 3);
        }
      }
      offsetX = offsets[dynamicsIndex]; offsetY = offsets[dynamicsIndex + 1]; offsetZ = offsets[dynamicsIndex + 2];
    }
    const highlight = Math.min(1, influence * 0.85 + Math.hypot(offsetX, offsetY, offsetZ) * 0.2);
    maxActivity = Math.max(maxActivity, highlight);
    const spin = scatter * (seed * 10 + time * (0.3 + seed * 0.2)) + highlight * 0.18;
    const cosSpin = Math.cos(spin), sinSpin = Math.sin(spin);
    for (let v = 0; v < 9; v += 3) {
      const x = first[face + v] + (second[face + v] - first[face + v]) * t;
      const y = first[face + v + 1] + (second[face + v + 1] - first[face + v + 1]) * t;
      const z = first[face + v + 2] + (second[face + v + 2] - first[face + v + 2]) * t;
      const localX = (x - cx) * shrink, localY = (y - cy) * shrink, localZ = (z - cz) * shrink;
      positions[face + v] = centerX + localX * cosSpin - localY * sinSpin + offsetX;
      positions[face + v + 1] = centerY + localX * sinSpin + localY * cosSpin + offsetY;
      positions[face + v + 2] = centerZ + localZ + offsetZ;
      highlights[face / 3 + v / 3] = highlight;
    }
  }
  output.needsUpdate = true;
  activity.needsUpdate = true;
  return maxActivity;
}
