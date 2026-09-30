import test from 'node:test';
import assert from 'node:assert/strict';
import * as THREE from 'three';
import { createMeshDynamics, createSculptureGeometry, updateSculpture } from '../src/three/meshGeometry.ts';
import { sampleMeshFlight } from '../src/three/meshFlight.ts';

for (const detail of [2, 4]) {
  test(`detail ${detail}: all morph states are finite and bounded`, () => {
    const { geometry, targets, triangleCount } = createSculptureGeometry(detail);
    assert.equal(targets.length, 6);
    assert.equal(triangleCount, 20 * (detail + 1) ** 2);
    for (let stage = 0; stage <= 5; stage += 0.025) {
      updateSculpture(geometry, targets, stage);
      const positions = geometry.getAttribute('position').array;
      for (const value of positions) {
        assert.ok(Number.isFinite(value), `invalid vertex at stage ${stage}`);
        assert.ok(Math.abs(value) <= 5, `vertex escapes the culling bounds at stage ${stage}`);
      }
    }
    geometry.dispose();
  });

  test(`detail ${detail}: torus surface preserves its opening and every face`, () => {
    const { geometry, targets } = createSculptureGeometry(detail);
    const torus = targets[1];
    for (let i = 0; i < torus.length; i += 3) {
      const radius = Math.hypot(torus[i], torus[i + 1]);
      assert.ok(radius > 1.1, 'a vertex crosses the torus opening');
      assert.ok(Math.abs(Math.hypot(radius - 1.7, torus[i + 2]) - 0.58) < 1e-5);
    }
    const faces = new Set();
    for (let i = 0; i < torus.length; i += 9) {
      const corners = [0, 3, 6].map(offset => Array.from(torus.slice(i + offset, i + offset + 3)).map(v => v.toFixed(5)).join(','));
      faces.add(corners.sort().join('|'));
    }
    assert.equal(faces.size, torus.length / 9, 'face pairing duplicated or lost a triangle');
    geometry.dispose();
  });

  test(`detail ${detail}: morphs remain continuous across chapter boundaries`, () => {
    const { geometry, targets } = createSculptureGeometry(detail);
    for (let stage = 1; stage < 5; stage++) {
      updateSculpture(geometry, targets, stage - 1e-6);
      const before = geometry.getAttribute('position').array.slice();
      updateSculpture(geometry, targets, stage + 1e-6);
      const after = geometry.getAttribute('position').array;
      for (let i = 0; i < before.length; i++) assert.ok(Math.abs(before[i] - after[i]) < 0.0001);
    }
    geometry.dispose();
  });
}

test('scroll formation grows faces and gathers a dispersed cloud into a completed surface', () => {
  const { geometry, targets } = createSculptureGeometry(4);
  const extent = () => {
    const p = geometry.getAttribute('position').array;
    let radius = 0, area = 0;
    const a = new THREE.Vector3(), b = new THREE.Vector3(), c = new THREE.Vector3();
    for (let i = 0; i < p.length; i += 9) {
      a.fromArray(p, i); b.fromArray(p, i + 3); c.fromArray(p, i + 6);
      radius = Math.max(radius, a.length(), b.length(), c.length());
      area += new THREE.Triangle(a, b, c).getArea();
    }
    return { radius, area };
  };
  updateSculpture(geometry, targets, 0, { formation: 0, time: 1 });
  const cloud = extent();
  updateSculpture(geometry, targets, 0, { formation: 1, time: 1 });
  const complete = extent();
  assert.ok(cloud.radius > complete.radius * 2, 'disintegration must visibly spread across space');
  assert.ok(complete.area > cloud.area * 10, 'faces must actually grow during assembly');
  geometry.dispose();
});

test('hover displaces nearby faces, holding attracts them, and springs recover after leaving', () => {
  const { geometry, targets, triangleCount } = createSculptureGeometry(4);
  const dynamics = createMeshDynamics(triangleCount);
  const ray = new THREE.Ray(new THREE.Vector3(1.6, 0, 10), new THREE.Vector3(0, 0, -1));
  const maxOffset = () => Math.max(...Array.from(dynamics.offsets, Math.abs));
  for (let frame = 0; frame < 60; frame++) updateSculpture(geometry, targets, 0, { ray, dynamics });
  assert.ok(maxOffset() > 0.3, 'hover must deform vertices rather than just rotate the object');
  const repelled = dynamics.offsets.slice();
  for (let frame = 0; frame < 60; frame++) updateSculpture(geometry, targets, 0, { ray, pressed: true, dynamics });
  let reversed = 0;
  for (let i = 0; i < repelled.length; i += 3) {
    if (Math.abs(repelled[i]) > 0.1 && repelled[i] * dynamics.offsets[i] < 0) reversed++;
  }
  assert.ok(reversed > 10, 'holding must reverse the local field toward the cursor');
  for (let frame = 0; frame < 240; frame++) updateSculpture(geometry, targets, 0, { dynamics });
  assert.ok(maxOffset() < 0.001, 'mesh must recover after pointer exit');
  geometry.dispose();
});

test('live mesh remains finite and within its bounds through growth, scatter, and pointer impulses', () => {
  const { geometry, targets, triangleCount } = createSculptureGeometry(2);
  const dynamics = createMeshDynamics(triangleCount);
  const ray = new THREE.Ray(new THREE.Vector3(1, 0, 10), new THREE.Vector3(0, 0, -1));
  for (let frame = 0; frame < 300; frame++) {
    updateSculpture(geometry, targets, frame / 60, {
      formation: (Math.sin(frame * 0.03) + 1) / 2, time: frame / 60,
      energy: 2, ray, impulse: 1, pressed: frame % 50 < 25, dynamics,
    });
    for (const value of geometry.getAttribute('position').array) {
      assert.ok(Number.isFinite(value));
      assert.ok(Math.abs(value) < 15);
    }
  }
  geometry.dispose();
});

test('all three scroll routes travel continuously and reverse through the same positions', () => {
  for (const role of [0, 1, 2]) {
    let previous = sampleMeshFlight(role, 0);
    let distance = 0;
    for (let i = 1; i <= 1000; i++) {
      const point = sampleMeshFlight(role, i / 1000);
      const step = Math.hypot(point.x - previous.x, point.y - previous.y, point.z - previous.z);
      assert.ok(step < 0.02, 'scroll route must not jump between points');
      assert.ok(Math.abs(point.x) <= 0.45 && Math.abs(point.y) <= 0.4);
      distance += step;
      previous = point;
    }
    assert.ok(distance > 2, 'each mesh must travel rather than stay anchored');
    for (let boundary = 1; boundary < 6; boundary++) {
      const before = sampleMeshFlight(role, boundary / 6 - 1e-6);
      const after = sampleMeshFlight(role, boundary / 6 + 1e-6);
      assert.ok(Math.hypot(before.x - after.x, before.y - after.y, before.z - after.z) < 1e-8);
    }
  }
});

test('assembled scroll morphs interpolate their surface without radial explosions', () => {
  const { geometry, targets } = createSculptureGeometry(4);
  for (let stage = 0; stage <= 5; stage += 0.025) {
    updateSculpture(geometry, targets, stage, { formation: 1 });
    const positions = geometry.getAttribute('position').array;
    const from = Math.floor(stage), to = Math.min(5, from + 1), blend = stage - from;
    // Fully assembled face centers must follow the interpolated surface exactly.
    for (let face = 0; face < positions.length; face += 9) {
      for (let axis = 0; axis < 3; axis++) {
        let actual = 0, expected = 0;
        for (let vertex = 0; vertex < 3; vertex++) {
          const index = face + vertex * 3 + axis;
          actual += positions[index];
          expected += targets[from][index] * (1 - blend) + targets[to][index] * blend;
        }
        // Breathing is bounded to .065; no transition-dependent scatter or burst.
        assert.ok(Math.abs(actual / 3 - expected / 3) < 0.066);
      }
    }
  }
  geometry.dispose();
});
